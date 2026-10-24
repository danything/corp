import type { Translation } from "../translation";

export const en: Translation = {
	siteDescription:
		"Doa is a one-person business in Kisarazu, Chiba, Japan. It builds web systems and apps to order, and helps with used cars and vehicle registration.",

	nav: {
		label: "Main",
		home: "Home",
		company: "Company",
		business: "What we do",
		works: "Work",
		blog: "Blog",
		contact: "Contact",
		switchLang: "日本語",
		switchLangLabel: "日本語版",
	},
	skipToContent: "Skip to content",

	theme: {
		label: "Colour scheme",
		auto: "match system",
		light: "light",
		dark: "dark",
	},

	home: {
		title: "Web systems, used cars and vehicle registration",
		lead: "Doa builds business systems and web apps, and can also help you buy or sell a used car or sort out vehicle registration.",
		ctaContact: "Contact",
		ctaBusiness: "What we do",
		shotsLabel: "Own services",
		shots: {
			todoroku:
				"The Todoroku home page, showing the vehicle ledger form with the make, model and engine type filled in",
			worklog:
				"The worklog home page, with a sample timesheet built from Slack and GitHub logs",
		},

		businessTitle: "What we do",

		contactTitle: "Contact",
		contactBody: "Use the form, or send an email.",
	},

	business: {
		dev: {
			title: "Web systems and apps, built to order",
			summary: "Business systems and web apps, from design to infrastructure.",
			body: "Business systems and web apps, from sorting out requirements through design and code to running them. Any language or framework. The platform they run on (Kubernetes, IaC, the cloud) can be built and operated too.",
		},
		web: {
			title: "Websites and landing pages",
			summary: "New sites and landing pages, or changes to existing ones.",
			body: "New sites and landing pages, or changes to existing ones, on WordPress and similar.",
		},
		cars: {
			title: "Buying and selling used cars",
			summary: "Help buying or selling a used car through dealer auctions.",
			body: "Doa holds a secondhand dealer licence (kobutsusho kyoka) and is a member of AUTOSERVER, buying and selling used cars at dealer auctions. Get in touch whether you're looking for a car or want to sell one.",
		},
		registration: {
			title: "Vehicle registration",
			summary:
				"Help with vehicle registration in Japan, such as cargo registration.",
			body: "Help with vehicle registration and notifications in Japan, such as cargo (commercial vehicle) registration. If you'd rather do the paperwork yourself, Doa's own service Todoroku builds it from the vehicle inspection certificate.",
		},
		services: {
			title: "Own services",
			summary: "Todoroku for vehicle ledgers, and worklog for timesheets.",
			body: "Built in-house, and run and supported by Doa.",
		},
	},

	businessPage: {
		title: "What we do",
		description:
			"What Doa does: web systems and apps built to order, websites, help with used cars and vehicle registration, and its own services.",
		techTitle: "Technology used so far",
		tech: [
			{
				label: "Backend",
				value:
					"PHP / Laravel, Java / Spring, C# / .NET, Go, Python, TypeScript / Bun",
			},
			{ label: "Frontend", value: "React / Next.js, Svelte / SvelteKit" },
			{
				label: "Infrastructure",
				value:
					"AWS (ECS, CloudFormation), Kubernetes (Talos Linux, Argo CD), Cloudflare, Pulumi",
			},
		],
		worksLink: "Past work",
		licenseNote: "The licence number is on the {link}.",
		licenseLink: "company page",
		openSite: "Open site",
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
		title: "Work",
		description: "Doa's past work and open source contributions.",
		worksTitle: "Work",
		source: "Source",
		others:
			"Smaller tools such as 𝕏ool, fixeed, cash-tabelog and svelte-slider are on GitHub ({user}, {org}).",
		ossTitle: "Open source contributions",
		ossLead:
			"Fixes for bugs found in software Doa uses, sent upstream as pull requests.",
		shots: {
			denpa:
				"The denpa recordings list, with recordings and reservations of made-up programmes, and a month calendar and filters on the right",
			mogiri:
				"The mogiri counter sales screen: cards for an admission ticket, a festival T-shirt (S, M, L) and yakisoba, each with quantity buttons",
			yuzuriha:
				"Yuzuriha: a satellite map of Japan with property counts grouped by area, and filters on the left",
		},
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
		description:
			"Doa's trade name, location and licence, and the owner's profile.",
		tradeName: "Trade name",
		representative: "Owner",
		representativeName: "Ryuki Maruyama",
		location: "Location",
		locationValue: "Kisarazu, Chiba, Japan",
		founded: "Established",
		foundedValue: "October 2018",
		business: "Business",
		license: "Secondhand dealer licence",
		licenseValue: "Nagano Prefectural Public Safety Commission",
		email: "Email",
	},

	profile: {
		title: "Owner's profile",
		lead: "Career and licences of Ryuki Maruyama, who runs Doa.",
		careerTitle: "Career",
		present: "present",
		career: {
			kosen: {
				title:
					"National Institute of Technology, Kisarazu College, Department of Information Engineering (left before graduating)",
				body: "Worked part-time in PC sales while studying there (October 2016 to November 2017).",
			},
			webProduction: {
				title: "Web production company",
				body: "Client work, such as building WordPress media sites.",
			},
			ses: {
				title: "IT staffing company",
				body: "Placed at client companies, worked on e-commerce sites, business dashboards, a ticketing system and more, from sorting out requirements to code and infrastructure. PHP, Laravel, React, AWS ECS.",
			},
			doa: {
				title: "Started Doa as a sole proprietorship",
				body: "Development work for clients, and Doa's own services.",
			},
			payment: {
				title: "Payment service provider",
				body: "Ran infrastructure, operations and maintenance as an in-house systems engineer, then moved to the development team. Built the merchant console and payment widget (React), the settlement system (Spring), and payment plugins for EC-CUBE and WooCommerce.",
			},
			toyo: {
				title:
					"Toyo University, Faculty of Law, Department of Law, evening course (left before graduating)",
				body: "",
			},
			prm: {
				title: "PRM SaaS company",
				body: "On a Scrum team: moved the database and backend from Amplify to MySQL and Laravel, split email delivery out into C# / .NET, and rebuilt the frontend in Next.js with full-text search in Go and OpenSearch. The team won a Findy Team+ Award 2024.",
			},
			autoParts: {
				title: "Auto parts company",
				body: "Started on its parts sales SaaS as a contractor, and joined as an employee in June 2026. Works on the API (Laravel), frontend (React, TypeScript), infrastructure (AWS CloudFormation) and data integration (Python).",
			},
			transport: {
				title: "Vehicle transport company",
				body: "Drove three-car carriers and safety loaders. Made regular runs bringing used cars for export into the yard, and trained new drivers on new Lexus deliveries.",
			},
		},
		licensesTitle: "Licences",
		licenses: {
			motorcycle: "Ordinary motorcycle licence",
			ordinary: "Ordinary vehicle driving licence (class 1)",
			kobutsu: "Secondhand dealer licence",
			medium: "Medium vehicle driving licence (class 1)",
		},
		oss: "Open source contributions are on {link}.",
		ossLink: "Work",
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
