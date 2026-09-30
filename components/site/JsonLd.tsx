/** Structured data (WEBSITE_PLAN §15). `<` is escaped so content can never close the script tag. */
export function JsonLd({
	data,
}: {
	data: Record<string, unknown> | Record<string, unknown>[];
}) {
	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be raw JSON; `<` is escaped
			dangerouslySetInnerHTML={{
				__html: JSON.stringify(data).replace(/</g, "\\u003c"),
			}}
		/>
	);
}
