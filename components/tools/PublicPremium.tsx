import { Sparkline } from "@/components/charts/Sparkline";
import { premiumSummary } from "@/lib/premium";
import { fetchPublicPremium } from "@/lib/premium-data";

const pct = (n: number) =>
	`${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toFixed(2)}%`;
const tone = (n: number) =>
	n > 0 ? "text-gain" : n < 0 ? "text-loss" : "text-bone-dim";

/** S1 public edition: daily, ≥ 24h delayed, BTC only. Server component, hourly ISR. */
export async function PublicPremium() {
	const days = await fetchPublicPremium();
	const s = days ? premiumSummary(days) : null;
	if (!days || !s) {
		return (
			<p className="m-0 text-bone-dim">
				公开日线暂时无法获取，稍后会自动恢复。成员频道的每小时数据不受影响。
			</p>
		);
	}
	const recent = days.slice(-7).reverse();
	return (
		<>
			<dl className="m-0 grid grid-cols-3 gap-px border border-line bg-line">
				{[
					["最近一日", s.latest.premiumPct],
					["7 日均值", s.avg7],
					["30 日均值", s.avg30],
				].map(([k, v]) => (
					<div key={k} className="bg-ink-1 px-3 py-4 md:px-5">
						<dt className="font-serif-zh text-sm text-bone-dim">{k}</dt>
						<dd
							className={`m-0 mt-2 font-data text-xl md:text-2xl ${tone(v as number)}`}
						>
							{pct(v as number)}
						</dd>
					</div>
				))}
			</dl>
			<div className="mt-5 flex items-center gap-4">
				<Sparkline
					values={days.map((d) => d.premiumPct)}
					width={240}
					height={40}
					label={`BTC 溢价率最近 ${days.length} 日走势，最近一日 ${pct(s.latest.premiumPct)}`}
				/>
				<p className="m-0 font-data text-[11px] text-bone-dim">
					近 {s.total} 日中 {s.positiveDays} 日为正溢价
				</p>
			</div>
			<table className="mt-5 w-full border-collapse font-data text-[13px]">
				<caption className="sr-only">最近 7 日 BTC 溢价率</caption>
				<thead>
					<tr className="text-left text-dossier">
						<th scope="col" className="pb-2 font-normal">
							日期（UTC）
						</th>
						<th scope="col" className="pb-2 text-right font-normal">
							溢价率
						</th>
					</tr>
				</thead>
				<tbody>
					{recent.map((d) => (
						<tr key={d.date} className="border-t border-line">
							<td className="py-2">{d.date}</td>
							<td className={`py-2 text-right ${tone(d.premiumPct)}`}>
								{pct(d.premiumPct)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<p className="mt-4 mb-0 font-data text-[11px] leading-relaxed text-bone-dim">
				日线收盘 · 延迟至少 24 小时 · 仅 BTC · Coinbase BTC-USD 对 Binance
				BTCUSDT，两者计价单位不同（USD 与
				USDT），所以数值只看趋势。每小时更新一次页面。
			</p>
		</>
	);
}
