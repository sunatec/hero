import Link from "next/link";
import {
	CaseFile,
	CaseFileFooter,
	CaseFileHeader,
} from "@/components/dossier/CaseFile";
import { Fields } from "@/components/dossier/Fields";
import { Arrow } from "@/components/site/Button";
import type { CaseRow } from "@/lib/cases";
import { formatDate } from "@/lib/format";
import {
	caseResultLabel,
	directionLabel,
	methodLabel,
} from "@/lib/i18n/labels";

const inlineLink = "text-bone underline underline-offset-4 hover:text-stamp";

/** Curated case card. Always tagged 精选 and, until checked, 未核验 (WEBSITE_PLAN §8.1). */
export function CaseCard({ c }: { c: CaseRow }) {
	return (
		<CaseFile tab={`精选 · ${formatDate(c.date)}`}>
			<CaseFileHeader
				kicker={methodLabel[c.method] ?? c.method}
				title={`${c.assets.join(" ")} ${directionLabel[c.direction]}`}
			/>
			<p className="mb-4 text-sm text-bone-dim">「{c.titleOriginal}」</p>
			<Fields
				items={[
					{
						label: "原帖写法",
						value: c.claim ? `${c.claim}（最大涨幅口径）` : "—",
					},
					{ label: "结果", value: caseResultLabel[c.result] },
					{
						label: "核验",
						value: c.verified ? (
							"已核验"
						) : (
							<span className="text-dossier">未核验</span>
						),
					},
				]}
			/>
			<CaseFileFooter>
				<a
					href={c.xUrl}
					target="_blank"
					rel="noopener noreferrer"
					className={inlineLink}
				>
					X 原帖 <Arrow>↗</Arrow>
				</a>
				<Link href={`/cases/${c.slug}`} className={inlineLink}>
					案例 <Arrow />
				</Link>
			</CaseFileFooter>
		</CaseFile>
	);
}
