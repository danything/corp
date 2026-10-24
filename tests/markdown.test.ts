import { describe, expect, test } from "bun:test";
import {
  buildContactMarkdown,
  codeBlock,
  inlineCode,
  neutralize,
} from "../server/markdown";

const ZWSP = "\u200B";

describe("neutralize", () => {
  test("@ の後ろに幅の無い空白を挟む(@room で全員に通知させない)", () => {
    expect(neutralize("@room")).toBe(`@${ZWSP}room`);
    expect(neutralize("@ruk:doany.io")).toBe(`@${ZWSP}ruk:doany.io`);
  });

  test("制御文字と向きを変える文字を除く", () => {
    expect(neutralize("a\u0000b\u202Ec\u2066d")).toBe("abcd");
    expect(neutralize("a\r\nb\rc")).toBe("a\nb\nc");
  });
});

describe("inlineCode", () => {
  test("値をコードに入れ、改行は空白にする", () => {
    expect(inlineCode("山田\n太郎")).toBe("`山田 太郎`");
  });

  test("Markdown の記法やリンクはコードの中に閉じ込める", () => {
    expect(inlineCode("**[click](https://evil.example)**")).toBe(
      "`**[click](https://evil.example)**`",
    );
  });

  test("` を含む値は、より長い区切りで囲む", () => {
    expect(inlineCode("a`b")).toBe("``a`b``");
    expect(inlineCode("x``` y")).toBe("````x``` y````");
    // ` で始まる・終わる値は空白を挟む
    expect(inlineCode("`code`")).toBe("`` `code` ``");
  });
});

describe("codeBlock", () => {
  test("本文はコードブロックに入れる", () => {
    expect(codeBlock("# 見出し\n- 項目")).toBe("```\n# 見出し\n- 項目\n```");
  });

  test("本文の ``` で閉じられないよう、区切りを長くする", () => {
    const block = codeBlock("```\n**偽の通知**\n```");
    expect(block.startsWith("````\n")).toBe(true);
    expect(block.endsWith("\n````")).toBe(true);
  });
});

describe("buildContactMarkdown", () => {
  test("項目名は固定で、入力はすべてコードの中", () => {
    const md = buildContactMarkdown({
      name: "**Admin** @room",
      email: "a@example.com",
      company: "",
      message: "[link](https://evil.example)\n```\nbreak\n```",
      lang: "en",
      ip: "203.0.113.1",
    });
    expect(md).toContain(`- 名前: \`**Admin** @${ZWSP}room\``);
    expect(md).toContain(`- メール: \`a@${ZWSP}example.com\``);
    expect(md).toContain("- 会社・団体: (なし)");
    expect(md).toContain("- 言語: 英語");
    expect(md).toContain("- IP: `203.0.113.1`");
    expect(md).toContain(
      "````\n[link](https://evil.example)\n```\nbreak\n```\n````",
    );
    expect(md).not.toContain("@room");
  });
});
