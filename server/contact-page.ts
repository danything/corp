// JavaScript を使わないフォームの送信が失敗したときに返すページ。
// ビルドしたフォームのページ(dist/contact/index.html)に、入力した値とエラーを書き戻す。
// エラーの文言はページの側(src/components/ContactForm.astro の data-msg-*)にあり、
// ページの JavaScript と同じものを使う。書き換えは Bun の HTMLRewriter で、値はエスケープされる
import path from "node:path";
import type { ContactInput, ErrorCode, Field, Lang } from "./contact";

export const contactPagePath = (lang: Lang) =>
  lang === "en" ? "/en/contact/index.html" : "/contact/index.html";

export async function renderContactForm(
  html: Response,
  error: ErrorCode,
  input: ContactInput | undefined,
  invalid: Field[],
  status: number,
): Promise<Response> {
  const values: Partial<Record<Field, string>> = input
    ? {
        name: input.name,
        email: input.email,
        company: input.company,
        message: input.message,
      }
    : {};
  const invalidSet = new Set<string>(invalid);
  const fill = {
    element(el: HTMLRewriterTypes.Element) {
      const name = el.getAttribute("name") ?? "";
      const value = values[name as Field];
      if (value !== undefined) {
        if (el.tagName === "textarea") el.setInnerContent(value);
        else el.setAttribute("value", value);
      }
      if (invalidSet.has(name)) {
        el.setAttribute("aria-invalid", "true");
        el.setAttribute("aria-describedby", `${name}-error`);
      }
    },
  };
  const rewritten = new HTMLRewriter()
    .on("[data-contact-status]", {
      element(el) {
        const message =
          el.getAttribute(`data-msg-${error}`) ??
          el.getAttribute("data-msg-unavailable") ??
          "";
        el.setInnerContent(message);
        el.removeAttribute("hidden");
      },
    })
    .on("form[data-contact] input[name]", fill)
    .on("form[data-contact] textarea[name]", fill)
    .transform(html);
  return new Response(await rewritten.text(), {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

/** dist/ のフォームのページを読み、書き戻したものを返す */
export function contactFormRenderer(distDir: string) {
  return async (
    lang: Lang,
    error: ErrorCode,
    input: ContactInput | undefined,
    invalid: Field[],
    status: number,
  ) => {
    const file = Bun.file(path.join(distDir, contactPagePath(lang)));
    return renderContactForm(new Response(file), error, input, invalid, status);
  };
}
