import { en } from "./languages/en";
import { ja } from "./languages/ja";

/** サイトの言語。日本語が既定で、英語版は /en/ 以下に置く(ブログと同じ) */
export const LANGS = ["ja", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "ja";

export type Translation = typeof ja;

const map: Record<Lang, Translation> = { ja, en };

/**
 * src/pages/[...lang]/ のページを言語ごとに作る(getStaticPaths)。日本語版は言語の部分の無い
 * パス(/company/)、英語版は /en/ 以下(/en/company/)
 */
export function langPaths(): {
  params: { lang?: string };
  props: { lang: Lang };
}[] {
  return LANGS.map((lang) => ({
    params: { lang: lang === DEFAULT_LANG ? undefined : lang },
    props: { lang },
  }));
}

/** ページの URL のパスから言語を決める(/en/ 以下なら英語) */
export function langFromPath(pathname: string): Lang {
  return /^\/en(\/|$)/.test(pathname) ? "en" : DEFAULT_LANG;
}

/** 言語の部分(/en/)を除いたパス。日本語版と英語版で同じページなら同じ値になる */
export function stripLang(pathname: string): string {
  return pathname.replace(/^\/en(\/|$)/, "/");
}

/** サイト内のパスを、その言語のページのパスにする(英語は /en/ 以下) */
export function localeUrl(path: string, lang: Lang): string {
  return lang === DEFAULT_LANG ? path : `/${lang}${path}`;
}

export function t(lang: Lang): Translation {
  return map[lang];
}
