/** /join options and labels — zod-free so the form can import them without the schema. */
export const YEARS = ["<1", "1-3", "3-5", "5+"] as const;
export const yearsLabel: Record<(typeof YEARS)[number], string> = {
	"<1": "1 年以内",
	"1-3": "1–3 年",
	"3-5": "3–5 年",
	"5+": "5 年以上",
};

export const MARKETS = ["spot", "perp", "dex", "meme", "rwa"] as const;
export const marketLabel: Record<(typeof MARKETS)[number], string> = {
	spot: "现货",
	perp: "永续合约",
	dex: "链上 DEX",
	meme: "Meme",
	rwa: "美股代币化资产",
};

export const CAPITAL = [
	"na",
	"<10k",
	"10k-100k",
	"100k-500k",
	"500k+",
] as const;
export const capitalLabel: Record<(typeof CAPITAL)[number], string> = {
	na: "不便透露",
	"<10k": "1 万 U 以下",
	"10k-100k": "1–10 万 U",
	"100k-500k": "10–50 万 U",
	"500k+": "50 万 U 以上",
};

export const SOURCES = ["x", "telegram", "friend", "search", "other"] as const;
export const sourceLabel: Record<(typeof SOURCES)[number], string> = {
	x: "X",
	telegram: "Telegram",
	friend: "朋友推荐",
	search: "搜索",
	other: "其他",
};

export const MESSAGE_MAX = 300;
