// 問い合わせを Matrix の部屋へ送る文面(Markdown)を作る。
//
// 送り先は matrix-hookshot の汎用 webhook で、{"text": "..."} の text を Markdown として HTML にする。
// 利用者の入力をそのまま混ぜると、太字や見出し・リンクで通知の見た目を偽れるので、
// 入力はすべてコード(1 行のものはインラインコード、本文はコードブロック)に入れる。
// コードの中は Markdown として解釈されず、クライアントも URL をリンクにしない。
// 入力に ` が並んでいても閉じられないよう、区切りはその最長の並びより長くする。
// また、本文(body)の "@room" は部屋全員への通知になるので、@ の後ろに幅の無い空白を挟んで崩す

const ZWSP = "\u200B";

/**
 * 制御文字と、表示の向きを変える文字(文字列を逆向きに見せて偽装できる)を除き、
 * 改行を \n にそろえ、@ の後ろに幅の無い空白を挟む
 */
export function neutralize(value: string): string {
  return (
    value
      .replace(/\r\n?/g, "\n")
      // 制御文字を取り除くための正規表現
      // oxlint-disable-next-line no-control-regex
      .replace(/[\u0000-\u0008\u000b-\u001f\u007f-\u009f]/g, "")
      .replace(/[\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, "")
      .replaceAll("@", `@${ZWSP}`)
  );
}

/** 文字列の中で最も長い ` の並び */
function longestBacktickRun(value: string): number {
  let longest = 0;
  for (const m of value.matchAll(/`+/g))
    longest = Math.max(longest, m[0].length);
  return longest;
}

/** 1 行の値をインラインコードにする。改行やタブは空白 1 つにする */
export function inlineCode(value: string): string {
  const text = neutralize(value).replace(/\s+/g, " ").trim();
  const fence = "`".repeat(longestBacktickRun(text) + 1);
  // ` で始まる・終わる値は、区切りとくっつかないよう空白を挟む(CommonMark は両端の空白 1 つを取り除く)
  const pad = text.startsWith("`") || text.endsWith("`") ? " " : "";
  return `${fence}${pad}${text}${pad}${fence}`;
}

/** 複数行の値をコードブロックにする */
export function codeBlock(value: string): string {
  const text = neutralize(value).replace(/\n+$/, "");
  const fence = "`".repeat(Math.max(3, longestBacktickRun(text) + 1));
  return `${fence}\n${text}\n${fence}`;
}

export interface ContactMessage {
  name: string;
  email: string;
  company: string;
  message: string;
  lang: "ja" | "en";
  ip?: string;
}

/** 通知の文面。見出しと項目名は固定の文字列で、利用者の入力はすべてコードに入れる */
export function buildContactMarkdown(m: ContactMessage): string {
  const lines = [
    "**doany.io のお問い合わせ**",
    "",
    `- 名前: ${inlineCode(m.name)}`,
    `- メール: ${inlineCode(m.email)}`,
    `- 会社・団体: ${m.company ? inlineCode(m.company) : "(なし)"}`,
    `- 言語: ${m.lang === "en" ? "英語" : "日本語"}`,
  ];
  if (m.ip) lines.push(`- IP: ${inlineCode(m.ip)}`);
  lines.push("", codeBlock(m.message));
  return lines.join("\n");
}
