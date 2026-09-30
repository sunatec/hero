import Link from "next/link";
import {
	Pane,
	PaneData,
	PaneFeed,
	PaneTitle,
	paneAction,
	paneLink,
} from "@/components/pane/Pane";
import { categoryLabel } from "@/lib/i18n/labels";
import { type ToolRow, toolActions } from "@/lib/tools";

export const CHAIN_LABEL: Record<string, string> = {
	cex: "CEX",
	eth: "ETH",
	bsc: "BSC",
	base: "BASE",
	sol: "SOL",
	hyperliquid: "Hyperliquid",
};

export const chainsText = (chains: string[]) =>
	chains.length ? chains.map((c) => CHAIN_LABEL[c] ?? c).join(" · ") : "—";

/** 「关联台账 N 份 →」 — links into the ledger filtered by this module. */
export function LedgerCount({
	t,
	className = "",
}: {
	t: ToolRow;
	className?: string;
}) {
	return t.ledgerCount > 0 ? (
		<Link href={`/ledger?module=${t.slug}`} className={className}>
			关联台账 {t.ledgerCount} 份 →
		</Link>
	) : (
		<span className={className}>关联台账 —</span>
	);
}

/** Toolbox pane (WEBSITE_PLAN §10.2). Planned modules render as a hatched pane without data. */
export function ToolPane({ t }: { t: ToolRow }) {
	const label = `${t.code} / ${categoryLabel[t.category].code}`;
	if (t.status === "planned") {
		return (
			<Pane label={label} status="planned">
				<PaneTitle en={t.nameEn} zh={t.nameZh} />
				<p className="m-0 font-sans text-[13px] leading-relaxed text-bone-dim">
					{t.tagline}
				</p>
			</Pane>
		);
	}
	return (
		<Pane
			label={label}
			status={t.status}
			footer={
				<>
					<LedgerCount t={t} className={`${paneLink} mr-auto`} />
					{toolActions(t)
						.reverse()
						.map((a) =>
							a.kind === "open" ? (
								<a
									key={a.kind}
									href={a.href}
									target="_blank"
									rel="noopener noreferrer"
									className={paneAction}
									aria-label={`打开 ${t.nameZh}（新窗口）`}
								>
									{a.label}
								</a>
							) : (
								<Link
									key={a.kind}
									href={a.href}
									className={paneAction}
									aria-label={`${t.nameZh} 详情`}
								>
									{a.label}
								</Link>
							),
						)}
				</>
			}
		>
			<PaneTitle en={t.nameEn} zh={t.nameZh} />
			<PaneData
				items={[
					{ label: "数据源", value: t.sources.join(" · ") || "—" },
					{ label: "覆盖", value: chainsText(t.chains) },
					{ label: "频率", value: t.frequency ?? "—" },
					{ label: "交付", value: t.delivery ?? "—" },
				]}
			/>
			{t.samples[0] ? <PaneFeed lines={t.samples[0].lines} /> : null}
		</Pane>
	);
}
