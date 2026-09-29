import type { ReactNode } from "react";
import { RedactedLine } from "@/components/dossier/Redaction";
import { type ModuleStatus, moduleStatusLabel } from "@/lib/i18n/labels";

const DOT: Record<ModuleStatus, string> = {
	member: "bg-gain shadow-[0_0_0_3px_rgb(111_191_142/0.15)]",
	public: "bg-gain shadow-[0_0_0_3px_rgb(111_191_142/0.15)]",
	beta: "bg-dossier shadow-[0_0_0_3px_rgb(201_169_106/0.15)]",
	planned: "border border-bone-dim bg-transparent",
};

/** Status dot + text label (the label, not the colour, carries the meaning). */
export function StatusDot({ status }: { status: ModuleStatus }) {
	return (
		<span className="inline-flex items-center gap-[7px] text-bone-dim">
			<span
				aria-hidden="true"
				className={`size-[7px] rounded-full ${DOT[status]}`}
			/>
			{moduleStatusLabel[status]}
		</span>
	);
}

/** Pane grid: 1px hairlines are the gap showing the line colour behind the panes. */
export function PaneGrid({
	children,
	className = "",
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 xl:grid-cols-4 ${className}`}
		>
			{children}
		</div>
	);
}

type PaneProps = {
	/** Title bar label, e.g. "M-01 / DERIVATIVES". */
	label: string;
	status: ModuleStatus;
	footer?: ReactNode;
	children: ReactNode;
};

export function Pane({ label, status, footer, children }: PaneProps) {
	const planned = status === "planned";
	return (
		<article
			className={`group flex flex-col font-data transition-colors ${
				planned
					? "bg-[repeating-linear-gradient(135deg,var(--color-ink-0)_0_10px,#16181c_10px_20px)]"
					: "bg-ink-0 hover:bg-ink-1"
			}`}
		>
			<header className="flex h-[34px] items-center justify-between border-b border-line bg-ink-1 px-3.5 text-[10.5px] tracking-[0.06em]">
				<span className="text-dossier">{label}</span>
				<StatusDot status={status} />
			</header>
			<div
				className={`flex flex-1 flex-col px-4 pt-[18px] pb-4 ${planned ? "opacity-75" : ""}`}
			>
				{children}
			</div>
			{footer ? (
				<footer className="flex items-center justify-between border-t border-line text-[11px]">
					{footer}
				</footer>
			) : null}
		</article>
	);
}

export function PaneTitle({ en, zh }: { en: string; zh: string }) {
	return (
		<>
			<p className="m-0 text-[12.5px] leading-tight text-bone-dim">{en}</p>
			<h3 className="mt-1.5 mb-4 font-serif-zh text-xl font-bold tracking-[0.04em]">
				{zh}
			</h3>
		</>
	);
}

export function PaneData({
	items,
}: {
	items: { label: string; value: ReactNode }[];
}) {
	return (
		<dl className="mb-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-[7px] text-[11.5px] leading-snug">
			{items.map((it) => (
				<div key={it.label} className="contents">
					<dt className="text-bone-dim">{it.label}</dt>
					<dd className="m-0 text-right">{it.value}</dd>
				</div>
			))}
		</dl>
	);
}

/** Near-black feed panel with redacted sample lines (`▇{n}` syntax). */
export function PaneFeed({ lines }: { lines: string[] }) {
	return (
		<div className="mt-auto border-l-2 border-line bg-redact px-3 py-2.5 text-[11px] leading-[1.9] text-bone-dim">
			{lines.map((line) => (
				<p key={line} className="m-0">
					<RedactedLine line={line} subtle />
				</p>
			))}
		</div>
	);
}

/** Footer link styles for panes: plain link and the bracketed action. */
export const paneLink = "px-3.5 py-[13px] text-bone-dim hover:text-bone";
export const paneAction =
	'border-l border-line px-3.5 py-[13px] text-bone before:mr-0.5 before:text-dossier before:transition-[margin] before:content-["[_"] after:ml-0.5 after:text-dossier after:transition-[margin] after:content-["_]"] group-hover:before:-mr-0.5 group-hover:after:-ml-0.5';
