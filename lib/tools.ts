import type { ModuleCategory, ModuleStatus } from "@/lib/i18n/labels";

/** Client-safe module shape for panes (no compiled MDX). */
export type ToolRow = {
	slug: string;
	code: string;
	nameZh: string;
	nameEn: string;
	tagline: string;
	category: ModuleCategory;
	status: ModuleStatus;
	sources: string[];
	chains: string[];
	frequency?: string;
	delivery?: string;
	samples: { lines: string[] }[];
	url?: string;
	/** Ledger files attributed to this module (void excluded). */
	ledgerCount: number;
};

export type ToolFilter = { category?: string; status?: string };

/** Filter order on /tools (docs/ia/wireframes.md). */
export const TOOL_CATEGORIES: ModuleCategory[] = [
	"derivatives",
	"institutional",
	"smart-money",
	"onchain-behavior",
	"custom",
];

export function filterTools(rows: ToolRow[], f: ToolFilter): ToolRow[] {
	return rows.filter(
		(t) =>
			(!f.category || t.category === f.category) &&
			(!f.status || t.status === f.status),
	);
}

export type ToolAction =
	| { kind: "detail"; href: string; label: string }
	| { kind: "open"; href: string; label: string; external: true };

/**
 * Pane footer actions. A module gains 「打开工具」 the moment its `url` is set —
 * no layout change needed (WEBSITE_PLAN §10.2).
 */
export function toolActions(t: Pick<ToolRow, "slug" | "url">): ToolAction[] {
	const actions: ToolAction[] = [
		{ kind: "detail", href: `/tools/${t.slug}`, label: "详情" },
	];
	if (t.url)
		actions.push({
			kind: "open",
			href: t.url,
			label: "打开工具",
			external: true,
		});
	return actions;
}

export type Access = {
	text: string;
	cta?: { href: string; label: string; external?: boolean };
};

/** 「如何获得」 pane copy — docs/copy/tools-research.md. */
export function accessFor(t: Pick<ToolRow, "status" | "url">): Access {
	const open = t.url
		? { href: t.url, label: "打开工具", external: true }
		: undefined;
	switch (t.status) {
		case "public":
			return { text: "公开可用。", ...(open ? { cta: open } : {}) };
		case "beta":
			return {
				text: "测试中，对成员开放，推送格式和规则可能调整。",
				cta: open ?? { href: "/join", label: "申请加入" },
			};
		case "planned":
			return { text: "规划中，上线时间待定。" };
		default:
			return {
				text: "成员专享。加入后在成员频道实时接收。",
				cta: open ?? { href: "/join", label: "申请加入" },
			};
	}
}
