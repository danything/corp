// POST /api/contact。問い合わせフォームを受け、Turnstile を確かめてから Matrix(hookshot の webhook)へ送る。
//
// 受け付けるのは JSON と、フォームの送信そのもの(application/x-www-form-urlencoded)の 2 通り。
// - JSON で送られたか、Accept に application/json があれば JSON で返す({ ok } か { ok: false, error })。
//   ページの JavaScript(src/scripts/contact.ts)はこちら
// - それ以外(JavaScript を使わないフォームの送信)は、成功なら完了のページへ 303、
//   失敗ならフォームのページに入力とエラーを書き戻して返す(contact-page.ts)
//
// 利用者の入力(名前・メール・本文)はログに出さない
import { buildContactMarkdown } from "./markdown";
import type { RateLimiter } from "./rate-limit";

export const FIELDS = ["name", "email", "company", "message"] as const;
export type Field = (typeof FIELDS)[number];
export type Lang = "ja" | "en";

/** 項目ごとの上限(文字数)。名前・本文は必須 */
export const LIMITS: Record<Field, number> = {
  name: 100,
  email: 254,
  company: 100,
  message: 5000,
};
/** 受け付ける本文の大きさ(バイト)。上限いっぱいの入力でも収まる */
export const MAX_BODY_BYTES = 64 * 1024;

/** ボット除けの見えない項目。人には見えないので、値があればボットとみなす */
export const HONEYPOT_FIELD = "website";
/** Turnstile のウィジェットがフォームに足す項目 */
export const TOKEN_FIELD = "cf-turnstile-response";

export const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type ErrorCode =
  | "invalid"
  | "turnstile"
  | "rate_limited"
  | "too_large"
  | "unsupported"
  | "unavailable"
  | "send_failed";

const STATUS: Record<ErrorCode, number> = {
  invalid: 400,
  turnstile: 400,
  rate_limited: 429,
  too_large: 413,
  unsupported: 415,
  unavailable: 503,
  send_failed: 502,
};

export interface ContactInput {
  name: string;
  email: string;
  company: string;
  message: string;
  honeypot: string;
  token: string;
  lang: Lang;
}

/** フォームの値を取り出す。文字列でない値は空とみなす */
export function parseInput(get: (key: string) => unknown): ContactInput {
  const str = (key: string) => {
    const v = get(key);
    return typeof v === "string" ? v : "";
  };
  return {
    name: str("name").trim(),
    email: str("email").trim(),
    company: str("company").trim(),
    message: str("message").replace(/\r\n?/g, "\n").trim(),
    honeypot: str(HONEYPOT_FIELD),
    token: str(TOKEN_FIELD),
    lang: str("lang") === "en" ? "en" : "ja",
  };
}

// 形だけを見る(@ の前後に空白と @ 以外があり、ドメインに . がある)。届くかどうかは返信で分かる
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 文字数(サロゲートペアも 1 文字) */
const length = (s: string) => [...s].length;

/** 誤りのある項目を返す。空なら問題なし */
export function validate(input: ContactInput): Field[] {
  const invalid: Field[] = [];
  if (!input.name || length(input.name) > LIMITS.name) invalid.push("name");
  if (
    !input.email ||
    length(input.email) > LIMITS.email ||
    !EMAIL_RE.test(input.email)
  )
    invalid.push("email");
  if (length(input.company) > LIMITS.company) invalid.push("company");
  if (!input.message || length(input.message) > LIMITS.message)
    invalid.push("message");
  return invalid;
}

export type VerifyResult = "ok" | "rejected" | "error";

