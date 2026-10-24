/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Turnstile のサイトキー。手元で試すときにテスト用のキー(1x00000000000000000000AA)へ差し替える */
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
}

// Blades の部品は frontmatter で import "@anyblades/blades/layered/<部品>"; と書いて読む (ContactForm.astro)。
// 拡張子の無い CSS の import には型が無く astro check が落ちるので、型は無いと宣言しておく (todoroku と同じ)
declare module "@anyblades/blades/layered/*";
