import type { Metadata } from "next";
import { Placeholder } from "@/components/site/Placeholder";
import { site } from "@/site.config";

export const metadata: Metadata = { title: "官方渠道验证" };

export default function VerifyPage() {
	return (
		<Placeholder route="/verify" title="只认这些账号" milestone="M9">
			{site.officialChannels.map((c) => (
				<p key={c.handle}>
					{c.type} · {c.handle} · {c.role}
				</p>
			))}
		</Placeholder>
	);
}
