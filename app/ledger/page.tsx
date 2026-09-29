import { allSignals } from "content-collections";
import type { Metadata } from "next";
import Link from "next/link";
import { Placeholder } from "@/components/site/Placeholder";

export const metadata: Metadata = { title: "信号台账" };

export default function LedgerPage() {
	const signals = [...allSignals].sort((a, b) => b.id.localeCompare(a.id));
	return (
		<Placeholder route="/ledger" title="信号台账" milestone="M6a">
			{signals.map((s) => (
				<p key={s.id}>
					<Link
						className="text-dossier hover:text-stamp"
						href={`/ledger/${s.id}`}
					>
						{s.id}
					</Link>{" "}
					· {s.status} · {s.module} · {s.status === "open" ? "▇▇▇▇" : s.asset}
				</p>
			))}
		</Placeholder>
	);
}
