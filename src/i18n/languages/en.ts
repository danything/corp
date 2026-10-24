import type { Translation } from "../translation";

export const en: Translation = {
	siteDescription:
		"Doa is a one-person business in Kisarazu, Chiba, Japan. It builds web systems and apps to order, and helps with used cars and vehicle registration.",

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
		lead: "A one-person business that builds web systems and helps with used cars and vehicle registration.",
		meta: "Kisarazu, Chiba · Established October 2018",
		ctaContact: "Contact",
		ctaWorks: "Services and work",

		businessTitle: "Business",
		business: [
			{
				title: "Web systems and apps, built to order",
				body: "Business systems and web apps, from design to code, in any language. Also the infrastructure they run on: Kubernetes, IaC and the cloud, set up and operated.",
			},
			{
				title: "Websites and landing pages",
				body: "New sites and landing pages, or changes to existing ones, on WordPress and similar.",
			},
			{
				title: "Buying and selling used cars",
				body: "Doa holds a secondhand dealer licence (kobutsusho kyoka) and is a member of used car dealer auctions. Ask about buying or selling a car.",
			},
			{
				title: "Vehicle registration",
				body: "Help with vehicle registration in Japan, such as cargo (commercial vehicle) registration.",
			},
			{
				title: "Own services",
				body: "Todoroku and worklog, built and run in-house.",
			},
		],

		servicesTitle: "Own services",
		servicesLead: "Doa builds these, and runs and supports them too.",
		worksLink: "Work and open source contributions",

		aboutTitle: "About the owner",
		aboutBody:
			"Doa is run by Ryuki Maruyama. He's a web engineer who has worked on payment processing and SaaS, and has also driven for a vehicle transport company. He holds a secondhand dealer licence.",
		aboutLink: "His career history is on the blog",

		contactTitle: "Contact",
		contactBody: "Use the form, or send an email.",
	},

	services: {
		todoroku: {
			name: "Todoroku",
			body: "Vehicle ledgers and registration paperwork. Enter the fields from the vehicle inspection certificate once, and it keeps the inspection, compulsory insurance and tax deadlines, the cost and profit per car (with consumption tax categories), and the steps from purchase through cargo registration to sale in one place. It also prints the weight distribution sheet for structural modifications. It's a tool for people who do their own paperwork; it doesn't file on anyone's behalf.",
		},
		worklog: {
			name: "worklog",
			body: "Works out each day's start, end, breaks and working time from the API logs of Slack, GitHub, GitLab, Backlog, Jira, OpenProject and Redmine. There's no agent to install, and it can build timesheets for past months.",
		},
	},

	worksPage: {
		title: "Services & Work",
		description: "Doa's own services, past work and open source contributions.",
		servicesTitle: "Own services",
		servicesLead: "Doa builds these, and runs and supports them too.",
		worksTitle: "Work",
		source: "Source",
		others:
			"Smaller tools such as 𝕏ool, fixeed, cash-tabelog and svelte-slider are on GitHub ({user}, {org}).",
		ossTitle: "Open source contributions",
		ossLead:
			"Fixes for bugs found in software Doa uses, sent upstream as pull requests.",
	},

	works: {
		denpa: {
			name: "denpa",
			body: "A system for recording and watching TV. It has two parts: an agent that drives the tuner and streams the raw TS, and the main app for the programme guide, reservations, recording, encoding, streaming and live viewing. No separate media server. Written in TypeScript and Svelte, with C# on the tuner side.",
		},
		mogiri: {
			name: "mogiri",
			body: "A web app for events: QR admission, pre-orders, in-store pickup and self-checkout. It merges qes (admission) and Smart QR Payment (sales). The first version used Django REST Framework and Nuxt; it's now a single Bun, SvelteKit and SQLite app.",
		},
		yuzuriha: {
			name: "yuzuriha (譲葉)",
			body: "Collects zero-yen properties from several listing sites every day and plots them on a satellite map.",
		},
		helmMosp: {
			name: "helm-mosp",
			body: "An image and Helm chart for running MosP, an open-source attendance system, on Kubernetes. Each month it checks upstream for changes, rebuilds the image and pushes it to GHCR. An init container sets up the database.",
		},
		gitops: {
			name: "gitops",
			body: "The Kubernetes platform Doa's services run on. A Talos Linux cluster managed with Argo CD. Traffic comes in through Cilium's Gateway API, secrets are in Infisical, and k8up backs up to Cloudflare R2. Sign-in is Entra ID single sign-on, and the Cloudflare and Entra settings are in Pulumi. Matrix and Forgejo are self-hosted here too.",
		},
	},

	oss: {
		ffmpeg: {
			name: "FFmpeg",
			body: "Fixes for the ARIB caption decoder that uses libaribcaption. A fix for clearing captions in bitmap mode has been merged.",
		},
		blades: {
			name: "Blades CSS",
			body: "The successor to Pico CSS. Merged changes include light-dark() colours, contrast fixes for focus rings and other parts, an opt-in compact mode, layered per-part builds, dialog and popover parts, and moving minification to lightningcss.",
		},
		talos: {
			name: "Talos Linux",
			body: "Changes that make the PT3 TV tuner driver available as a Talos extension, merged into siderolabs/pkgs and siderolabs/extensions.",
		},
		epgstation: {
			name: "EPGStation",
			body: "Merged into the EPGStation recorder and its Docker setup (docker-mirakurun-epgstation): an encoding bug fix, and support for subtitles and hardware encoding.",
		},
	},

	company: {
		title: "Company",
		description: "Doa's trade name, owner, location and licence.",
		tradeName: "Trade name",
		representative: "Owner",
		representativeName: "Ryuki Maruyama",
		location: "Location",
		locationValue: "Kisarazu, Chiba, Japan",
		founded: "Established",
		foundedValue: "October 2018",
		business: "Business",
		businessItems: [
			"Web systems and apps built to order, in any language, including the infrastructure (Kubernetes, IaC, cloud)",
			"Websites and landing pages",
			"Advice on buying and selling used cars",
			"Advice on vehicle registration, such as cargo registration",
			"Building and running Doa's own services",
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
		lead: "For development work, used cars or vehicle registration. Replies come by email.",
		emailAlt: "Or email",
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
			"This form uses JavaScript for a bot check. Without JavaScript, please send an email instead.",
		privacy: "What you send is only used to reply to you.",
		errors: {
			invalid: "Check the highlighted fields.",
			turnstile:
				"The bot check didn't finish. Wait for it to complete, then send again.",
			rate_limited:
				"Too many messages in a short time. Try again later, or send an email.",
			too_large: "Too long. Shorten it and send again.",
			unsupported: "Couldn't send. Reload the page and try again.",
			unavailable:
				"The form isn't accepting messages right now. Send an email instead.",
			send_failed: "Couldn't send. Try again later, or send an email.",
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
		description: "Your message was received.",
		body: "Thanks for your message. A reply will go to the email address you entered.",
		back: "Back to home",
	},

	footer: {
		copyright: "© Doa",
		blog: "Blog",
		social: "Social",
	},
};
