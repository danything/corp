// IP ごとの回数制限(メモリ上。Pod は 1 つなので共有しない)。
// 直近 windowMs の間に受け付けた時刻を持ち、limit 回を超えたら断る

export type Take = { ok: true } | { ok: false; retryAfterSec: number };

export class RateLimiter {
	readonly #hits = new Map<string, number[]>();

	constructor(
		readonly limit: number,
		readonly windowMs: number,
	) {}

	/** 1 回分を数える。上限を超えていれば数えずに断り、次に空く時刻までの秒数を返す */
	take(key: string, now = Date.now()): Take {
		const since = now - this.windowMs;
		const hits = (this.#hits.get(key) ?? []).filter((t) => t > since);
		if (hits.length >= this.limit) {
			this.#hits.set(key, hits);
			const oldest = hits[0] ?? now;
			return {
				ok: false,
				retryAfterSec: Math.max(
					1,
					Math.ceil((oldest + this.windowMs - now) / 1000),
				),
			};
		}
		hits.push(now);
		this.#hits.set(key, hits);
		return { ok: true };
	}

	/** 期限の切れた記録を捨てる(server.ts が定期的に呼ぶ) */
	prune(now = Date.now()): void {
		const since = now - this.windowMs;
		for (const [key, hits] of this.#hits) {
			if (!hits.some((t) => t > since)) this.#hits.delete(key);
		}
	}

	get size(): number {
		return this.#hits.size;
	}
}
