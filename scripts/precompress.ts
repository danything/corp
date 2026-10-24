// ビルドした dist/ の圧縮が効くファイルの隣に .br を書き出す(ブログの scripts/precompress.ts と同じ)。
// server.ts は Accept-Encoding に br があり .br があればそれを返す。前段の Cloudflare はオリジンに
// br・gzip しか求めず、ふだんは br を受け取る。br を受け付けないときは元のファイルを返す
// (gzip が要るなら Cloudflare が圧縮する)
//
//   bun scripts/precompress.ts [dir]   (既定は dist。bun run build の途中で呼ぶ)
//
// 画像は既に圧縮されているので対象にしない。圧縮しても元より小さくならないものは書き出さない
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const dir = process.argv[2] ?? "dist";

const COMPRESSIBLE =
	/\.(?:html|css|js|mjs|json|xml|svg|txt|webmanifest|map|ico)$/i;

const files = fs
	.readdirSync(dir, { recursive: true, encoding: "utf8" })
	.map((f) => path.join(dir, f))
	.filter((f) => COMPRESSIBLE.test(f) && fs.statSync(f).isFile());

const kb = (n: number) => `${Math.round(n / 1024)}K`;
let original = 0;
let written = 0;

for (const file of files) {
	const buf = fs.readFileSync(file);
	original += buf.length;
	const out = zlib.brotliCompressSync(buf, {
		params: {
			[zlib.constants.BROTLI_PARAM_QUALITY]: 11,
			[zlib.constants.BROTLI_PARAM_SIZE_HINT]: buf.length,
		},
	});
	if (out.length >= buf.length) continue;
	fs.writeFileSync(`${file}.br`, out);
	written += out.length;
}

console.log(
	`precompress: ${files.length} ファイル ${kb(original)} → .br ${kb(written)}`,
);
