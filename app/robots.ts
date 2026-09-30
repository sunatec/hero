import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/** Previews and local builds are never indexed; production allows everything but the noindex routes. */
export default function robots(): MetadataRoute.Robots {
	const production =
		process.env.VERCEL_ENV === "production" || process.env.INDEXABLE === "1";
	return {
		rules: production
			? {
					userAgent: "*",
					allow: "/",
					disallow: ["/join/submitted", "/api/", "/design-system"],
				}
			: { userAgent: "*", disallow: "/" },
		sitemap: `${siteUrl}/sitemap.xml`,
	};
}
