// dist/ の静的ファイルの配信と、旧ブログの URL の転送。
//
// doany.io にはもともとブログ(danything/blog)があり、b.doany.io へ移った。外から張られた
// 旧ブログの URL(/posts/... など)を生かすため、dist/ に無いパスは b.doany.io の同じパスへ
// 301 で送る。この判定はファイルの一覧(起動時に 1 回だけ読む)だけで決めるので、
// 一覧に無いパスでファイルシステムに触ることは無い(../ などでの抜け出しも起きない)
import { readdir } from "node:fs/promises";
import path from "node:path";

/** 移った先のブログ。dist/ に無いパスはここの同じパスへ送る */
export const BLOG_ORIGIN = "https://b.doany.io";

/**
 * dist/ のファイルを "/en/index.html" の形で集める。.br(scripts/precompress.ts が書き出す
 * 圧縮済みの版)は URL としては見せないので入れない
 */
export async function listFiles(dir: string): Promise<Set<string>> {
	const entries = await readdir(dir, { recursive: true, withFileTypes: true });
	const files = new Set<string>();
	for (const e of entries) {
		if (!e.isFile() || e.name.endsWith(".br")) continue;
		const rel = path.relative(dir, path.join(e.parentPath, e.name));
		files.add(`/${rel.split(path.sep).join("/")}`);
	}
	return files;
}

export type Resolution =
	| { kind: "file"; file: string }
	| { kind: "redirect"; location: string };

/**
 * URL のパスを dist/ のファイルか転送先に決める。Astro は trailingSlash: "always" で
 * ページを /contact/index.html に書き出すので、
 * - "/contact/" → /contact/index.html
 * - "/contact"  → "/contact/" へ 301(ページがあるとき)
 * - "/favicon.png" のようなファイルはそのまま
 * - どれでもなければ旧ブログの URL とみなして b.doany.io の同じパス(とクエリ)へ 301
 *
 * pathname は URL オブジェクトのもの(パーセントエンコードされたまま)を渡す
 */
export function resolvePath(
	pathname: string,
	search: string,
	files: ReadonlySet<string>,
): Resolution {
	let decoded: string | undefined;
	try {
		decoded = decodeURIComponent(pathname);
	} catch {
		// 壊れたエンコードはファイルとしては探さず、そのまま転送する
	}
	if (decoded !== undefined) {
		if (decoded.endsWith("/")) {
			if (files.has(`${decoded}index.html`))
				return { kind: "file", file: `${decoded}index.html` };
		} else if (files.has(decoded)) {
			return { kind: "file", file: decoded };
		} else if (files.has(`${decoded}/index.html`)) {
			return { kind: "redirect", location: `${pathname}/${search}` };
		}
	}
	return { kind: "redirect", location: `${BLOG_ORIGIN}${pathname}${search}` };
}

/** ファイル名にハッシュが付くもの(Astro の _astro/)だけ長期キャッシュ。HTML などは都度検証させる */
export function cacheControl(file: string): string {
	if (file.startsWith("/_astro/")) return "public, max-age=31536000, immutable";
	if (file.startsWith("/static/")) return "public, max-age=604800";
	return "public, max-age=0, must-revalidate";
}

/** Accept-Encoding に br があるか(q=0 で断られていないか) */
export function acceptsBrotli(acceptEncoding: string | null): boolean {
	if (!acceptEncoding) return false;
	return acceptEncoding.split(",").some((part) => {
		const [name, ...params] = part.trim().split(";");
		if (name?.trim().toLowerCase() !== "br") return false;
		const q = params.find((p) => p.trim().startsWith("q="));
		return !q || Number(q.trim().slice(2)) > 0;
	});
}

/** dist/ のファイルを返す。.br があり、受け付けるならそちらを返す */
export async function serveFile(
	distDir: string,
	file: string,
	req: Request,
): Promise<Response> {
	const original = Bun.file(path.join(distDir, file));
	const headers = new Headers({
		"Content-Type": original.type,
		"Cache-Control": cacheControl(file),
		Vary: "Accept-Encoding",
	});
	let body = original;
	if (acceptsBrotli(req.headers.get("accept-encoding"))) {
		const br = Bun.file(`${path.join(distDir, file)}.br`);
		if (await br.exists()) {
			headers.set("Content-Encoding", "br");
			body = br;
		}
	}
	if (req.method === "HEAD") {
		headers.set("Content-Length", String(body.size));
		return new Response(null, { headers });
	}
	return new Response(body, { headers });
}
