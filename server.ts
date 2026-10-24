// doany.io の配信サーバー。Astro が書き出した dist/ を返し、次の 3 つだけを自前でする
// - POST /api/contact: 問い合わせフォーム(server/contact.ts)
// - GET  /healthz: k8s のプローブ用
// - dist/ に無いパス: 旧ブログの URL とみなして https://b.doany.io の同じパスへ 301(server/static.ts)
//
// 環境変数
//   PORT                 待ち受けるポート(既定 8080)
//   DIST_DIR             配信するディレクトリ(既定 ./dist)
//   CONTACT_WEBHOOK_URL  問い合わせを送る hookshot の汎用 webhook
//   TURNSTILE_SECRET     Cloudflare Turnstile のシークレットキー
import path from "node:path";
import { type ContactDeps, handleContact } from "./server/contact";
import { contactFormRenderer } from "./server/contact-page";
import { RateLimiter } from "./server/rate-limit";
import { listFiles, resolvePath, serveFile } from "./server/static";

/** すべての応答に付けるヘッダ(ブログの Caddyfile と同じ) */
export const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  "Content-Security-Policy": "frame-ancestors 'none'",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

export interface AppOptions {
  distDir: string;
  files: ReadonlySet<string>;
  contact: Omit<ContactDeps, "remoteAddress">;
}

export function createApp(opts: AppOptions) {
  const route = async (
    req: Request,
    remoteAddress?: string,
  ): Promise<Response> => {
    const url = new URL(req.url);
    const { pathname } = url;

    if (pathname === "/healthz") {
      return new Response("ok\n", {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    }

    if (pathname === "/api/contact") {
      if (req.method !== "POST") {
        return Response.json(
          { ok: false, error: "method_not_allowed" },
          { status: 405, headers: { Allow: "POST" } },
        );
      }
      return handleContact(req, { ...opts.contact, remoteAddress });
    }
    if (pathname.startsWith("/api/")) {
      return Response.json({ ok: false, error: "not_found" }, { status: 404 });
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      return new Response("Method Not Allowed\n", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    const resolved = resolvePath(pathname, url.search, opts.files);
    if (resolved.kind === "redirect") {
      return new Response(null, {
        status: 301,
        headers: { Location: resolved.location },
      });
    }
    return serveFile(opts.distDir, resolved.file, req);
  };

  return async (req: Request, remoteAddress?: string): Promise<Response> => {
    let res: Response;
    try {
      res = await route(req, remoteAddress);
    } catch (e) {
      console.error(
        `error: ${req.method} ${new URL(req.url).pathname}: ${e instanceof Error ? e.message : e}`,
      );
      res = new Response("Internal Server Error\n", { status: 500 });
    }
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
      if (!res.headers.has(k)) res.headers.set(k, v);
    }
    return res;
  };
}

if (import.meta.main) {
  const distDir = path.resolve(process.env.DIST_DIR ?? "dist");
  const files = await listFiles(distDir);
  // 1 時間に 5 回まで(IP ごと)
  const limiter = new RateLimiter(5, 60 * 60 * 1000);
  setInterval(() => limiter.prune(), 10 * 60 * 1000).unref();

  const app = createApp({
    distDir,
    files,
    contact: {
      env: {
        webhookUrl: process.env.CONTACT_WEBHOOK_URL || undefined,
        turnstileSecret: process.env.TURNSTILE_SECRET || undefined,
      },
      fetch,
      limiter,
      renderForm: contactFormRenderer(distDir),
    },
  });

  const server = Bun.serve({
    port: Number(process.env.PORT ?? 8080),
    fetch: (req, srv) => app(req, srv.requestIP(req)?.address),
  });
  console.info(
    `listening on :${server.port} (${files.size} files from ${distDir})`,
  );

  // k8s が止めるときは、受けている要求を終えてから抜ける
  process.on("SIGTERM", async () => {
    await server.stop();
    process.exit(0);
  });
}
