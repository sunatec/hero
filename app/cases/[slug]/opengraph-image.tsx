import { allCases } from "content-collections";
import { ImageResponse } from "next/og";
import { formatDate } from "@/lib/format";
import { directionLabel, methodLabel } from "@/lib/i18n/labels";
import { OG_COLORS as C, OG_SIZE, ogFonts } from "@/lib/og";

export const alt = "0xInChain 链上情报局 · 精选案例";
export const size = OG_SIZE;
export const contentType = "image/png";

const BADGE = "精选 · 非完整记录";
const METRIC = "原帖收益 · 最大涨幅口径 · 未核验";

export function generateStaticParams() {
	return allCases.map((c) => ({ slug: c.slug }));
}

/** Case card for X previews — always labelled curated, never presented like a ledger result. */
export default async function Image({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const c = allCases.find((x) => x.slug === slug);
	if (!c) return new Response("not found", { status: 404 });
	const heading = `${c.assets.join(" ")} ${directionLabel[c.direction]}`;
	const kicker = `${methodLabel[c.method] ?? c.method} · ${formatDate(c.date)}`;
	const quote = `「${c.titleOriginal}」`;
	const brand = "0xInChain 链上情报局 · 精选案例";
	const fonts = await ogFonts(
		`${heading}${kicker}${quote}${BADGE}${METRIC}${brand}${c.claim?.value ?? ""}`,
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
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
					}}
				>
					<div style={{ display: "flex", color: C.dossier, fontSize: 26 }}>
						{kicker}
					</div>
					<div
						style={{
							display: "flex",
							fontFamily: "Noto Serif SC",
							fontWeight: 900,
							fontSize: 80,
							marginTop: 18,
						}}
					>
						{heading}
					</div>
					<div
						style={{
							display: "flex",
							fontFamily: "Noto Serif SC",
							color: C.boneDim,
							fontSize: 30,
							marginTop: 14,
						}}
					>
						{quote}
					</div>
				</div>
				<div
					style={{
						display: "flex",
						color: C.stamp,
						border: `3px solid ${C.stamp}`,
						borderRadius: 6,
						padding: "10px 18px",
						fontFamily: "Noto Serif SC",
						fontSize: 26,
					}}
				>
					{BADGE}
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
					{c.claim?.value ? (
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
									fontSize: 24,
								}}
							>
								{METRIC}
							</div>
							<div
								style={{
									display: "flex",
									color: C.bone,
									fontSize: 84,
									fontWeight: 500,
								}}
							>
								{c.claim.value}
							</div>
						</div>
					) : null}
				</div>
				<div
					style={{ display: "flex", fontFamily: "Noto Serif SC", fontSize: 26 }}
				>
					{brand}
				</div>
			</div>
		</div>,
		{ ...size, fonts },
	);
}
