/**
 * Single source of truth for pricing, batch status and official accounts.
 * Never hard-code handles or prices elsewhere — /verify, footer and /join read from here.
 * Values marked TBD are tracked in docs/open-items.md.
 */
export const TBD = "TBD" as const;

export const site = {
	name: "0xInChain",
	nameZh: "链上情报局",
	nameEn: "On-chain Intelligence Bureau",
	url: "https://example.invalid", // TBD: domain (open-items B12)
	ledgerStartDate: TBD as string, // open-items B10 — YYYY-MM-DD
	pricing: {
		currency: "BNB",
		plans: [
			{ period: "quarter", label: "季度", from: TBD as string | number },
			{ period: "half", label: "半年", from: TBD as string | number },
			{ period: "year", label: "年付", from: TBD as string | number },
		],
		note: "以 BNB 计价，按社群阶段动态调整，以管理员付款前最终确认为准",
	},
	batch: {
		name: "第二批",
		seats: 20,
		reviewPerDay: 1,
		status: "open" as "open" | "full",
	},
	officialChannels: [
		{
			type: "telegram",
			handle: "@gongxifacai_998",
			role: "入群管理员",
			numericId: TBD as string,
		},
		{
			type: "x",
			handle: "@0xInChain",
			role: "官方 X",
			numericId: TBD as string,
		},
	],
	paymentAddresses: [] as { chain: string; address: string }[],
	social: {
		x: "https://x.com/0xInChain",
		telegram: TBD as string,
	},
} as const;

export type SiteConfig = typeof site;
