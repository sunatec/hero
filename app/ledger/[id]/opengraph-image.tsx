import { ImageResponse } from "next/og";
import { moduleBySlug, signals } from "@/lib/content";
import { formatDate, formatPct } from "@/lib/format";
import { directionLabel, statusLabel } from "@/lib/i18n/labels";
import { isClosed } from "@/lib/ledger/stats";
import { OG_COLORS as C, OG_SIZE, ogFonts } from "@/lib/og";

export const alt = "0xInChain 链上情报局 · 台账档案";
export const size = OG_SIZE;
export const contentType = "image/png";

const OPEN_NOTE = "进行中 · 结案后公开全部字段";

export function generateStaticParams() {
	return signals.map((s) => ({ id: s.id }));
}

/** Dossier card for X previews. Open files show a redaction bar, never the asset. */
export default async function Image({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const s = signals.find((x) => x.id === id);
	if (!s) return new Response("not found", { status: 404 });
	const m = moduleBySlug(s.module);
	const closed = isClosed(s);
	const heading =
		s.status === "open"
			? directionLabel[s.direction]
			: `${s.asset ?? "作废档案"} ${directionLabel[s.direction]}`;
	const kicker = m ? `${m.code} · ${m.nameZh}` : s.module;
	const stamp = statusLabel[s.status];
	const result = closed ? formatPct(s.closedReturnPct) : "";
	const tone = closed ? (s.closedReturnPct >= 0 ? C.gain : C.loss) : C.boneDim;
	const date = closed ? formatDate(s.closedAt) : formatDate(s.openedAt);
	const brand = "0xInChain 链上情报局 · 信号台账";
	const ink = s.status === "void" ? C.boneDim : C.stamp;
	const fonts = await ogFonts(
		`${heading}${kicker}${stamp}${result}${date}${brand}${s.id}${OPEN_NOTE}结案收益立案作废`,
	);

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				background: C.ink0,
				color: C.bone,
				padding: "64px 72px",
				fontFamily: "IBM Plex Mono",
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "flex-start",
				}}
			>
				<div style={{ display: "flex", flexDirection: "column" }}>
					<div
						style={{
							display: "flex",
							color: C.dossier,
							fontSize: 26,
							letterSpacing: 3,
						}}
					>
						{`${closed ? "结案" : s.status === "open" ? "立案" : "作废"} · ${s.id}`}
					</div>
					<div
						style={{
							display: "flex",
							color: C.dossier,
							fontSize: 24,
							marginTop: 28,
						}}
					>
						{kicker}
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 24,
							fontFamily: "Noto Serif SC",
							fontWeight: 900,
							fontSize: 84,
							marginTop: 10,
						}}
					>
						{heading}
						{s.status === "open" ? (
							<div style={{ width: 260, height: 70, background: C.redact }} />
						) : null}
					</div>
				</div>
				{/* Satori has no `double` border: two nested solid borders draw the stamp's double rule. */}
				<div
					style={{
						display: "flex",
						padding: 4,
						border: `3px ${s.status === "open" ? "dashed" : "solid"} ${ink}`,
						borderRadius: 12,
						transform: "rotate(-6deg)",
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							color: ink,
							border: `2px ${s.status === "open" ? "dashed" : "solid"} ${ink}`,
							borderRadius: 8,
							padding: "12px 18px 10px 32px",
							fontFamily: "Noto Serif SC",
							fontWeight: 900,
							fontSize: 56,
							letterSpacing: 20,
						}}
					>
						{stamp}
						<div
							style={{
								display: "flex",
								fontFamily: "IBM Plex Mono",
								fontSize: 18,
								letterSpacing: 3,
							}}
						>
							{date}
						</div>
					</div>
				</div>
			</div>

			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "flex-end",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
					}}
				>
					{closed ? (
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "flex-start",
							}}
						>
							<div
								style={{
									display: "flex",
									fontFamily: "Noto Serif SC",
									color: C.boneDim,
									fontSize: 26,
								}}
							>
								结案收益
							</div>
							<div
								style={{
									display: "flex",
									color: tone,
									fontSize: 96,
									fontWeight: 500,
								}}
							>
								{result}
							</div>
						</div>
					) : (
						<div
							style={{
								display: "flex",
								fontFamily: "Noto Serif SC",
								color: C.boneDim,
								fontSize: 30,
							}}
						>
							进行中 · 结案后公开全部字段
						</div>
					)}
				</div>
				<div
					style={{
						display: "flex",
						fontFamily: "Noto Serif SC",
						fontSize: 26,
						color: C.bone,
					}}
				>
					{brand}
				</div>
			</div>
		</div>,
		{ ...size, fonts },
	);
}
