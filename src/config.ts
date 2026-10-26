// 事業者の情報と、ページに出すリンク。文言(日本語・英語)は src/i18n/languages/ にある

export const site = {
  name: "Doa",
  url: "https://doany.io",
  email: "info@doany.io",
  blog: "https://b.doany.io",
  ogImage: "/static/images/og.png",
  /** 古物商許可(表記はこのまま出す) */
  kobutsuNumber: "第481012400049号",
  /** 適格請求書発行事業者の登録番号 (国税庁の公表サイトで確かめられる。2025 年 1 月 1 日登録) */
  invoiceNumber: "T3810315051206",
  /** 開業(JSON-LD 用) */
  foundingDate: "2018-10",
  /** Cloudflare Turnstile の「doany.io」ウィジェット(公開値。yosegaki と同じ)。手元ではテスト用のキーに差し替えられる */
  turnstileSiteKey:
    import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAEoiKxn884OxoH4h",
};

export const github = {
  org: { name: "DAnything", url: "https://github.com/DAnything" },
  user: { name: "5ym", url: "https://github.com/5ym" },
};

/** SNS(ブログの profileConfig と同じ) */
export const socialLinks = [
  { name: "GitHub", url: "https://github.com/5ym/" },
  { name: "X", url: "https://x.com/5yuim" },
  { name: "Facebook", url: "https://www.facebook.com/5yuim/" },
  { name: "Instagram", url: "https://www.instagram.com/5yuim/" },
  { name: "Threads", url: "https://www.threads.com/@5yuim" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/yui/" },
  {
    name: "YouTube",
    url: "https://www.youtube.com/channel/UCJWogAotKEJ70bs_e19yMyQ",
  },
];

/** 事業内容の並び(トップの事業の件の #id にもなる)。文言は languages の business */
export const business = [
  "dev",
  "web",
  "cars",
  "registration",
  "services",
] as const;

/** 自社サービス(運用中のもの)。文言は languages の services */
export const services = [
  { id: "todoroku", url: "https://tk.doany.io/" },
  { id: "worklog", url: "https://w.doany.io/" },
] as const;

/** 制作実績。文言は languages の works */
export const works = [
  {
    id: "denpa",
    url: "https://github.com/DAnything/denpa",
  },
  { id: "noren", url: "https://github.com/5ym/noren" },
  { id: "mado", url: "https://github.com/danything/mado" },
  { id: "aizuchi", url: "https://github.com/danything/aizuchi" },
  {
    id: "yuzuriha",
    url: "https://y.doany.io/",
    source: "https://github.com/DAnything/yuzuriha",
  },
  {
    id: "xool",
    url: "https://x.doany.io/",
    source: "https://github.com/danything/xool",
  },
  {
    id: "lgtm",
    url: "https://l.doany.io/",
    source: "https://github.com/danything/lgtm",
  },
  {
    id: "helmMosp",
    url: "https://github.com/DAnything/helm-mosp",
  },
  {
    id: "gitops",
    url: "https://github.com/danything/gitops",
  },
] as const;

/** OSS への貢献。文言は languages の oss。links はリポジトリ名などで、言語によらない */
export const oss = [
  {
    id: "ffmpeg",
    links: [
      {
        label: "FFmpeg/FFmpeg#24067",
        url: "https://code.ffmpeg.org/FFmpeg/FFmpeg/pulls/24067",
      },
    ],
  },
  {
    id: "blades",
    links: [
      {
        label: "anyblades/blades",
        url: "https://github.com/anyblades/blades/pulls?q=is%3Apr+author%3A5ym+is%3Amerged",
      },
    ],
  },
  {
    id: "talos",
    links: [
      {
        label: "siderolabs/extensions#1238",
        url: "https://github.com/siderolabs/extensions/pull/1238",
      },
      {
        label: "siderolabs/pkgs#1682",
        url: "https://github.com/siderolabs/pkgs/pull/1682",
      },
    ],
  },
  {
    id: "epgstation",
    links: [
      {
        label: "l3tnun/EPGStation",
        url: "https://github.com/l3tnun/EPGStation/pulls?q=is%3Apr+author%3A5ym+is%3Amerged",
      },
      {
        label: "l3tnun/docker-mirakurun-epgstation",
        url: "https://github.com/l3tnun/docker-mirakurun-epgstation/pulls?q=is%3Apr+author%3A5ym+is%3Amerged",
      },
    ],
  },
] as const;

/**
 * 代表の経歴(/company/#profile)。from・to は "2020-01" か、年だけの "2016"。to が無いものは今も続いている。
 * 始まった順に並べる。文言は languages の profile.career
 */
export const career = [
  { id: "kosen", from: "2016", to: "2018" },
  { id: "webProduction", from: "2017-11", to: "2018-10" },
  { id: "ses", from: "2018-10", to: "2019-12" },
  { id: "doa", from: "2018-10" },
  { id: "payment", from: "2020-01", to: "2023-05" },
  { id: "toyo", from: "2020", to: "2023" },
  { id: "prm", from: "2023-06", to: "2025-04" },
  { id: "autoParts", from: "2024-09" },
  { id: "transport", from: "2025-04", to: "2026-05" },
] as const;

/** 代表の資格・免許。取った順。文言は languages の profile.licenses */
export const licenses = [
  { id: "motorcycle", date: "2016-09" },
  { id: "ordinary", date: "2019-04" },
  { id: "kobutsu", date: "2025-01" },
  { id: "medium", date: "2025-07" },
] as const;

export type ServiceId = (typeof services)[number]["id"];
export type WorkId = (typeof works)[number]["id"];
export type OssId = (typeof oss)[number]["id"];
export type CareerId = (typeof career)[number]["id"];
export type LicenseId = (typeof licenses)[number]["id"];
