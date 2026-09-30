import { ImageResponse } from "next/og";
import { OG_COLORS as C, OG_SIZE, ogFonts } from "@/lib/og";

const BRAND = "0xInChain 链上情报局";
const FOOT = "0xinchain · public ledger";

/**
 * Shared "file folder" card for pages without a bespoke OG image (home, modules, Research).
 * Satori rules: every element is a flex div; no Fragments; no double borders.
 */
export async function ogCard({
	kicker,
	title,
	subtitle,
	tag,
}: {
	kicker: string;
	title: string;
	subtitle?: string;
	tag?: string;
}) {
	const fonts = await ogFonts(
		`${kicker}${title}${subtitle ?? ""}${tag ?? ""}${BRAND}${FOOT}§0123456789`,
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
				borderTop: `10px solid ${C.stamp}`,
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<div
					style={{
						display: "flex",
						color: C.dossier,
						fontSize: 26,
						letterSpacing: 2,
					}}
				>
					{kicker}
				</div>
				{tag ? (
					<div
						style={{
							display: "flex",
							color: C.stamp,
							border: `3px solid ${C.stamp}`,
							borderRadius: 6,
							padding: "8px 16px",
							fontFamily: "Noto Serif SC",
							fontSize: 24,
						}}
					>
						{tag}
					</div>
				) : null}
			</div>
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div
					style={{
						display: "flex",
						fontFamily: "Noto Serif SC",
						fontWeight: 900,
						fontSize: title.length > 12 ? 68 : 92,
						lineHeight: 1.15,
					}}
				>
					{title}
				</div>
				<div
					style={{
						display: "flex",
						height: 2,
						width: 560,
						background: C.bone,
						opacity: 0.8,
						marginTop: 28,
					}}
				/>
				{subtitle ? (
					<div
						style={{
							display: "flex",
							fontFamily: "Noto Serif SC",
							color: C.boneDim,
							fontSize: 32,
							marginTop: 24,
							lineHeight: 1.5,
						}}
					>
						{subtitle}
					</div>
				) : null}
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "flex-end",
				}}
			>
				<div style={{ display: "flex", color: C.boneDim, fontSize: 22 }}>
					{FOOT}
				</div>
				<div
					style={{ display: "flex", fontFamily: "Noto Serif SC", fontSize: 28 }}
				>
					{BRAND}
				</div>
			</div>
		</div>,
		{ ...OG_SIZE, fonts },
	);
}
