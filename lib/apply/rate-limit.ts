/**
 * Best-effort sliding-window limiter for POST /api/apply (WEBSITE_PLAN §22 「频繁提交」).
 * In-memory, so each serverless instance keeps its own window; Turnstile tokens are single-use,
 * which already makes bulk submission expensive. Swap for a shared store if abuse shows up.
 */
export function createRateLimiter({
	limit,
	windowMs,
}: {
	limit: number;
	windowMs: number;
}) {
	const hits = new Map<string, number[]>();
	return (key: string, now = Date.now()): boolean => {
		const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
		if (recent.length >= limit) {
			hits.set(key, recent);
			return false;
		}
		recent.push(now);
		hits.set(key, recent);
		// Keep the map bounded: drop keys whose window has fully expired.
		if (hits.size > 5000) {
			for (const [k, v] of hits)
				if (v.every((t) => now - t >= windowMs)) hits.delete(k);
		}
		return true;
	};
}
