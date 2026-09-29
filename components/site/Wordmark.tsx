/**
 * Inline copy of design/wordmark/wordmark-horizontal.svg (geometric, font-independent).
 * Glyphs use currentColor; the slash through the zero is always stamp red (brand.md §4).
 */
export function Wordmark({
	className = "h-5 w-auto",
	title = "0xInChain",
}: {
	className?: string;
	title?: string;
}) {
	return (
		<svg
			viewBox="-4 12 412 76"
			className={className}
			role="img"
			aria-label={title}
		>
			<g
				fill="none"
				stroke="currentColor"
				strokeWidth="7"
				strokeLinecap="butt"
				strokeLinejoin="miter"
			>
				<ellipse cx="18" cy="50" rx="14.5" ry="26.5" />
				<path transform="translate(46 0)" d="M3 36 L33 80 M33 36 L3 80" />
				<path
					transform="translate(92 0)"
					d="M18 20 V80 M7 23.5 H29 M7 76.5 H29"
				/>
				<path
					transform="translate(138 0)"
					d="M3.5 36 V80 M3.5 52 C3.5 43 9 39.5 17.5 39.5 C27 39.5 32.5 44 32.5 53 V80"
				/>
				<path
					transform="translate(184 0)"
					d="M33 31 C29.5 25.5 24.5 23.5 18.5 23.5 C9 23.5 3.5 34 3.5 50 C3.5 66 9 76.5 18.5 76.5 C24.5 76.5 29.5 74.5 33 69"
				/>
				<path
					transform="translate(230 0)"
					d="M3.5 20 V80 M3.5 52 C3.5 43 9 39.5 17.5 39.5 C27 39.5 32.5 44 32.5 53 V80"
				/>
				<g transform="translate(276 0)">
					<path d="M32.5 36 V80" />
					<ellipse cx="18" cy="58" rx="14.5" ry="18.5" />
				</g>
				<path
					transform="translate(322 0)"
					d="M8 39.5 H18 M18 36 V80 M7 76.5 H29"
				/>
				<path
					transform="translate(368 0)"
					d="M3.5 36 V80 M3.5 52 C3.5 43 9 39.5 17.5 39.5 C27 39.5 32.5 44 32.5 53 V80"
				/>
			</g>
			<rect x="336.5" y="17" width="7" height="7" fill="currentColor" />
			<path
				d="M10 64 L26 36"
				fill="none"
				stroke="var(--color-stamp)"
				strokeWidth="7"
			/>
		</svg>
	);
}
