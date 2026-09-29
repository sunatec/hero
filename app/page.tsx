import { allSignals } from "content-collections";
import { Placeholder } from "@/components/site/Placeholder";

export default function HomePage() {
	return (
		<Placeholder route="/" title="链上情报局" milestone="M5">
			<p>内容层已连接：台账共 {allSignals.length} 份档案。</p>
		</Placeholder>
	);
}
