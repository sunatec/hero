import type { Metadata } from "next";
import { Placeholder } from "@/components/site/Placeholder";

export const metadata: Metadata = {
	title: "申请已提交",
	robots: { index: false },
};

export default function SubmittedPage() {
	return (
		<Placeholder route="/join/submitted" title="申请已提交" milestone="M9" />
	);
}
