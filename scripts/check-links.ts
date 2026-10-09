/**
 * Link check (WEBSITE_PLAN §22): every page in the sitemap, every internal link resolves (200),
 * every in-page anchor exists, and external links only point at official accounts.
 *
 *   pnpm build && pnpm start &
 *   pnpm links:check [baseUrl]      # default http://localhost:3000
 */
import { site } from "../site.config";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");

/** External hosts allowed in hrefs, and the path prefix each must start with. */
const official = site.officialChannels.map((c) =>
	c.handle.replace(/^@/, "").toLowerCase(),
);
const ALLOWED: ((u: URL) => boolean)[] = [
	(u) =>
		(u.hostname === "x.com" || u.hostname === "twitter.com") &&
		official.includes(u.pathname.split("/")[1]?.toLowerCase() ?? ""),
	(u) =>
		u.hostname === "t.me" &&
		official.includes(u.pathname.split("/")[1]?.toLowerCase() ?? ""),
];
/** Script / style origins that are not navigation (checked separately from hrefs). */
const ASSET_HOSTS = new Set(["challenges.cloudflare.com"]);

type Problem = { page: string; link: string; reason: string };
const problems: Problem[] = [];
const statusCache = new Map<string, number>();

async function status(path: string) {
	const hit = statusCache.get(path);
	if (hit !== undefined) return hit;
	const res = await fetch(`${base}${path}`, { redirect: "manual" });
	statusCache.set(path, res.status);
	return res.status;
}

const xml = await (await fetch(`${base}/sitemap.xml`)).text();
const pages = [
	...new Set([
		...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
			(m) => new URL(m[1] as string).pathname,
		),
		"/join/submitted",
	]),
];

let links = 0;
for (const page of pages) {
	const res = await fetch(`${base}${page}`);
	if (res.status !== 200) {
		problems.push({ page, link: page, reason: `page ${res.status}` });
		continue;
	}
	const html = await res.text();
	const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
	const hrefs = [...html.matchAll(/<a\s[^>]*href="([^"]+)"/g)].map(
		(m) => m[1] as string,
	);
	const srcs = [
		...html.matchAll(
			/<(?:script|img|link)\s[^>]*(?:src|href)="(https?:[^"]+)"/g,
		),
	].map((m) => m[1] as string);
	for (const raw of hrefs) {
		links++;
		const href = raw.replace(/&amp;/g, "&");
		if (href.startsWith("#")) {
			if (href.length > 1 && !ids.has(decodeURIComponent(href.slice(1))))
				problems.push({ page, link: href, reason: "missing anchor" });
			continue;
		}
		if (href.startsWith("mailto:") || href.startsWith("tel:")) {
			problems.push({ page, link: href, reason: "unexpected scheme" });
			continue;
		}
		const url = new URL(href, `${base}${page}`);
		if (url.origin === new URL(base).origin) {
			const code = await status(url.pathname + url.search);
			if (code !== 200)
				problems.push({ page, link: href, reason: `HTTP ${code}` });
			continue;
		}
		if (!ALLOWED.some((ok) => ok(url)))
			problems.push({
				page,
				link: href,
				reason: "external link to a non-official account",
			});
	}
	for (const src of srcs) {
		const url = new URL(src);
		if (url.origin === new URL(base).origin) continue;
		// canonical / og / alternate URLs point at the configured site origin, not this server.
		const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;
		if (!ASSET_HOSTS.has(url.hostname) && !src.startsWith(siteOrigin))
			problems.push({
				page,
				link: src,
				reason: "unexpected third-party asset",
			});
	}
}

console.log(
	`links:check — ${pages.length} pages, ${links} links, ${statusCache.size} internal targets`,
);
for (const p of problems) console.log(`✗ ${p.page} → ${p.link} (${p.reason})`);
process.exit(problems.length ? 1 : 0);
