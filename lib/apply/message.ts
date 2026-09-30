import {
	type Application,
	capitalLabel,
	marketLabel,
	sourceLabel,
	yearsLabel,
} from "@/lib/schema/apply";

/** Telegram parse_mode=HTML only needs &, < and > escaped. */
export const escapeHtml = (s: string) =>
	s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** "2026.09.30 14:05 (UTC+8)" — the admins work in UTC+8. */
export function formatUtc8(date: Date): string {
	const d = new Date(date.getTime() + 8 * 3600_000);
	const p = (n: number) => String(n).padStart(2, "0");
	return `${d.getUTCFullYear()}.${p(d.getUTCMonth() + 1)}.${p(d.getUTCDate())} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())} (UTC+8)`;
}

/** Admin message — format fixed in docs/copy/join.md. Every user value is escaped. */
export function formatApplication(
	a: Application,
	moduleNames: string[],
	now = new Date(),
): string {
	const e = escapeHtml;
	const lines = [
		`🗂 <b>${a.waitlist ? "候补申请" : "新申请"}</b> · ${formatUtc8(now)}`,
		`TG：${e(a.handle)}`,
		`年限：${yearsLabel[a.years]}`,
		`市场：${a.markets.map((m) => marketLabel[m]).join(" / ")}`,
		`模块：${moduleNames.length ? moduleNames.map(e).join(" / ") : "—"}`,
		`资金：${a.capital ? capitalLabel[a.capital] : "未填"}`,
		`来源：${sourceLabel[a.source]}`,
		`留言：${a.message ? e(a.message) : "—"}`,
	];
	return lines.join("\n");
}
