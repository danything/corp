// 事業者の情報と、ページに出すリンク。文言(日本語・英語)は src/i18n/languages/ にある

export const site = {
	name: "Doa",
	url: "https://doany.io",
	email: "info@doany.io",
	blog: "https://b.doany.io",
	/** ブログのプロフィール(経歴はこちらに書く) */
	profile: "https://b.doany.io/about/",
	ogImage: "/static/images/og.png",
	/** 古物商許可(表記はこのまま出す) */
	kobutsuNumber: "第481012400049号",
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

/** 自社サービス(運用中のもの)。文言は languages の services */
export const services = [
	{ id: "todoroku", url: "https://tk.doany.io/" },
	{ id: "worklog", url: "https://w.doany.io/" },
] as const;

/** 制作実績。文言は languages の works */
export const works = [
	{ id: "denpa", url: "https://github.com/DAnything/denpa" },
	{ id: "mogiri", url: "https://github.com/5ym/mogiri" },
	{
		id: "yuzuriha",
		url: "https://y.doany.io/",
		source: "https://github.com/DAnything/yuzuriha",
	},
	{ id: "helmMosp", url: "https://github.com/DAnything/helm-mosp" },
	{ id: "gitops", url: "https://github.com/danything/gitops" },
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

export type ServiceId = (typeof services)[number]["id"];
export type WorkId = (typeof works)[number]["id"];
export type OssId = (typeof oss)[number]["id"];
