import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "link" | "bracket";

const BASE =
	"inline-flex items-center gap-2.5 tracking-[0.06em] transition-colors";
const VARIANTS: Record<Variant, string> = {
	// bone on stamp-fill = 5.20:1 (AA); hover 4.51:1
	primary:
		"rounded-file bg-stamp-fill font-medium text-bone hover:bg-stamp-fill-hover",
	link: "bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1px] bg-left-bottom bg-no-repeat py-[15px] text-base text-bone hover:animate-[underline-draw_200ms_var(--ease-out-dossier)] hover:text-stamp",
	bracket:
		'font-data text-[11px] text-bone before:mr-0.5 before:text-dossier before:content-["[_"] after:ml-0.5 after:text-dossier after:content-["_]"]',
};
/** Size classes live apart from colours so two paddings never compete in one class list. */
const SIZE = {
	md: "px-6 py-[15px] text-base",
	sm: "px-4 py-2.5 text-sm max-md:min-h-11",
	/** mobile sticky bar: 44px+ touch target */
	bar: "px-[18px] py-[13px] text-base",
} as const;
type Size = keyof typeof SIZE;

type Common = {
	variant?: Variant;
	size?: Size;
	className?: string;
	children: ReactNode;
};

export function ButtonLink({
	href,
	variant = "primary",
	size = "md",
	external = false,
	className = "",
	children,
}: Common & { href: string; external?: boolean }) {
	const cls = [
		BASE,
		VARIANTS[variant],
		variant === "primary" && SIZE[size],
		className,
	]
		.filter(Boolean)
		.join(" ");
	if (external) {
		return (
			<a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
				{children}
			</a>
		);
	}
	return (
		<Link href={href} className={cls}>
			{children}
		</Link>
	);
}

export function Button({
	variant = "primary",
	size = "md",
	className = "",
	children,
	...rest
}: Common &
	Omit<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		"className" | "children"
	>) {
	const cls = [
		BASE,
		VARIANTS[variant],
		variant === "primary" && SIZE[size],
		className,
	]
		.filter(Boolean)
		.join(" ");
	return (
		<button type="button" className={cls} {...rest}>
			{children}
		</button>
	);
}

export function Arrow({ children = "→" }: { children?: string }) {
	return (
		<span aria-hidden="true" className="font-mono">
			{children}
		</span>
	);
}
