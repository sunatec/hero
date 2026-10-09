import localFont from "next/font/local";

/**
 * Same files, preloaded: on /tools the pane text is the main content and swapping it late
 * shifted layout (CLS 0.09 in CI). Lives in its own module: next/font preloads every face declared in a module a route imports,
 * so keeping it out of lib/fonts.ts stops the homepage from preloading it.
 */
export const martianMonoPreloaded = localFont({
	src: [
		{
			path: "../node_modules/@fontsource/martian-mono/files/martian-mono-latin-400-normal.woff2",
			weight: "400",
		},
		{
			path: "../node_modules/@fontsource/martian-mono/files/martian-mono-latin-500-normal.woff2",
			weight: "500",
		},
	],
	preload: true,
	display: "swap",
	variable: "--font-martian-mono",
});
