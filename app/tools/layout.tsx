import type { ReactNode } from "react";
import { martianMono } from "@/lib/fonts";

/** Toolbox uses the A pane system; Martian Mono is scoped here so other pages never load it. */
export default function ToolsLayout({ children }: { children: ReactNode }) {
	return <div className={martianMono.variable}>{children}</div>;
}
