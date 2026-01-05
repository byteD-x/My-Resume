import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH
  ? `/${process.env.NEXT_PUBLIC_BASE_PATH}`
  : "";
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : undefined,
  trailingSlash: isStaticExport ? true : undefined,
  images: {
    unoptimized: true,
  },
  // Set NEXT_PUBLIC_BASE_PATH=repo-name for GitHub Pages project sites.
  basePath: isStaticExport ? basePath : undefined,
  assetPrefix: isStaticExport && basePath ? `${basePath}/` : undefined,
};

export default nextConfig;
