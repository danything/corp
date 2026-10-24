import { describe, expect, test } from "bun:test";
import {
  acceptsBrotli,
  BLOG_ORIGIN,
  cacheControl,
  resolvePath,
} from "../server/static";

const files = new Set([
  "/index.html",
  "/en/index.html",
  "/contact/index.html",
  "/en/contact/index.html",
  "/robots.txt",
  "/_astro/Layout.abc123.css",
  "/static/favicons/favicon-32x32.png",
]);

describe("resolvePath", () => {
  test("/ と /en/ は index.html", () => {
    expect(resolvePath("/", "", files)).toEqual({
      kind: "file",
      file: "/index.html",
    });
    expect(resolvePath("/en/", "", files)).toEqual({
      kind: "file",
      file: "/en/index.html",
    });
  });

  test("ページは / で終わるパスで返す", () => {
    expect(resolvePath("/contact/", "", files)).toEqual({
      kind: "file",
      file: "/contact/index.html",
    });
  });

  test("/ の無いページのパスは / 付きへ 301(クエリは残す)", () => {
    expect(resolvePath("/contact", "?a=1", files)).toEqual({
      kind: "redirect",
      location: "/contact/?a=1",
    });
    expect(resolvePath("/en", "", files)).toEqual({
      kind: "redirect",
      location: "/en/",
    });
  });

  test("ファイルはそのまま", () => {
    expect(resolvePath("/robots.txt", "", files)).toEqual({
      kind: "file",
      file: "/robots.txt",
    });
    expect(
      resolvePath("/static/favicons/favicon-32x32.png", "", files),
    ).toEqual({ kind: "file", file: "/static/favicons/favicon-32x32.png" });
  });

  test("dist に無いパスはブログの同じパスとクエリへ", () => {
    expect(resolvePath("/posts/renewal/", "", files)).toEqual({
      kind: "redirect",
      location: `${BLOG_ORIGIN}/posts/renewal/`,
    });
    expect(resolvePath("/archive/", "?tag=Linux", files)).toEqual({
      kind: "redirect",
      location: `${BLOG_ORIGIN}/archive/?tag=Linux`,
    });
    expect(resolvePath("/rss.xml", "", files)).toEqual({
      kind: "redirect",
      location: `${BLOG_ORIGIN}/rss.xml`,
    });
    expect(resolvePath("/en/posts/truck/", "", files)).toEqual({
      kind: "redirect",
      location: `${BLOG_ORIGIN}/en/posts/truck/`,
    });
  });

  test("エンコードされたパスは元の形のまま送る", () => {
    expect(resolvePath("/posts/%E3%81%82/", "", files)).toEqual({
      kind: "redirect",
      location: `${BLOG_ORIGIN}/posts/%E3%81%82/`,
    });
    // 壊れたエンコードでも落ちない
    expect(resolvePath("/%E3%81", "", files)).toEqual({
      kind: "redirect",
      location: `${BLOG_ORIGIN}/%E3%81`,
    });
  });

  test("../ などで一覧の外のファイルは返さない", () => {
    expect(resolvePath("/%2e%2e/etc/passwd", "", files).kind).toBe("redirect");
    expect(resolvePath("/index.html.br", "", files).kind).toBe("redirect");
  });
});

describe("cacheControl", () => {
  test("_astro は長期、HTML は都度検証", () => {
    expect(cacheControl("/_astro/Layout.abc123.css")).toContain("immutable");
    expect(cacheControl("/index.html")).toBe(
      "public, max-age=0, must-revalidate",
    );
    expect(cacheControl("/static/favicons/favicon-32x32.png")).toBe(
      "public, max-age=604800",
    );
  });
});

describe("acceptsBrotli", () => {
  test.each([
    ["br, gzip", true],
    ["gzip, deflate, br;q=0.5", true],
    ["gzip", false],
    ["br;q=0", false],
    [null, false],
  ])("%p → %p", (header, expected) => {
    expect(acceptsBrotli(header)).toBe(expected);
  });
});
