/** 档案夹分隔线: "§ 05 最新台账 ────". Renders the section heading (h2) for a11y. */
export function SectionDivider({
	n,
	title,
	id,
}: {
	n: number;
	title: string;
	id?: string;
}) {
	return (
		<div className="mb-10 flex items-center gap-4">
			<h2 id={id} className="m-0 flex items-baseline gap-2.5 whitespace-nowrap">
				<span className="font-mono text-xs font-medium tracking-[0.12em] text-dossier">
					§ {String(n).padStart(2, "0")}
				</span>
				<span className="font-serif-zh text-base font-bold tracking-[0.1em] text-bone">
					{title}
				</span>
			</h2>
			<span
				aria-hidden="true"
				data-reveal="line"
				className="h-px flex-1 bg-line"
			/>
		</div>
	);
}
