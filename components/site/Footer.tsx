import { allSignals } from "content-collections";
import Link from "next/link";
import { formatDateTime } from "@/lib/format";
import { site, TBD } from "@/site.config";
import { Arrow } from "./Button";
import { RISK_TEXT } from "./RiskNote";
import { Wordmark } from "./Wordmark";

type Col = {
	title: string;
	links: { href: string; label: string; external?: boolean }[];
};

function lastLedgerUpdate(): string | null {
	const times = allSignals.flatMap((s) => [
		s.registeredAt,
		...s.changelog.map((c) => c.at),
	]);
	if (times.length === 0) return null;
	return times.reduce((a, b) => (Date.parse(a) > Date.parse(b) ? a : b));
}

export function Footer() {
	const telegram = site.social.telegram === TBD ? null : site.social.telegram;
	const cols: Col[] = [
		{
			title: "情报",
			links: [
				{ href: "/ledger", label: "信号台账" },
				{ href: "/cases", label: "精选案例" },
				{ href: "/methodology", label: "方法论" },
				{ href: "/tools", label: "链上工具箱" },
			],
		},
		{
			title: "社群",
			links: [
				{ href: "/community", label: "社群介绍" },
				{ href: "/about", label: "主理人档案" },
				{ href: "/join", label: "申请加入" },
				{ href: "/research", label: "Research" },
			],
		},
		{
			title: "信任",
			links: [
				{ href: "/verify", label: "官方渠道验证" },
				{ href: "/legal/risk", label: "风险披露" },
				{ href: "/legal/privacy", label: "隐私说明" },
				{ href: "/legal/terms", label: "服务条款" },
			],
		},
		{
			title: "关注",
			links: [
				{ href: site.social.x, label: "X", external: true },
				...(telegram
					? [{ href: telegram, label: "Telegram", external: true }]
					: []),
				{ href: "/en", label: "English" },
			],
		},
	];
	const updated = lastLedgerUpdate();

	return (
		<footer className="mt-24 border-t border-line pb-24 md:pb-0">
			<div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 xl:px-12">
				<div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
					<div>
						<Wordmark className="h-5 w-auto" />
						<p className="mt-3 font-serif-zh text-sm font-bold tracking-[0.12em]">
							{site.nameZh}{" "}
							<span className="font-latin font-normal italic tracking-normal text-bone-dim">
								· {site.nameEn}
							</span>
						</p>
					</div>
					{cols.map((col) => (
						<nav key={col.title} aria-label={col.title}>
							<p className="mb-3 font-mono text-[11px] tracking-[0.14em] text-dossier">
								{col.title}
							</p>
							<ul className="space-y-2 text-sm text-bone-dim">
								{col.links.map((l) => (
									<li key={l.href}>
										{l.external ? (
											<a
												href={l.href}
												target="_blank"
												rel="noopener noreferrer"
												className="hover:text-bone"
											>
												{l.label} <Arrow>↗</Arrow>
											</a>
										) : (
											<Link href={l.href} className="hover:text-bone">
												{l.label}
											</Link>
										)}
									</li>
								))}
							</ul>
						</nav>
					))}
				</div>
				<div className="mt-12 space-y-2 border-t border-line pt-6 text-[13px] leading-relaxed text-bone-dim">
					<p>风险披露：{RISK_TEXT.short}</p>
					<p className="text-bone">{RISK_TEXT.impersonation}</p>
					<p className="font-mono">
						{updated
							? `台账最后更新：${formatDateTime(updated)} (UTC+8) · `
							: ""}
						© 2026 {site.name}
					</p>
				</div>
			</div>
		</footer>
	);
}
