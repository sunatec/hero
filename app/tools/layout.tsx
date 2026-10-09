import type { ReactNode } from "react";
import { martianMonoPreloaded } from "@/lib/fonts-tools";

/** Toolbox uses the A pane system; Martian Mono is scoped here so other pages never load it. */
export default function ToolsLayout({ children }: { children: ReactNode }) {
	return <div className={martianMonoPreloaded.variable}>{children}</div>;
}
