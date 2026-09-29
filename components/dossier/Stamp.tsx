import type { CSSProperties } from "react";
import { statusLabel } from "@/lib/i18n/labels";
import type { SignalStatus } from "@/lib/schema/signal";
import styles from "./Stamp.module.css";

type Props = {
	status: SignalStatus;
	size?: "sm" | "md" | "lg";
	/** Small mono line under the word, e.g. the closing date. */
	date?: string;
	/** Press-in animation; M11 wires it to viewport entry. */
	animate?: boolean;
	delay?: number;
	className?: string;
};

/** Status stamp. The word is always rendered as text, so colour is never the only signal (a11y). */
export function Stamp({
	status,
	size = "md",
	date,
	animate = false,
	delay,
	className = "",
}: Props) {
	const cls = [
		styles.stamp,
		size !== "md" && styles[size],
		status === "open" && styles.open,
		status === "void" && styles.void,
		animate && styles.animate,
		className,
	]
		.filter(Boolean)
		.join(" ");
	const style =
		delay === undefined ? undefined : ({ "--d": `${delay}s` } as CSSProperties);
	return (
		<span className={cls} style={style} data-status={status}>
			{statusLabel[status]}
			{date ? <small className={styles.date}>{date}</small> : null}
		</span>
	);
}
