// server.ts の振る舞い(問い合わせ・転送・配信)。dist/ の代わりに一時ディレクトリに小さなページを置き、
// Turnstile と webhook への fetch は差し替える
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { createApp } from "../server";
import { TURNSTILE_VERIFY_URL } from "../server/contact";
import { contactFormRenderer } from "../server/contact-page";
import { RateLimiter } from "../server/rate-limit";
import { BLOG_ORIGIN, listFiles } from "../server/static";

const WEBHOOK = "https://m.example/webhook/abc";

// src/components/ContactForm.astro と同じ作りの最小のフォーム
const FORM_HTML = (lang: string) => `<!DOCTYPE html><html lang="${lang}"><body>
<form method="post" action="/api/contact" data-contact>
<div data-contact-status role="alert" hidden data-msg-invalid="${lang}:invalid" data-msg-turnstile="${lang}:turnstile" data-msg-rate_limited="${lang}:rate_limited" data-msg-unavailable="${lang}:unavailable"></div>
<input type="hidden" name="lang" value="${lang}">
<input id="name" name="name" type="text">
<input id="email" name="email" type="email">
<input id="company" name="company" type="text">
<textarea id="message" name="message"></textarea>
<input id="website" name="website" type="text">
</form></body></html>`;

let dir: string;
let calls: { url: string; init?: RequestInit }[];
let turnstileResult: unknown;
let webhookStatus: number;
let app: ReturnType<typeof createApp>;
let env: { webhookUrl?: string; turnstileSecret?: string };

const fakeFetch = (async (
  input: string | URL | Request,
  init?: RequestInit,
) => {
  const url = String(input instanceof Request ? input.url : input);
  calls.push({ url, init });
  if (url === TURNSTILE_VERIFY_URL) {
    if (turnstileResult instanceof Error) throw turnstileResult;
    return Response.json(turnstileResult);
  }
  if (url === WEBHOOK) return new Response("", { status: webhookStatus });
  throw new Error(`unexpected fetch ${url}`);
}) as typeof fetch;

beforeAll(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "corp-test-"));
  await Bun.write(path.join(dir, "index.html"), "<h1>Doa</h1>");
  await Bun.write(path.join(dir, "index.html.br"), "brotli");
  await Bun.write(path.join(dir, "en/index.html"), "<h1>Doa en</h1>");
  await Bun.write(path.join(dir, "contact/index.html"), FORM_HTML("ja"));
  await Bun.write(path.join(dir, "en/contact/index.html"), FORM_HTML("en"));
  await Bun.write(path.join(dir, "_astro/a.123.css"), "body{}");
});

afterAll(async () => {
  await rm(dir, { recursive: true, force: true });
});

beforeEach(async () => {
  calls = [];
  turnstileResult = { success: true };
  webhookStatus = 200;
  env = { webhookUrl: WEBHOOK, turnstileSecret: "secret" };
  app = createApp({
    distDir: dir,
    files: await listFiles(dir),
    contact: {
      env,
      fetch: fakeFetch,
      limiter: new RateLimiter(5, 60 * 60 * 1000),
      renderForm: contactFormRenderer(dir),
    },
  });
});

const valid = {
  name: "山田 太郎",
  email: "taro@example.com",
  company: "",
  message: "見積もりをお願いします。",
  website: "",
  "cf-turnstile-response": "token",
  lang: "ja",
};

const postJson = (body: unknown, headers: Record<string, string> = {}) =>
  app(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
    }),
  );

const postForm = (
  body: Record<string, string>,
  headers: Record<string, string> = {},
) =>
  app(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...headers,
      },
      body: new URLSearchParams(body),
    }),
  );

