// 問い合わせフォームを fetch で送る(JavaScript が無ければ普通のフォームの送信になる)。
// 入力の検査はブラウザ(required・maxlength・type="email")に任せ、サーバーの結果だけを表示する。
// 応答は server/contact.ts の { ok } か { ok: false, error, fields }

declare global {
	interface Window {
		turnstile?: { reset: (widget?: string | HTMLElement) => void };
	}
}

export {};

const FIELDS = ["name", "email", "company", "message"];

const form = document.querySelector<HTMLFormElement>("form[data-contact]");
const statusEl = form?.querySelector<HTMLElement>("[data-contact-status]");
const button = form?.querySelector<HTMLButtonElement>("button[type=submit]");

function showError(code: string, fields: string[] = []) {
	if (!form || !statusEl) return;
	for (const name of FIELDS) {
		const el = form.elements.namedItem(name);
		if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement))
			continue;
		if (fields.includes(name)) {
			el.setAttribute("aria-invalid", "true");
			el.setAttribute("aria-describedby", `${name}-error`);
		} else {
			el.removeAttribute("aria-invalid");
			el.removeAttribute("aria-describedby");
		}
	}
	statusEl.textContent =
		statusEl.getAttribute(`data-msg-${code}`) ??
		statusEl.getAttribute("data-msg-unavailable") ??
		"";
	statusEl.hidden = false;
	statusEl.focus();
}

form?.addEventListener("submit", async (event) => {
	event.preventDefault();
	if (!button || button.disabled) return;
	const label = button.textContent;
	button.disabled = true;
	button.setAttribute("aria-busy", "true");
	button.textContent = button.dataset.sending ?? label;
	try {
		const res = await fetch(form.action, {
			method: "POST",
			headers: { Accept: "application/json" },
			body: new URLSearchParams(
				new FormData(form) as unknown as Record<string, string>,
			),
		});
		const data = (await res.json().catch(() => ({}))) as {
			ok?: boolean;
			error?: string;
			fields?: string[];
		};
		if (res.ok && data.ok) {
			location.assign(form.dataset.thanks ?? "/");
			return;
		}
		showError(data.error ?? "unavailable", data.fields);
	} catch {
		showError("network");
	}
	// トークンは 1 回しか使えないので、送り直せるように取り直す
	window.turnstile?.reset();
	button.disabled = false;
	button.removeAttribute("aria-busy");
	button.textContent = label;
});
