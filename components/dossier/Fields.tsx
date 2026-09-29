import type { ReactNode } from "react";
import { formatPct, pctTone } from "@/lib/format";

export type Field = { label: string; value: ReactNode };

/** Label / value table used inside case files. Values are mono with tabular numerals. */
export function Fields({ items }: { items: Field[] }) {
	return (
		<dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-sm">
			{items.map((f) => (
				<div key={f.label} className="contents">
					<dt className="text-[13px] text-bone-dim">{f.label}</dt>
					<dd className="m-0 text-right font-mono tabular-nums">{f.value}</dd>
				</div>
			))}
		</dl>
	);
}

const TONE = {
	gain: "text-gain",
	loss: "text-loss",
	flat: "text-bone",
} as const;

/** A signed percentage, coloured only by sign — the sign itself carries the meaning (a11y). */
export function Pct({
	value,
	className = "",
}: {
	value: number;
	className?: string;
}) {
	return (
		<span
			className={`font-mono tabular-nums ${TONE[pctTone(value)]} ${className}`}
		>
			{formatPct(value)}
		</span>
	);
}
