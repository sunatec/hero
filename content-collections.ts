import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";
import {
	AgentFrontmatter,
	CaseStudyFrontmatter,
	ModuleFrontmatter,
	ResearchFrontmatter,
} from "./lib/schema/content";
import { parseSignalFrontmatter } from "./lib/schema/signal";

/**
 * Content Collections only checks the loose shape here; the real, strict parsing happens in
 * `transform` with the same schemas that scripts/validate-content.ts uses, so there is exactly
 * one definition of "valid". validate-content is the build gate (it also runs cross-field rules).
 */
const Loose = z.looseObject({ content: z.string() });

type LooseDoc = z.infer<typeof Loose> & {
	_meta: { fileName: string; path: string };
};

function frontmatterOf(doc: LooseDoc): Record<string, unknown> {
	const { content: _content, _meta, ...fm } = doc;
	return fm;
}

function fail(doc: LooseDoc, error: z.ZodError): never {
	throw new Error(`${doc._meta.path}: ${z.prettifyError(error)}`);
}

function slugOf(doc: LooseDoc): string {
	return doc._meta.fileName.replace(/\.mdx$/, "");
}

const signals = defineCollection({
	name: "signals",
	directory: "content/ledger",
	include: "**/*.mdx",
	schema: Loose,
	transform: async (doc, ctx) => {
		const parsed = parseSignalFrontmatter(frontmatterOf(doc));
		if (!parsed.success) fail(doc, parsed.error);
		const signal = parsed.data;
		// Open signals never compile a body: it must be empty and is enforced by validate-content.
		const mdx = signal.status === "open" ? null : await compileMDX(ctx, doc);
		return { ...signal, mdx };
	},
});

const cases = defineCollection({
	name: "cases",
	directory: "content/cases",
	include: "*.mdx",
	schema: Loose,
	transform: async (doc, ctx) => {
		const parsed = CaseStudyFrontmatter.safeParse(frontmatterOf(doc));
		if (!parsed.success) fail(doc, parsed.error);
		return {
			...parsed.data,
			slug: slugOf(doc),
			hasBody: doc.content.trim().length > 0,
			mdx: await compileMDX(ctx, doc),
		};
	},
});

const modules = defineCollection({
	name: "modules",
	directory: "content/modules",
	include: "*.mdx",
	schema: Loose,
	transform: async (doc, ctx) => {
		const parsed = ModuleFrontmatter.safeParse(frontmatterOf(doc));
		if (!parsed.success) fail(doc, parsed.error);
		return { ...parsed.data, mdx: await compileMDX(ctx, doc) };
	},
});

const research = defineCollection({
	name: "research",
	directory: "content/research",
	include: "*.mdx",
	schema: Loose,
	transform: async (doc, ctx) => {
		const parsed = ResearchFrontmatter.safeParse(frontmatterOf(doc));
		if (!parsed.success) fail(doc, parsed.error);
		return {
			...parsed.data,
			slug: slugOf(doc),
			mdx: await compileMDX(ctx, doc),
		};
	},
});

const agent = defineCollection({
	name: "agent",
	directory: "content/pages",
	include: "agent.mdx",
	schema: Loose,
	transform: async (doc, ctx) => {
		const parsed = AgentFrontmatter.safeParse(frontmatterOf(doc));
		if (!parsed.success) fail(doc, parsed.error);
		return { ...parsed.data, mdx: await compileMDX(ctx, doc) };
	},
});

export default defineConfig({
	content: [signals, cases, modules, research, agent],
});