describe("POST /api/contact", () => {
  test("正しい送信は Turnstile を確かめて webhook に送る", async () => {
    const res = await postJson(valid, { "CF-Connecting-IP": "203.0.113.5" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    expect(calls.map((c) => c.url)).toEqual([TURNSTILE_VERIFY_URL, WEBHOOK]);
    const verify = new URLSearchParams(String(calls[0]?.init?.body));
    expect(verify.get("secret")).toBe("secret");
    expect(verify.get("response")).toBe("token");
    expect(verify.get("remoteip")).toBe("203.0.113.5");

    const payload = JSON.parse(String(calls[1]?.init?.body));
    expect(Object.keys(payload)).toEqual(["text"]);
    expect(payload.text).toContain("`山田 太郎`");
    expect(payload.text).toContain("```\n見積もりをお願いします。\n```");
  });

  test("webhook への本文は入力の Markdown を崩してある", async () => {
    await postJson({
      ...valid,
      name: "**緊急** [こちら](https://evil.example) @room",
    });
    const { text } = JSON.parse(String(calls[1]?.init?.body));
    expect(text).toContain(
      "`**緊急** [こちら](https://evil.example) @\u200Broom`",
    );
    expect(text).not.toContain("@room");
  });

  test("入力の誤りは 400 と項目名", async () => {
    const res = await postJson({
      ...valid,
      name: "",
      email: "not-an-email",
      message: "あ".repeat(5001),
    });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      ok: false,
      error: "invalid",
      fields: ["name", "email", "message"],
    });
    expect(calls).toHaveLength(0);
  });

  test("トークンが無ければ 400", async () => {
    const res = await postJson({ ...valid, "cf-turnstile-response": "" });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "turnstile" });
    expect(calls).toHaveLength(0);
  });

  test("Turnstile に断られたら送らない", async () => {
    turnstileResult = {
      success: false,
      "error-codes": ["invalid-input-response"],
    };
    const res = await postJson(valid);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "turnstile" });
    expect(calls.map((c) => c.url)).toEqual([TURNSTILE_VERIFY_URL]);
  });

  test("Turnstile に問い合わせられなければ 503", async () => {
    turnstileResult = new Error("network");
    const res = await postJson(valid);
    expect(res.status).toBe(503);
    expect(calls.map((c) => c.url)).toEqual([TURNSTILE_VERIFY_URL]);
  });

  test("見えない項目に値があれば、成功を装って何も送らない", async () => {
    const res = await postJson({ ...valid, website: "https://spam.example" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(calls).toHaveLength(0);
  });

  test("IP ごとに 1 時間 5 回まで", async () => {
    const headers = { "X-Forwarded-For": "198.51.100.7, 10.0.0.1" };
    for (let i = 0; i < 5; i++) {
      expect((await postJson(valid, headers)).status).toBe(200);
    }
    const res = await postJson(valid, headers);
    expect(res.status).toBe(429);
    expect(Number(res.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect(await res.json()).toEqual({ ok: false, error: "rate_limited" });
    // 別の IP は通る
    expect(
      (await postJson(valid, { "X-Forwarded-For": "198.51.100.8" })).status,
    ).toBe(200);
  });

  test("webhook が失敗したら 502", async () => {
    webhookStatus = 500;
    const res = await postJson(valid);
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ ok: false, error: "send_failed" });
  });

  test("設定が無ければ 503", async () => {
    env.turnstileSecret = undefined;
    const res = await postJson(valid);
    expect(res.status).toBe(503);
    expect(calls).toHaveLength(0);
  });

  test("JSON でもフォームでもない送信は 415、壊れた JSON は 400", async () => {
    const res = await app(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: "hello",
      }),
    );
    expect(res.status).toBe(415);
    const broken = await app(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{",
      }),
    );
    expect(broken.status).toBe(400);
  });

  test("大きすぎる本文は 413", async () => {
    const res = await postJson({ ...valid, message: "a".repeat(70_000) });
    expect(res.status).toBe(413);
  });

  test("GET は 405", async () => {
    const res = await app(new Request("http://localhost/api/contact"));
    expect(res.status).toBe(405);
    expect(res.headers.get("Allow")).toBe("POST");
  });

  describe("JavaScript を使わないフォームの送信", () => {
    test("成功したら完了のページへ 303", async () => {
      const res = await postForm(valid);
      expect(res.status).toBe(303);
      expect(res.headers.get("Location")).toBe("/contact/thanks/");
      const en = await postForm({ ...valid, lang: "en" });
      expect(en.headers.get("Location")).toBe("/en/contact/thanks/");
    });

    test("失敗したらフォームに入力とエラーを書き戻す", async () => {
      const res = await postForm({
        ...valid,
        lang: "en",
        email: "bad",
        name: '"><script>alert(1)</script>',
        message: "</textarea><b>x</b>",
      });
      expect(res.status).toBe(400);
      expect(res.headers.get("Content-Type")).toContain("text/html");
      const html = await res.text();
      expect(html).toContain('<html lang="en">');
      expect(html).toMatch(/data-contact-status[^>]*>en:invalid</);
      expect(html).not.toMatch(/data-contact-status[^>]*hidden/);
      expect(html).toContain(
        'name="email" type="email" value="bad" aria-invalid="true" aria-describedby="email-error"',
      );
      // 値はエスケープされる
      expect(html).toContain('value="&quot;><script>alert(1)</script>"');
      expect(html).toContain(
        "&lt;/textarea&gt;&lt;b&gt;x&lt;/b&gt;</textarea>",
      );
    });

    test("Accept: application/json なら JSON で返す(ページの fetch)", async () => {
      const res = await postForm(
        { ...valid, "cf-turnstile-response": "" },
        { Accept: "application/json" },
      );
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ ok: false, error: "turnstile" });
    });
  });
});

