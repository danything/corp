import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://doany.io/",
	base: "/",
	// ブログと同じく、ページの URL は / で終える(/contact/)。server.ts は /contact を /contact/ へ送る
	trailingSlash: "always",
	// Astro 7 の既定("jsx")は要素の前後の改行を空白ごと消すので、表示を変えない圧縮にする(ブログと同じ)
	compressHTML: true,
	integrations: [
		sitemap({
			// 日本語版と英語版(/en/ を除いて同じパス)に hreflang の対応を付ける
			i18n: { defaultLocale: "ja", locales: { ja: "ja", en: "en" } },
			// 送信完了のページは検索に出さない
			filter: (page) => !/\/contact\/thanks\/$/.test(new URL(page).pathname),
			serialize(item) {
				// ページの <head> と同じく、既定(x-default)は日本語版にする
				const links = item.links?.filter((l) => l.lang !== "x-default");
				const ja = links?.find((l) => l.lang === "ja");
				if (links && ja)
					item.links = [...links, { lang: "x-default", url: ja.url }];
				return item;
			},
		}),
	],
	vite: {
		build: {
			// .astro の小さな <script> はページに直に埋め込まれるが、常に別ファイル(_astro/)にする(ブログと同じ)
			assetsInlineLimit: (filePath) =>
				filePath.endsWith(".js") ? false : undefined,
			cssTarget: ["chrome111", "safari16.4", "firefox128"],
		},
	},
});
