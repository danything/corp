import { expect, test } from "bun:test";
import { RateLimiter } from "../server/rate-limit";

test("上限を超えたら断り、時間が経てば戻る", () => {
  const limiter = new RateLimiter(2, 1000);
  expect(limiter.take("a", 0).ok).toBe(true);
  expect(limiter.take("a", 100).ok).toBe(true);
  const denied = limiter.take("a", 200);
  expect(denied).toEqual({ ok: false, retryAfterSec: 1 });
  // ほかの IP は別に数える
  expect(limiter.take("b", 200).ok).toBe(true);
  // 最初の 1 回が窓から外れれば、また受け付ける
  expect(limiter.take("a", 1001).ok).toBe(true);
});

test("prune で期限の切れた記録を捨てる", () => {
  const limiter = new RateLimiter(5, 1000);
  limiter.take("a", 0);
  limiter.take("b", 900);
  limiter.prune(1500);
  expect(limiter.size).toBe(1);
});
