import { site } from "@/site.config";

export type NavItem = {
	href: string;
	label: string;
	external?: boolean;
	match?: string[];
};

/** Order and labels: docs/ia/README.md §2. */
export const primaryNav: NavItem[] = [
	{
		href: "/ledger",
		label: "社群战绩",
		match: ["/ledger", "/cases", "/methodology"],
	},
	{ href: "/tools", label: "链上工具箱", match: ["/tools"] },
	{ href: "/community", label: "社群介绍", match: ["/community"] },
	{ href: site.social.x, label: "X", external: true },
];

export const secondaryNav: NavItem[] = [
	{ href: "/about", label: "主理人档案" },
	{ href: "/research", label: "Research" },
	{ href: "/verify", label: "官方渠道验证" },
];

export function isActive(item: NavItem, pathname: string): boolean {
	return (item.match ?? []).some(
		(p) => pathname === p || pathname.startsWith(`${p}/`),
	);
}

/** Routes where the apply CTA would point at the current page or be out of place. */
export const NO_APPLY_CTA = ["/join", "/legal"];
export function showApplyCta(pathname: string): boolean {
	return !NO_APPLY_CTA.some(
		(p) => pathname === p || pathname.startsWith(`${p}/`),
	);
}

/** English front door (docs/copy/home.en.md): the community is Chinese-only, so no apply CTA. */
export const enNav: NavItem[] = [
	{ href: "/ledger", label: "Ledger (中文)", match: ["/ledger"] },
	{ href: "/tools", label: "Toolbox (中文)", match: ["/tools"] },
	{ href: "/en/about", label: "About", match: ["/en/about"] },
	{ href: site.social.x, label: "X", external: true },
];

export const isEn = (pathname: string) =>
	pathname === "/en" || pathname.startsWith("/en/");
