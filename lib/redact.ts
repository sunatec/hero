export type RedactSegment =
	| { kind: "text"; text: string }
	| { kind: "redact"; width: number };

const TOKEN = /▇\{(\d{1,2})\}/g;

/**
 * Splits a sample line like `集群 ▇{8} 共 6 地址` into text and redaction segments.
 * Redactions carry only a width — the hidden value never exists in the repo (content-model §3).
 */
export function parseRedacted(line: string): RedactSegment[] {
	const out: RedactSegment[] = [];
	let last = 0;
	for (const m of line.matchAll(TOKEN)) {
		const at = m.index ?? 0;
		if (at > last) out.push({ kind: "text", text: line.slice(last, at) });
		out.push({
			kind: "redact",
			width: Math.min(40, Math.max(2, Number(m[1]))),
		});
		last = at + m[0].length;
	}
	if (last < line.length) out.push({ kind: "text", text: line.slice(last) });
	return out;
}
