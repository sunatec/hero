import type { CSSProperties } from "react";
import { REDACT_ARIA, REDACT_TIP } from "@/lib/i18n/labels";
import { parseRedacted } from "@/lib/redact";
import styles from "./Redaction.module.css";

type Props = {
	/** Visual width in characters. There is deliberately no prop for the hidden value. */
	width: number;
	/** Lighter bar for use on the near-black feed panel. */
	subtle?: boolean;
	animate?: boolean;
	delay?: number;
};

export function Redaction({
	width,
	subtle = false,
	animate = false,
	delay,
}: Props) {
	const style = {
		"--w": width,
		...(delay === undefined ? {} : { "--d": `${delay}s` }),
	} as CSSProperties;
	const cls = [
		styles.redact,
		subtle && styles.subtle,
		animate && styles.animate,
	]
		.filter(Boolean)
		.join(" ");
	return (
		// Not focusable on purpose: the aria-label carries the meaning; the hover tip is a mouse-only extra.
		<span
			role="img"
			aria-label={REDACT_ARIA}
			className={cls}
			style={style}
			data-tip={REDACT_TIP}
			data-reveal={animate ? undefined : "redact"}
		/>
	);
}

/** Renders a content line where `▇{n}` marks a redaction of n characters. */
export function RedactedLine({
	line,
	subtle,
}: {
	line: string;
	subtle?: boolean;
}) {
	return (
		<>
			{parseRedacted(line).map((seg, i) =>
				seg.kind === "text" ? (
					// biome-ignore lint/suspicious/noArrayIndexKey: segments are static and never reorder
					<span key={i}>{seg.text}</span>
				) : (
					// biome-ignore lint/suspicious/noArrayIndexKey: segments are static and never reorder
					<Redaction key={i} width={seg.width} subtle={subtle} />
				),
			)}
		</>
	);
}
