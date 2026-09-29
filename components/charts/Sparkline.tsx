/** Minimal trend line for stat cells. Decorative unless `label` is given. */
export function Sparkline({
	values,
	label,
	width = 96,
	height = 24,
	tone = "bone",
}: {
	values: number[];
	label?: string;
	width?: number;
	height?: number;
	tone?: "bone" | "gain" | "loss";
}) {
	if (values.length < 2) return null;
	const min = Math.min(...values);
	const span = Math.max(...values) - min || 1;
	const points = values
		.map(
			(v, i) =>
				`${((i / (values.length - 1)) * width).toFixed(1)},${(height - 2 - ((v - min) / span) * (height - 4)).toFixed(1)}`,
		)
		.join(" ");
	return (
		<svg
			viewBox={`0 0 ${width} ${height}`}
			width={width}
			height={height}
			role={label ? "img" : undefined}
			aria-label={label}
			aria-hidden={label ? undefined : true}
		>
			<polyline
				fill="none"
				stroke={`var(--color-${tone})`}
				strokeWidth="1.25"
				points={points}
			/>
		</svg>
	);
}
