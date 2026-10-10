import {
	buildPremium,
	type PremiumDay,
	parseBinanceDaily,
	parseCoinbaseCandles,
} from "./premium";

/** Public endpoints, no API key. The 3s timeout keeps offline builds fast; ISR retries hourly. */
async function getJson(url: string): Promise<unknown> {
	const res = await fetch(url, {
		signal: AbortSignal.timeout(3000),
		next: { revalidate: 3600 },
	});
	if (!res.ok) throw new Error(`${new URL(url).host} ${res.status}`);
	return res.json();
}

/** Returns null on any failure so the page can fall back to a plain notice. */
export async function fetchPublicPremium(): Promise<PremiumDay[] | null> {
	try {
		const [cb, bn] = await Promise.all([
			getJson(
				"https://api.exchange.coinbase.com/products/BTC-USD/candles?granularity=86400",
			),
			getJson(
				"https://data-api.binance.vision/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=45",
			),
		]);
		const days = buildPremium(parseCoinbaseCandles(cb), parseBinanceDaily(bn));
		return days.length >= 7 ? days : null;
	} catch {
		return null;
	}
}
