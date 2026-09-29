import type { ReactNode } from "react";
import styles from "./CaseFile.module.css";

type Props = {
	/** Folder-tab label, e.g. "结案 · IC-2026-0126". */
	tab: string;
	/** Top-right slot, normally a <Stamp />. */
	stamp?: ReactNode;
	/** Dashed outline for open (unclosed) files. */
	dashed?: boolean;
	as?: "article" | "section" | "div";
	className?: string;
	children: ReactNode;
};

export function CaseFile({
	tab,
	stamp,
	dashed = false,
	as: Tag = "article",
	className = "",
	children,
}: Props) {
	return (
		<Tag
			className={[styles.file, dashed && styles.dashed, className]
				.filter(Boolean)
				.join(" ")}
			data-tab={tab}
		>
			{stamp ? <div className={styles.stamp}>{stamp}</div> : null}
			{children}
		</Tag>
	);
}

/** Kicker + title block used at the top of a case file; leaves room for the stamp. */
export function CaseFileHeader({
	kicker,
	title,
}: {
	kicker: string;
	title: ReactNode;
}) {
	return (
		<header className="pr-28">
			<p className="font-mono text-[11px] font-medium tracking-[0.14em] text-dossier uppercase">
				{kicker}
			</p>
			<h3 className="mt-1 mb-4 font-serif-zh text-[22px] leading-snug font-bold tracking-[0.04em]">
				{title}
			</h3>
		</header>
	);
}

export function CaseFileFooter({ children }: { children: ReactNode }) {
	return (
		<footer className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-line pt-3.5 font-mono text-[13px] text-bone-dim">
			{children}
		</footer>
	);
}