/** Turnstile のトークンを Cloudflare に確かめる */
export async function verifyTurnstile(
  token: string,
  secret: string,
  ip: string | undefined,
  fetchFn: typeof fetch,
): Promise<VerifyResult> {
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  try {
    const res = await fetchFn(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return "error";
    const data = (await res.json()) as { success?: unknown };
    return data.success === true ? "ok" : "rejected";
  } catch {
    return "error";
  }
}

/** 利用者の IP。前段の Cloudflare が付ける CF-Connecting-IP、無ければ X-Forwarded-For の先頭 */
export function clientIp(req: Request, fallback?: string): string | undefined {
  const cf = req.headers.get("cf-connecting-ip")?.trim();
  if (cf) return cf;
  const xff = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (xff) return xff;
  return fallback;
}

export interface ContactEnv {
  /** hookshot の汎用 webhook の URL(CONTACT_WEBHOOK_URL) */
  webhookUrl?: string;
  /** Turnstile のシークレットキー(TURNSTILE_SECRET) */
  turnstileSecret?: string;
}

export interface ContactDeps {
  env: ContactEnv;
  fetch: typeof fetch;
  limiter: RateLimiter;
  /**
   * JavaScript を使わない送信が失敗したときに返すページ(フォームに入力とエラーを書き戻したもの)。
   * 無ければ JSON で返す
   */
  renderForm?: (
    lang: Lang,
    error: ErrorCode,
    input: ContactInput | undefined,
    invalid: Field[],
    status: number,
  ) => Promise<Response>;
  /** 接続元の IP(ヘッダが無いとき) */
  remoteAddress?: string;
}

/** 完了のページ */
export const thanksPath = (lang: Lang) =>
  lang === "en" ? "/en/contact/thanks/" : "/contact/thanks/";

type Body =
  | { kind: "ok"; json: boolean; get: (key: string) => unknown }
  | { kind: "error"; error: ErrorCode };

async function readBody(req: Request): Promise<Body> {
  const type = (req.headers.get("content-type") ?? "")
    .split(";")[0]
    ?.trim()
    .toLowerCase();
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return { kind: "error", error: "too_large" };
  if (
    type !== "application/json" &&
    type !== "application/x-www-form-urlencoded"
  )
    return { kind: "error", error: "unsupported" };
  const buf = await req.arrayBuffer();
  if (buf.byteLength > MAX_BODY_BYTES)
    return { kind: "error", error: "too_large" };
  const text = new TextDecoder().decode(buf);
  if (type === "application/json") {
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      return { kind: "error", error: "invalid" };
    }
    if (!data || typeof data !== "object" || Array.isArray(data))
      return { kind: "error", error: "invalid" };
    const record = data as Record<string, unknown>;
    return {
      kind: "ok",
      json: true,
      get: (key) => (Object.hasOwn(record, key) ? record[key] : undefined),
    };
  }
  const params = new URLSearchParams(text);
  return { kind: "ok", json: false, get: (key) => params.get(key) };
}

const json = (body: unknown, status = 200, headers?: HeadersInit) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });

export async function handleContact(
  req: Request,
  deps: ContactDeps,
): Promise<Response> {
  const body = await readBody(req);
  const wantsJson =
    (body.kind === "ok" && body.json) ||
    (req.headers.get("accept") ?? "").includes("application/json") ||
    !deps.renderForm;
  const input = body.kind === "ok" ? parseInput(body.get) : undefined;
  const lang: Lang = input?.lang ?? "ja";

  const fail = async (
    error: ErrorCode,
    invalid: Field[] = [],
    headers?: Record<string, string>,
  ) => {
    const status = STATUS[error];
    if (wantsJson || !deps.renderForm) {
      return json(
        { ok: false, error, ...(invalid.length ? { fields: invalid } : {}) },
        status,
        headers,
      );
    }
    const res = await deps.renderForm(lang, error, input, invalid, status);
    for (const [k, v] of Object.entries(headers ?? {})) res.headers.set(k, v);
    return res;
  };
  const succeed = () =>
    wantsJson
      ? json({ ok: true })
      : new Response(null, {
          status: 303,
          headers: { Location: thanksPath(lang), "Cache-Control": "no-store" },
        });

  if (body.kind === "error" || !input) {
    return fail(body.kind === "error" ? body.error : "invalid");
  }

  // ボット(見えない項目に値がある)には成功と同じ応答を返し、何も送らない
  if (input.honeypot) {
    console.info("contact: honeypot に値があったので捨てた");
    return succeed();
  }

  const invalid = validate(input);
  if (invalid.length) return fail("invalid", invalid);
  if (!input.token || input.token.length > 2048) return fail("turnstile");

  const { webhookUrl, turnstileSecret } = deps.env;
  if (!webhookUrl || !turnstileSecret) {
    console.error(
      "contact: CONTACT_WEBHOOK_URL か TURNSTILE_SECRET が設定されていない",
    );
    return fail("unavailable");
  }

  // 数えるのは形の整った送信だけ(入力の誤りを直して送り直す人を締め出さない)。
  // Turnstile の確認より前に数えて、Cloudflare への問い合わせも回数で抑える
  const ip = clientIp(req, deps.remoteAddress);
  const taken = deps.limiter.take(ip ?? "unknown");
  if (!taken.ok) {
    console.warn("contact: 回数制限で断った");
    return fail("rate_limited", [], {
      "Retry-After": String(taken.retryAfterSec),
    });
  }

  const verified = await verifyTurnstile(
    input.token,
    turnstileSecret,
    ip,
    deps.fetch,
  );
  if (verified === "error") {
    console.error("contact: Turnstile の確認に失敗した");
    return fail("unavailable");
  }
  if (verified === "rejected") {
    console.warn("contact: Turnstile のトークンが通らなかった");
    return fail("turnstile");
  }

  const text = buildContactMarkdown({ ...input, ip });
  try {
    const res = await deps.fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error(`contact: webhook が ${res.status} を返した`);
      return fail("send_failed");
    }
  } catch (e) {
    console.error(
      `contact: webhook に送れなかった (${e instanceof Error ? e.name : "error"})`,
    );
    return fail("send_failed");
  }
  console.info(`contact: 送信した (${lang})`);
  return succeed();
}
