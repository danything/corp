// 日本語の文言。英語版(en.ts)は同じ形にする(translation.ts の Translation 型)

export const ja = {
	siteDescription:
		"Doa は千葉県木更津市の個人事業です。Web システム・アプリの受託開発と、中古車や自動車の登録手続きの相談を受けています。",

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
		/** ページの題(<title>)でサイト名に添える */
		title: "Web システムの開発と、中古車・登録手続きの相談",
		lead: "業務システムや Web アプリを作っています。中古車の売り買いや、貨物登録などの手続きの相談にも乗ります。",
		/** 名前の上に添える事実(所在地・開業) */
		meta: "千葉県木更津市・2018年10月開業",
		ctaContact: "お問い合わせ",
		ctaWorks: "サービスと実績",
		/** 頭の右に出す自社サービスの画面。alt は映っているものを書く */
		shotsLabel: "自社サービス",
		shots: {
			todoroku:
				"トドロクのトップページ。車両台帳に車名・型式などを入れている画面が映っている",
			worklog:
				"worklog のトップページ。Slack や GitHub のログから作った稼働表のサンプルが出ている",
		},

		businessTitle: "事業内容",
		business: [
			{
				title: "Web システム・アプリの受託開発",
				body: "業務システムや Web アプリを設計から作ります。言語は問いません。Kubernetes・IaC・クラウドでのインフラの構築と運用も引き受けます。",
			},
			{
				title: "Web サイト・LP 制作",
				body: "WordPress などでのサイトや LP の制作と改修です。",
			},
			{
				title: "中古車の買取・販売の相談",
				body: "古物商許可を持っていて、中古車の業者オークションに加盟しています。買いたい・売りたい、どちらの相談でもどうぞ。",
			},
			{
				title: "自動車の登録手続きの相談",
				body: "貨物登録など、自動車の登録手続きの相談に乗ります。",
			},
			{
				title: "自社サービスの開発・運営",
				body: "トドロクと worklog を作って、運営しています。",
			},
		],

		servicesTitle: "自社サービス",
		servicesLead: "自分で作って、運用もサポートもしています。",
		worksLink: "制作実績と OSS への貢献",
		/** サービスの件の下に添えるリンク(ホスト名を後ろに付ける) */
		openSite: "サイトを開く",

		aboutTitle: "代表について",
		aboutBody:
			"代表は丸山 竜輝です。決済代行や SaaS の開発をしてきた Web エンジニアで、自動車の陸送のドライバーをしていたこともあります。古物商許可を持っています。",
		aboutLink: "経歴はブログのプロフィールに書いています",

		contactTitle: "お問い合わせ",
		contactBody: "フォームかメールでどうぞ。",
	},

	services: {
		todoroku: {
			name: "トドロク",
			body: "車両台帳と、登録・届出の書類作成のサービスです。車検証の項目を一度入れれば、車検・自賠責・税の期限、1 台ごとの原価と利益（消費税区分付き）、仕入れから貨物登録・販売までの工程を 1 か所で持ち、構造変更の重量分布計算書を印刷できます。自分で書類を作る人のための道具で、代書はしません。",
		},
		worklog: {
			name: "worklog",
			body: "Slack・GitHub・GitLab・Backlog・Jira・OpenProject・Redmine の API のログを横断して、日ごとの稼働の開始・終了・休憩・実働を推定するサービスです。常駐エージェントを入れずに、過去の月にさかのぼって稼働表を作れます。",
		},
	},

	worksPage: {
		title: "サービス・実績",
		description: "Doa の自社サービス、制作実績、OSS への貢献です。",
		servicesTitle: "自社サービス",
		servicesLead: "自分で作って、運用もサポートもしています。",
		worksTitle: "制作実績",
		source: "ソース",
		others:
			"ほかにも 𝕏ool・fixeed・cash-tabelog・svelte-slider などの小さなツールを GitHub（{user}・{org}）に置いています。",
		ossTitle: "OSS への貢献",
		ossLead:
			"使っているソフトウェアで不具合を見つけたら、直して上流に送っています。",
	},

	works: {
		denpa: {
			name: "denpa",
			body: "テレビを録って観るためのシステムです。チューナーを扱って素の TS を流すエージェントと、番組表・予約・録画・エンコード・配信・ライブ視聴を受け持つ本体の 2 つで完結していて、別にメディアサーバを置きません。TypeScript と Svelte、チューナー側は C# で書いています。",
		},
		mogiri: {
			name: "mogiri",
			body: "催事などで使う、QR での入場受付と、事前注文・店頭受け取り・セルフレジをまとめた Web アプリです。入場受付の qes と物販の Smart QR Payment を 1 つにしました。最初は Django REST Framework と Nuxt で作りましたが、Bun・SvelteKit・SQLite の 1 つのアプリに書き直しています。",
		},
		yuzuriha: {
			name: "yuzuriha（譲葉）",
			body: "0 円物件を複数の掲載サイトから毎日集めて、衛星写真の地図の上に出すサイトです。",
		},
		helmMosp: {
			name: "helm-mosp",
			body: "オープンソースの勤怠管理 MosP を Kubernetes で動かすためのイメージと Helm chart です。毎月本家の更新を確かめてイメージを作り直し、GHCR に置いています。DB の初期構築は init container がやります。",
		},
		gitops: {
			name: "gitops",
			body: "自社のサービスを動かしている Kubernetes 基盤のリポジトリです。Talos Linux のクラスタを Argo CD で GitOps 管理しています。公開は Cilium の Gateway API、秘密は Infisical、バックアップは k8up で Cloudflare R2 へ。ログインは Entra ID のシングルサインオンで、Cloudflare と Entra の設定は Pulumi で持っています。Matrix や Forgejo もここで動かしています。",
		},
	},

	oss: {
		ffmpeg: {
			name: "FFmpeg",
			body: "libaribcaption を使う ARIB 字幕デコーダの修正を送っています。ビットマップ出力で字幕を消す処理の修正が取り込まれました。",
		},
		blades: {
			name: "Blades CSS",
			body: "Pico CSS の後継の CSS フレームワークです。light-dark() での配色、フォーカスリングなどのコントラストの修正、オプトインのコンパクト表示、部品ごとの層付きビルド、dialog と popover の部品、縮小を lightningcss に切り替える変更などが取り込まれました。",
		},
		talos: {
			name: "Talos Linux",
			body: "テレビチューナー PT3 のドライバを Talos の拡張として使えるようにする変更が、siderolabs/pkgs と siderolabs/extensions に取り込まれました。",
		},
		epgstation: {
			name: "EPGStation",
			body: "録画管理の EPGStation と、その Docker 構成（docker-mirakurun-epgstation）に、エンコードの不具合の修正や、字幕とハードウェアエンコードの対応が取り込まれました。",
		},
	},

	company: {
		title: "事業者情報",
		description: "Doa の屋号・代表・所在地・古物商許可などです。",
		tradeName: "屋号",
		representative: "代表",
		representativeName: "丸山 竜輝（まるやま りゅうき）",
		location: "所在地",
		locationValue: "千葉県木更津市",
		founded: "開業",
		foundedValue: "2018年10月",
		business: "事業内容",
		businessItems: [
			"Web システム・アプリの受託開発（言語は問いません。Kubernetes・IaC・クラウドでのインフラの構築と運用も）",
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
			"Doa への問い合わせのフォームです。開発の依頼と、中古車や登録手続きの相談を受け付けています。",
		lead: "開発の依頼や、中古車・登録手続きの相談はここから送ってください。返信はメールでします。",
		emailAlt: "メールでも受け付けています:",
		name: "お名前",
		email: "メールアドレス",
		company: "会社・団体名",
		message: "お問い合わせ内容",
		optional: "任意",
		required: "必須",
		honeypot: "この欄は空のままにしてください",
		submit: "送信",
		sending: "送信しています…",
		noscript:
			"このフォームはボット対策の確認に JavaScript を使います。JavaScript を使わない場合はメールで送ってください。",
		privacy: "送ってもらった内容は、返信のためだけに使います。",
		errors: {
			invalid: "入力を確認してください。",
			turnstile:
				"ボット対策の確認ができませんでした。確認が終わってから、もう一度送ってください。",
			rate_limited:
				"短い時間に何度も送られたため、いまは受け付けていません。時間をおいて送るか、メールで送ってください。",
			too_large: "長すぎます。短くして送ってください。",
			unsupported:
				"送れませんでした。ページを読み込み直して、もう一度送ってください。",
			unavailable: "いまはフォームから送れません。メールで送ってください。",
			send_failed:
				"送れませんでした。時間をおいて送るか、メールで送ってください。",
			network: "通信に失敗しました。接続を確かめて、もう一度送ってください。",
		},
		fieldErrors: {
			name: "お名前を 100 文字以内で入れてください。",
			email: "メールアドレスを正しい形で入れてください。",
			company: "会社・団体名は 100 文字以内にしてください。",
			message: "お問い合わせ内容を 5000 文字以内で入れてください。",
		},
	},

	thanks: {
		title: "送信しました",
		description: "お問い合わせを受け付けました。",
		body: "受け付けました。内容を読んで、入力してもらったメールアドレスに返信します。",
		back: "ホームへ戻る",
	},

	footer: {
		copyright: "© Doa",
		blog: "ブログ",
		social: "SNS",
	},
};
