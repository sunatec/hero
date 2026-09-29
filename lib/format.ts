const MINUS = "−";

/** +18.4% / −8.0% / 0.0% — one decimal, explicit sign, true minus sign (brand.md §3.2). */
export function formatPct(value: number): string {
	const rounded = Math.round(value * 10) / 10;
	const abs = Math.abs(rounded).toFixed(1);
	if (rounded > 0) return `+${abs}%`;
	if (rounded < 0) return `${MINUS}${abs}%`;
	return `${abs}%`;
}

export function pctTone(value: number): "gain" | "loss" | "flat" {
	if (value > 0) return "gain";
	if (value < 0) return "loss";
	return "flat";
}

const TZ = "Asia/Shanghai";

function parts(iso: string) {
	const fmt = new Intl.DateTimeFormat("en-CA", {
		timeZone: TZ,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23",
	});
	const map = Object.fromEntries(
		fmt.formatToParts(new Date(iso)).map((p) => [p.type, p.value]),
	);
	return map as Record<"year" | "month" | "day" | "hour" | "minute", string>;
}

/** 2026.10.14 10:02 — always rendered in UTC+8 regardless of the server's timezone. */
export function formatDateTime(iso: string): string {
	const p = parts(iso);
	return `${p.year}.${p.month}.${p.day} ${p.hour}:${p.minute}`;
}

/** 2026.10.14 */
export function formatDate(iso: string): string {
	const p = parts(iso.length === 10 ? `${iso}T12:00:00+08:00` : iso);
	return `${p.year}.${p.month}.${p.day}`;
}

/** 10.14 10:02 — compact form for ledger rows. */
export function formatShort(iso: string): string {
	const p = parts(iso);
	return `${p.month}.${p.day} ${p.hour}:${p.minute}`;
}

export function holdingDays(openedAt: string, closedAt: string): number {
	return Math.max(
		1,
		Math.round((Date.parse(closedAt) - Date.parse(openedAt)) / 86_400_000),
	);
}
