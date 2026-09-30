import Link from "next/link";
import {
	CaseFile,
	CaseFileFooter,
	CaseFileHeader,
} from "@/components/dossier/CaseFile";
import { Fields, Pct } from "@/components/dossier/Fields";
import { Redaction } from "@/components/dossier/Redaction";
import { Stamp } from "@/components/dossier/Stamp";
import { Arrow, ButtonLink } from "@/components/site/Button";
import {
	coveredChains,
	latestClosed,
	latestOpen,
	ledgerStart,
	moduleBySlug,
	type SignalDoc,
	stats,
} from "@/lib/content";
import {
	formatDate,
	formatDateTime,
	formatPrice,
	holdingDays,
} from "@/lib/format";
import { directionLabel } from "@/lib/i18n/labels";
import { isClosed } from "@/lib/ledger/stats";
import { label, wrap } from "@/lib/ui";

const EVIDENCE: Record<string, string> = {
	tg: "TG 截图",
	tx: "链上 tx",
	address: "地址",
	chart: "行情",
	x: "X 复盘",
};

function kicker(s: SignalDoc) {
	const m = moduleBySlug(s.module);
	return m ? `${m.code} · ${m.nameZh}` : s.module;
}

function LatestFile() {
	if (latestClosed && isClosed(latestClosed)) {
		const s = latestClosed;
		return (
			<>
				<CaseFile
					tab={`最新结案 · ${s.id}`}
					stamp={<Stamp status={s.status} date={formatDate(s.closedAt)} />}
				>
					<CaseFileHeader
						kicker={kicker(s)}
						title={`${s.asset} ${directionLabel[s.direction]}`}
					/>
					<Fields
						items={[
							{ label: "立案", value: formatDateTime(s.openedAt) },
							{ label: "入场", value: formatPrice(s.entryPrice) },
							{ label: "结案", value: formatPrice(s.exitPrice) },
							{ label: "最大涨幅", value: <Pct value={s.mfePct} /> },
							{ label: "结案收益", value: <Pct value={s.closedReturnPct} /> },
							{
								label: "持有",
								value: `${holdingDays(s.openedAt, s.closedAt)} 天`,
							},
						]}
					/>
					<CaseFileFooter>
						<span>
							证据 ·{" "}
							{[...new Set(s.evidence.map((e) => EVIDENCE[e.type]))].join(
								" · ",
							)}
						</span>
						<Link
							href={`/ledger/${s.id}`}
							className="text-bone tap underline underline-offset-4 hover:text-stamp"
						>
							档案 <Arrow />
						</Link>
					</CaseFileFooter>
				</CaseFile>
				<p className="mt-5 ml-1.5 font-mono text-xs text-dossier">
					↳ 如实显示最新一份已结案档案，不做挑选
				</p>
			</>
		);
	}
	if (latestOpen) {
		const s = latestOpen;
		return (
			<>
				<CaseFile
					tab={`立案 · ${s.id}`}
					dashed
					stamp={<Stamp status="open" date={formatDate(s.openedAt)} />}
				>
					<CaseFileHeader
						kicker={kicker(s)}
						title={
							<>
								{directionLabel[s.direction]} · <Redaction width={6} />
							</>
						}
					/>
					<Fields
						items={[
							{ label: "立案", value: formatDateTime(s.openedAt) },
							{ label: "入场", value: <Redaction width={7} /> },
						]}
					/>
				</CaseFile>
				<p className="mt-5 ml-1.5 font-mono text-xs text-dossier">
					↳ 台账已启动，第一份档案结案后显示于此
				</p>
			</>
		);
	}
	return null;
}

export function Hero() {
	return (
		<section
			aria-labelledby="hero-title"
			className={`${wrap} grid grid-cols-1 items-start gap-y-14 pt-12 pb-18 md:pt-20 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-x-12 lg:pb-26 xl:grid-cols-[112px_minmax(0,1fr)_380px]`}
		>
			<aside
				aria-hidden="true"
				className="hidden flex-col gap-[22px] pt-2.5 xl:flex"
			>
				{[
					["FILE №", "IC-2026"],
					["§ 01", "档案封面"],
					["UTC+8", formatDate(new Date().toISOString())],
				].map(([k, v]) => (
					<p
						key={k}
						className="m-0 font-mono text-xs leading-relaxed tracking-[0.06em] text-dossier"
					>
						{k}
						<span className="block text-bone-dim">{v}</span>
					</p>
				))}
			</aside>

			<div>
				<p className={`${label} mb-5 leading-relaxed md:mb-7`}>
					FILE № IC-2026 — 链上情报局 · On-chain Intelligence Bureau
				</p>
				<h1
					id="hero-title"
					className="-ml-[0.04em] font-serif-zh text-[clamp(52px,15vw,64px)] leading-none font-black tracking-[0.04em] whitespace-nowrap md:text-[clamp(56px,8.2vw,110px)]"
				>
					链上情报局
				</h1>
				<div
					aria-hidden="true"
					className="mt-6 mb-4 h-px max-w-[640px] bg-bone/80 md:mt-8 md:mb-5"
				/>
				<p className="mb-6 font-latin text-[21px] text-bone-dim italic md:mb-8 md:text-[26px]">
					On-chain Intelligence Bureau
				</p>
				<p className="mb-5 max-w-[24em] text-[clamp(18px,1.6vw,22px)] leading-[1.7]">
					把链上资金的每一次异动，整理成
					<em className="text-stamp not-italic">可复盘</em>的情报档案。
				</p>
				<p className="mb-8 font-mono text-[13px] leading-relaxed text-bone-dim md:mb-10">
					台账始于{" "}
					<b className="font-medium text-bone">
						{ledgerStart ? formatDate(ledgerStart) : "上线日"}
					</b>{" "}
					· 已登记 <b className="font-medium text-bone">{stats.registered}</b>{" "}
					份
					{coveredChains.length > 0
						? ` · 覆盖 ${coveredChains.join(" / ")}`
						: ""}
				</p>
				<div className="flex flex-wrap items-center gap-x-7 gap-y-3">
					<ButtonLink
						href="/join"
						className="max-md:w-full max-md:justify-center"
					>
						申请加入 <Arrow />
					</ButtonLink>
					<ButtonLink href="/ledger" variant="link">
						查看信号台账 <Arrow />
					</ButtonLink>
				</div>
			</div>

			<div className="relative max-w-[460px] lg:mt-16 lg:origin-[40%_0] lg:-rotate-2 lg:shadow-[0_30px_60px_-30px_rgb(0_0_0/0.7)]">
				<span
					aria-hidden="true"
					className="absolute top-1 right-[148px] z-10 h-[50px] w-4 rounded-[9px] border-2 border-[#8c8c86] after:absolute after:inset-x-[3px] after:top-2 after:-bottom-0.5 after:rounded-b-md after:border-2 after:border-t-0 after:border-[#8c8c86]"
				/>
				<LatestFile />
			</div>
		</section>
	);
}
