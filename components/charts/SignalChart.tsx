type Mark = { index: number; label: string };

type Props = {
	/** Price series, oldest first. */
	series: number[];
	entry: Mark;
	peak: Mark;
	exit: Mark;
	/** Horizontal reference lines, e.g. the stop-loss. */
	levels?: { value: number; kind: "entry" | "stop" | "target" }[];
	/** Required text alternative for screen readers (WEBSITE_PLAN §18). */
	summary: string;
	/** Plot height in px; width always fills the container. */
	height?: number;
};

const W = 1000;
const H = 1000;
const PAD_Y = 0.16;

/**
 * Print-style replay chart. The line is an SVG stretched to the container (strokes don't scale);
 * dots and serif annotations are HTML positioned in %, so text stays 11px at any card width.
 */
export function SignalChart({
	series,
	entry,
	peak,
	exit,
	levels = [],
	summary,
	height = 130,
}: Props) {
	const values = [...series, ...levels.map((l) => l.value)];
	const min = Math.min(...values);
	const span = Math.max(...values) - min || 1;
	const xPct = (i: number) => (i / Math.max(1, series.length - 1)) * 100;
	const yPct = (v: number) =>
		(PAD_Y + (1 - (v - min) / span) * (1 - 2 * PAD_Y)) * 100;
	const points = series
		.map(
			(v, i) =>
				`${((xPct(i) / 100) * W).toFixed(1)},${((yPct(v) / 100) * H).toFixed(1)}`,
		)
		.join(" ");

	const marks = [
		{ m: entry, n: "①", filled: true },
		{ m: peak, n: "②", filled: true },
		{ m: exit, n: "③", filled: false },
	].map(({ m, n, filled }) => ({
		n,
		filled,
		label: m.label,
		x: xPct(m.index),
		y: yPct(series[m.index] ?? min),
	}));

	return (
		<figure className="relative m-0" style={{ height }}>
			<svg
				viewBox={`0 0 ${W} ${H}`}
				preserveAspectRatio="none"
				className="absolute inset-0 block size-full overflow-visible"
				aria-hidden="true"
			>
				{levels.map((l) => (
					<line
						key={`${l.kind}-${l.value}`}
						x1={0}
						x2={W}
						y1={(yPct(l.value) / 100) * H}
						y2={(yPct(l.value) / 100) * H}
						stroke={
							l.kind === "stop" ? "var(--color-loss)" : "var(--color-line)"
						}
						strokeOpacity={l.kind === "stop" ? 0.5 : 1}
						strokeDasharray={l.kind === "stop" ? "2 3" : "3 4"}
						vectorEffect="non-scaling-stroke"
					/>
				))}
				<polyline
					fill="none"
					stroke="var(--color-bone)"
					strokeWidth={1.4}
					points={points}
					vectorEffect="non-scaling-stroke"
				/>
			</svg>
			{marks.map((mk) => {
				const below = mk.y < 30;
				const align =
					mk.x > 75
						? "-translate-x-full"
						: mk.x < 20
							? "-translate-x-2"
							: "-translate-x-1/2";
				return (
					<div key={mk.n} aria-hidden="true">
						<span
							className={`absolute size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-stamp ${
								mk.filled ? "bg-stamp" : "bg-ink-1"
							}`}
							style={{ left: `${mk.x}%`, top: `${mk.y}%` }}
						/>
						<span
							className={`absolute whitespace-nowrap bg-ink-1/85 px-1 font-serif-zh text-[11px] leading-none font-bold text-dossier ${align} ${
								below ? "translate-y-[9px]" : "-translate-y-[calc(100%+9px)]"
							}`}
							style={{ left: `${mk.x}%`, top: `${mk.y}%` }}
						>
							{mk.n} {mk.label}
						</span>
					</div>
				);
			})}
			<figcaption className="sr-only">{summary}</figcaption>
		</figure>
	);
}