describe("配信と転送", () => {
  test("/ と /en/ を返す", async () => {
    const res = await app(new Request("http://localhost/"));
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/html");
    expect(res.headers.get("Cache-Control")).toBe(
      "public, max-age=0, must-revalidate",
    );
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(await res.text()).toBe("<h1>Doa</h1>");
    expect(await (await app(new Request("http://localhost/en/"))).text()).toBe(
      "<h1>Doa en</h1>",
    );
  });

  test("br を受け付けるなら .br を返す", async () => {
    const res = await app(
      new Request("http://localhost/", {
        headers: { "Accept-Encoding": "gzip, br" },
      }),
    );
    expect(res.headers.get("Content-Encoding")).toBe("br");
    expect(res.headers.get("Content-Type")).toContain("text/html");
  });

  test("_astro は長期キャッシュ", async () => {
    const res = await app(new Request("http://localhost/_astro/a.123.css"));
    expect(res.headers.get("Cache-Control")).toContain("immutable");
    expect(res.headers.get("Content-Type")).toContain("text/css");
  });

  test("旧ブログの URL は b.doany.io へ 301", async () => {
    const res = await app(new Request("http://localhost/posts/renewal/?utm=x"));
    expect(res.status).toBe(301);
    expect(res.headers.get("Location")).toBe(
      `${BLOG_ORIGIN}/posts/renewal/?utm=x`,
    );
    const head = await app(
      new Request("http://localhost/about/", { method: "HEAD" }),
    );
    expect(head.status).toBe(301);
    expect(head.headers.get("Location")).toBe(`${BLOG_ORIGIN}/about/`);
  });

  test("/contact は /contact/ へ", async () => {
    const res = await app(new Request("http://localhost/contact"));
    expect(res.status).toBe(301);
    expect(res.headers.get("Location")).toBe("/contact/");
  });

  test("HEAD は本文なしで長さだけ", async () => {
    const res = await app(new Request("http://localhost/", { method: "HEAD" }));
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Length")).toBe("12");
    expect(await res.text()).toBe("");
  });

  test("GET・HEAD 以外は 405、/api/ の知らないパスは 404", async () => {
    expect(
      (await app(new Request("http://localhost/", { method: "POST" }))).status,
    ).toBe(405);
    expect((await app(new Request("http://localhost/api/nope"))).status).toBe(
      404,
    );
  });

  test("/healthz は 200", async () => {
    const res = await app(new Request("http://localhost/healthz"));
    expect(res.status).toBe(200);
  });
});
