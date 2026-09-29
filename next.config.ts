import { withContentCollections } from "@content-collections/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
};

// withContentCollections must stay the outermost plugin.
export default withContentCollections(nextConfig);
