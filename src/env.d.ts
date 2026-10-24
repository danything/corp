/// <reference types="astro/client" />

interface ImportMetaEnv {
	/** Turnstile のサイトキー。手元で試すときにテスト用のキー(1x00000000000000000000AA)へ差し替える */
	readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
}
