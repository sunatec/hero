import { allSignals } from "content-collections";
import { formatDateTime } from "@/lib/format";
import { FooterContent } from "./FooterContent";

function lastLedgerUpdate(): string | null {
	const times = allSignals.flatMap((s) => [
		s.registeredAt,
		...(s.status !== "open" && s.closedAt ? [s.closedAt] : []),
		...s.changelog.map((c) => c.at),
	]);
	if (times.length === 0) return null;
	return times.reduce((a, b) => (Date.parse(a) > Date.parse(b) ? a : b));
}

/** Server shell: computes build-time data, the client part picks the language from the path. */
export function Footer() {
	const updated = lastLedgerUpdate();
	return <FooterContent updated={updated ? formatDateTime(updated) : null} />;
}
