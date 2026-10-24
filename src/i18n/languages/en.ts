import type { Translation } from "../translation";

export const en: Translation = {
	siteDescription:
		"Doa is a sole proprietorship in Kisarazu, Chiba, Japan, building web systems and apps to order and advising on used cars and vehicle registration.",

	nav: {
		label: "Main",
		home: "Home",
		company: "Company",
		works: "Services & Work",
		blog: "Blog",
		contact: "Contact",
		switchLang: "日本語",
		switchLangLabel: "日本語版",
	},
	skipToContent: "Skip to content",

	home: {
		lead: "A sole proprietorship that builds web systems and helps with all things cars.",
		ctaContact: "Contact us",
		ctaWorks: "See services and work",

		businessTitle: "What we do",
		business: [
			{
				title: "Web systems and apps, built to order",
				body: "Design and development of business systems and web apps, in any language — through to building and running the infrastructure on Kubernetes, IaC and the cloud.",
			},
			{
				title: "Websites and landing pages",
				body: "Building and updating sites and landing pages, on WordPress and other platforms.",
			},
			{
				title: "Buying and selling used cars",
				body: "We hold a secondhand dealer licence (kobutsusho kyoka) and are a member of used car dealer auctions. Ask us about buying or selling a car.",
			},
			{
				title: "Vehicle registration",
				body: "Advice on vehicle registration procedures in Japan, such as cargo (commercial vehicle) registration.",
			},
			{
				title: "Our own services",
				body: "We develop and run Todoroku and worklog in-house.",
			},
		],

		servicesTitle: "Our services",
		servicesLead:
			"Services that Doa designs, builds, runs and supports in-house.",
		worksLink: "See our work and open source contributions",

		aboutTitle: "About the owner",
		aboutBody:
			"Doa is run by Ryuki Maruyama, a web engineer with a background in payments and SaaS development. He has also worked hands-on in vehicle transport and holds a secondhand dealer licence.",
		aboutLink: "Read the full story on his blog",

		contactTitle: "Get in touch",
		contactBody: "Send us a message through the form or by email.",
	},

	services: {
		todoroku: {
			name: "Todoroku",
			body: "Vehicle ledgers and registration paperwork. Enter the fields from the vehicle inspection certificate once, and it keeps the inspection, compulsory insurance and tax deadlines, the cost and profit per car (with consumption tax categories), and the workflow from purchase through cargo registration to sale in one place. It also prints the weight distribution sheet for structural modifications. It's a tool for people who do their own paperwork; it doesn't file on their behalf.",
		},
		worklog: {
			name: "worklog",
			body: "Infers each day's start, end, breaks and working time from the API logs of Slack, GitHub, GitLab, Backlog, Jira, OpenProject and Redmine. There's no agent to install, and it can build timesheets for past months.",
		},
	},

	worksPage: {
		title: "Services & Work",
		description:
			"Doa's own services, selected work, and contributions to open source.",
		servicesTitle: "Our services",
		servicesLead:
			"Services that Doa designs, builds, runs and supports in-house.",
		worksTitle: "Selected work",
		source: "Source",
		others:
			"Smaller tools such as 𝕏ool, fixeed, cash-tabelog and svelte-slider are on GitHub ({user}, {org}).",
		ossTitle: "Open source contributions",
		ossLead: "Fixes and improvements to software we use, sent upstream.",
	},

	works: {
		denpa: {
			name: "denpa",
			body: "A system for recording and watching TV. An agent that drives the tuner and streams the raw TS, and a main app for the programme guide, reservations, recording, encoding, streaming and live viewing — no separate media server needed. Written in TypeScript and Svelte, with C# on the tuner side.",
		},
		mogiri: {
			name: "mogiri",
			body: "A web app for events: QR-based admission, pre-orders, in-store pickup and self-checkout. It merges qes (admission) and Smart QR Payment (sales), rewritten from Django REST Framework and Nuxt into a single Bun, SvelteKit and SQLite app.",
		},
		yuzuriha: {
			name: "yuzuriha (譲葉)",
			body: "Collects zero-yen properties from several listing sites every day and shows them on a satellite map.",
		},
		helmMosp: {
			name: "helm-mosp",
			body: "An image and Helm chart for running MosP, an open-source attendance management system, on Kubernetes. Every month it checks upstream, rebuilds the image and publishes it to GHCR. An init container sets up the database.",
		},
		gitops: {
			name: "gitops",
			body: "The Kubernetes platform our services run on. A Talos Linux cluster managed with Argo CD (GitOps), with Cilium's Gateway API in front, secrets in Infisical, and k8up backups to Cloudflare R2. Sign-in is single sign-on with Entra ID, Cloudflare and Entra settings live in Pulumi, and it self-hosts Matrix and Forgejo among others.",
		},
	},

	oss: {
		ffmpeg: {
			name: "FFmpeg",
			body: "Fixes to the libaribcaption-based ARIB caption decoder. A fix for clearing captions in bitmap mode has been merged.",
		},
		blades: {
			name: "Blades CSS",
			body: "The successor to Pico CSS. Merged changes include light-dark() colours, contrast fixes for focus rings and more, an opt-in compact mode, layered per-part builds, modern dialog and popover parts, and switching the minifier to lightningcss.",
		},
		talos: {
			name: "Talos Linux",
			body: "Changes to siderolabs/pkgs and siderolabs/extensions that make the driver for the PT3 TV tuner available as a Talos extension were merged.",
		},
		epgstation: {
			name: "EPGStation",
			body: "Contributions to the EPGStation recorder and its Docker setup (docker-mirakurun-epgstation), including an encoding bug fix and support for subtitles and hardware encoding.",
		},
	},

	company: {
		title: "Company",
		description:
			"Business details for Doa: trade name, owner, location and licence.",
		tradeName: "Trade name",
		representative: "Owner",
		representativeName: "Ryuki Maruyama",
		location: "Location",
		locationValue: "Kisarazu, Chiba, Japan",
		founded: "Established",
		foundedValue: "October 2018",
		business: "Business",
		businessItems: [
			"Web systems and apps built to order, in any language — including infrastructure on Kubernetes, IaC and the cloud",
			"Websites and landing pages",
			"Advice on buying and selling used cars",
			"Advice on vehicle registration, such as cargo registration",
			"Developing and running our own services",
		],
		license: "Secondhand dealer licence",
		licenseValue: "Nagano Prefectural Public Safety Commission",
		email: "Email",
		github: "GitHub",
		social: "Social",
	},

	contact: {
		title: "Contact",
		description:
			"Contact form for Doa: development work, used cars and vehicle registration.",
		lead: "Development work, used cars, vehicle registration — send us a message and we'll reply by email.",
		emailAlt: "You can also email us at",
		name: "Name",
		email: "Email",
		company: "Company or organisation",
		message: "Message",
		optional: "optional",
		required: "required",
		honeypot: "Leave this field empty",
		submit: "Send",
		sending: "Sending…",
		noscript:
			"Sending this form needs JavaScript (for the bot check). If you'd rather not use JavaScript, please email us.",
		privacy: "We use what you send only to reply to you.",
		errors: {
			invalid: "Please check the highlighted fields.",
			turnstile:
				"We couldn't complete the bot check. Wait for it to finish, then send again.",
			rate_limited:
				"Too many messages in a short time. Please try again later, or email us.",
			too_large: "Your message is too long. Please shorten it.",
			unsupported:
				"We couldn't send that. Please reload the page and try again.",
			unavailable:
				"We can't accept messages right now. Please email us instead.",
			send_failed: "Sending failed. Please try again later, or email us.",
			network: "Network error. Check your connection and try again.",
		},
		fieldErrors: {
			name: "Enter your name (up to 100 characters).",
			email: "Enter a valid email address.",
			company: "Use up to 100 characters.",
			message: "Enter your message (up to 5000 characters).",
		},
	},

	thanks: {
		title: "Message sent",
		description: "We've received your message.",
		body: "Thank you for getting in touch. We'll reply to the email address you gave.",
		back: "Back to home",
	},

	footer: {
		copyright: "© Doa",
		blog: "Blog",
		social: "Social",
	},
};
