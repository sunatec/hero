import Image from "next/image";

/**
 * Agent ID photo pinned to the file with a paper clip (WEBSITE_PLAN §11.6).
 * Without `src` it renders an explicit placeholder: the transparent hi-res artwork is still pending
 * (open-items B11) and the reference screenshots in images/ must not ship.
 */
export function AgentPhoto({
	src,
	alt = "主理人档案照",
	size = 168,
}: {
	src?: string;
	alt?: string;
	size?: number;
}) {
	return (
		<div
			className="relative inline-block rotate-[-1.5deg]"
			style={{ width: size }}
		>
			<span
				aria-hidden="true"
				className="absolute -top-3 right-7 z-10 h-[46px] w-[15px] rounded-[9px] border-2 border-[#8c8c86] after:absolute after:inset-x-[3px] after:top-2 after:-bottom-0.5 after:rounded-b-md after:border-2 after:border-t-0 after:border-[#8c8c86]"
			/>
			<div className="border border-line bg-ink-1 p-2 shadow-[0_24px_48px_-24px_rgb(0_0_0/0.7)]">
				{src ? (
					<Image
						src={src}
						alt={alt}
						width={size - 18}
						height={size - 18}
						className="block aspect-square object-contain saturate-[0.85]"
					/>
				) : (
					<div
						role="img"
						aria-label="档案照待补充"
						className="flex aspect-square items-center justify-center border border-dashed border-line font-mono text-[11px] tracking-[0.1em] text-bone-dim"
					>
						档案照待补
					</div>
				)}
				<p className="mt-2 font-mono text-[10px] tracking-[0.14em] text-dossier">
					AGENT · ID PHOTO
				</p>
			</div>
		</div>
	);
}
