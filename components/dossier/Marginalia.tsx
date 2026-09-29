/** Left annotation column (编号 / 日期 / 来源). Collapses to one meta line below lg. */
export function Marginalia({ items }: { items: { k: string; v: string }[] }) {
	return (
		<>
			<aside
				aria-hidden="true"
				className="hidden flex-col gap-5 pt-2.5 lg:flex"
			>
				{items.map((it) => (
					<p
						key={it.k}
						className="m-0 font-mono text-xs leading-relaxed tracking-[0.06em] text-dossier"
					>
						{it.k}
						<span className="block text-bone-dim">{it.v}</span>
					</p>
				))}
			</aside>
			<p className="mb-4 font-mono text-xs tracking-[0.06em] text-dossier lg:hidden">
				{items.map((it) => `${it.k} ${it.v}`).join(" · ")}
			</p>
		</>
	);
}
