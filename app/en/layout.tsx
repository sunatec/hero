import type { ReactNode } from "react";

/**
 * One root layout (lang="zh-CN") for the whole site; English pages declare their language on this
 * wrapper instead of a second root layout, which would require experimental global-not-found.
 */
export default function EnLayout({ children }: { children: ReactNode }) {
	return <div lang="en">{children}</div>;
}
