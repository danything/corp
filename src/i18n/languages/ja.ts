// 日本語の文言。英語版(en.ts)は同じ形にする(translation.ts の Translation 型)

export const ja = {
	siteDescription:
		"Doa は、Web システム・アプリの受託開発と、中古車や自動車の登録手続きの相談を請け負う個人事業です。千葉県木更津市。",

	nav: {
		label: "メイン",
		home: "ホーム",
		company: "事業者情報",
		works: "サービス・実績",
		blog: "ブログ",
		contact: "お問い合わせ",
		switchLang: "English",
		switchLangLabel: "English version",
	},
	skipToContent: "本文へ移動",

	home: {
		lead: "Web システムの開発と、自動車まわりの相談を請け負う個人事業です。",
		ctaContact: "お問い合わせ",
		ctaWorks: "サービスと実績を見る",

		businessTitle: "事業内容",
		business: [
			{
				title: "Web システム・アプリの受託開発",
				body: "業務システムや Web アプリの設計・開発を、言語を問わずお受けします。Kubernetes や IaC、クラウドを使ったインフラの構築・運用までまとめて対応します。",
			},
			{
				title: "Web サイト・LP 制作",
				body: "WordPress などを使ったサイトや LP の制作・改修をご相談ください。",
			},
			{
				title: "中古車の買取・販売の相談",
				body: "古物商許可を取得し、中古車の業者オークションにも加盟しています。買取・販売のご相談をお受けします。",
			},
			{
				title: "自動車の登録手続きの相談",
				body: "貨物登録など、自動車の登録手続きについてのご相談をお受けします。",
			},
			{
				title: "自社サービスの開発・運営",
				body: "トドロクと worklog を自社で開発し、運営しています。",
			},
		],

		servicesTitle: "自社サービス",
		servicesLead:
			"Doa が設計・開発し、運用とサポートまで自社で行っているサービスです。",
		worksLink: "制作実績と OSS への貢献を見る",

		aboutTitle: "代表について",
		aboutBody:
			"代表の丸山 竜輝は、決済代行や SaaS の開発に携わってきた Web エンジニアです。自動車の陸送の現場で働いた経験もあり、古物商許可を持っています。",
		aboutLink: "経歴はブログのプロフィールにあります",

		contactTitle: "お問い合わせ",
		contactBody: "ご相談はフォームか、メールでお気軽にどうぞ。",
	},

	services: {
		todoroku: {
			name: "トドロク",
			body: "車両台帳と、登録・届出の書類作成のサービスです。車検証の項目を一度入れれば、車検・自賠責・税の期限、1 台ごとの原価と利益（消費税区分付き）、仕入れから貨物登録・販売までの工程を 1 か所で管理でき、構造変更の重量分布計算書も印刷できます。自分で書類を作る人のための道具で、代書はしません。",
		},
		worklog: {
			name: "worklog",
			body: "Slack・GitHub・GitLab・Backlog・Jira・OpenProject・Redmine の API のログを横断して、日ごとの稼働の開始・終了・休憩・実働を推定するサービスです。常駐エージェントを入れる必要がなく、過去の月にさかのぼって稼働表を作れます。",
		},
	},

	worksPage: {
		title: "サービス・実績",
		description:
			"Doa が運営する自社サービス、制作実績、OSS への貢献の一覧です。",
		servicesTitle: "自社サービス",
		servicesLead:
			"Doa が設計・開発し、運用とサポートまで自社で行っているサービスです。",
		worksTitle: "制作実績",
		source: "ソース",
		others:
			"ほかにも 𝕏ool・fixeed・cash-tabelog・svelte-slider などの小さなツールを GitHub（{user}・{org}）で公開しています。",
		ossTitle: "OSS への貢献",
		ossLead:
			"使っているソフトウェアで見つけた不具合の修正や改善を、上流に提案しています。",
	},

	works: {
		denpa: {
			name: "denpa",
			body: "テレビを録って観るためのシステムです。チューナーを扱って素の TS を流すエージェントと、番組表・予約・録画・エンコード・配信・ライブ視聴を担う本体の 2 つで完結し、別途メディアサーバを置きません。TypeScript と Svelte、チューナー側は C# で書いています。",
		},
		mogiri: {
			name: "mogiri",
			body: "催事などで使える、QR を使った入場受付と、事前注文・店頭受け取り・セルフレジをまとめた Web アプリです。入場受付の qes と物販の Smart QR Payment を統合し、Django REST Framework と Nuxt の構成から Bun・SvelteKit・SQLite の 1 つのアプリに書き直しました。",
		},
		yuzuriha: {
			name: "yuzuriha（譲葉）",
			body: "0 円物件を複数の掲載サイトから毎日集めて、衛星写真の地図上に表示するサイトです。",
		},
		helmMosp: {
			name: "helm-mosp",
			body: "オープンソースの勤怠管理 MosP を Kubernetes で動かすためのイメージと Helm chart です。毎月、本家の更新を確かめてイメージを作り直し、GHCR に公開しています。DB の初期構築は init container が行います。",
		},
		gitops: {
			name: "gitops",
			body: "自社のサービスを動かしている Kubernetes 基盤のリポジトリです。Talos Linux のクラスタを Argo CD で GitOps 管理し、公開経路は Cilium の Gateway API、秘密は Infisical、バックアップは k8up で Cloudflare R2 へ。認証は Entra ID のシングルサインオン、Cloudflare と Entra の設定は Pulumi で持ち、Matrix や Forgejo もここでセルフホストしています。",
		},
	},

	oss: {
		ffmpeg: {
			name: "FFmpeg",
			body: "libaribcaption を使う ARIB 字幕デコーダの修正を提案しています。ビットマップ出力で字幕を消去する処理の修正が取り込まれました。",
		},
		blades: {
			name: "Blades CSS",
			body: "Pico CSS の後継の CSS フレームワークです。light-dark() による配色、フォーカスリングなどのコントラストの改善、オプトインのコンパクト表示、部品ごとの層付きビルド、dialog・popover の新しい部品、縮小を lightningcss に切り替える変更などが取り込まれました。",
		},
		talos: {
			name: "Talos Linux",
			body: "テレビチューナー PT3 のドライバを Talos の拡張として使えるようにする変更が、siderolabs/pkgs と siderolabs/extensions に取り込まれました。",
		},
		epgstation: {
			name: "EPGStation",
			body: "録画管理の EPGStation と、その Docker 構成（docker-mirakurun-epgstation）に、エンコードの不具合の修正や字幕・ハードウェアエンコードの対応などを取り込んでもらいました。",
		},
	},

	company: {
		title: "事業者情報",
		description: "Doa の屋号・代表者・所在地・許可などの事業者情報です。",
		tradeName: "屋号",
		representative: "代表",
		representativeName: "丸山 竜輝（まるやま りゅうき）",
		location: "所在地",
		locationValue: "千葉県木更津市",
		founded: "開業",
		foundedValue: "2018年10月",
		business: "事業内容",
		businessItems: [
			"Web システム・アプリの受託開発（言語を問わず。インフラの構築・運用まで: Kubernetes、IaC、クラウド）",
			"Web サイト・LP 制作",
			"中古車の買取・販売の相談",
			"貨物登録など自動車の登録手続きの相談",
			"自社サービスの開発・運営",
		],
		license: "古物商許可",
		licenseValue: "長野県公安委員会",
		email: "メール",
		github: "GitHub",
		social: "SNS",
	},

	contact: {
		title: "お問い合わせ",
		description:
			"Doa へのお問い合わせフォームです。開発のご依頼や中古車・登録手続きのご相談をお受けしています。",
		lead: "開発のご依頼、中古車や登録手続きのご相談など、お気軽にお送りください。内容を確認のうえ、メールでご返信します。",
		emailAlt: "メールでも受け付けています:",
		name: "お名前",
		email: "メールアドレス",
		company: "会社・団体名",
		message: "お問い合わせ内容",
		optional: "任意",
		required: "必須",
		honeypot: "この欄は空のままにしてください",
		submit: "送信する",
		sending: "送信しています…",
		noscript:
			"このフォームの送信には JavaScript（ボット対策の確認）が必要です。JavaScript を使わない場合はメールでお問い合わせください。",
		privacy: "いただいた内容は、お問い合わせへの返信のためだけに使います。",
		errors: {
			invalid: "入力内容を確認してください。",
			turnstile:
				"ボット対策の確認ができませんでした。確認が終わってからもう一度送信してください。",
			rate_limited:
				"短い時間に送信が続いたため、受け付けを止めています。しばらくしてからお試しいただくか、メールでお送りください。",
			too_large: "内容が長すぎます。短くしてお送りください。",
			unsupported:
				"送信できませんでした。ページを読み込み直してお試しください。",
			unavailable:
				"ただいま送信を受け付けられません。お手数ですがメールでお送りください。",
			send_failed:
				"送信に失敗しました。時間をおいてお試しいただくか、メールでお送りください。",
			network: "通信に失敗しました。接続を確かめてもう一度お試しください。",
		},
		fieldErrors: {
			name: "お名前を 100 文字以内で入力してください。",
			email: "メールアドレスを正しい形で入力してください。",
			company: "会社・団体名は 100 文字以内で入力してください。",
			message: "お問い合わせ内容を 5000 文字以内で入力してください。",
		},
	},

	thanks: {
		title: "送信しました",
		description: "お問い合わせを受け付けました。",
		body: "お問い合わせありがとうございます。内容を確認のうえ、ご入力いただいたメールアドレスにご返信します。",
		back: "ホームへ戻る",
	},

	footer: {
		copyright: "© Doa",
		blog: "ブログ",
		social: "SNS",
	},
};
