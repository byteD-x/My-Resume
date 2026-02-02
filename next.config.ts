import type { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';

// Bundle Analyzer - 仅在 ANALYZE=true 时启用
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH
  ? `/${process.env.NEXT_PUBLIC_BASE_PATH}`
  : "";
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

// Content Security Policy - 优化版本
// 注意：'unsafe-inline' 仍然需要用于 styled-components 和 emotion 等 CSS-in-JS 库
// 在生产环境中考虑使用 nonce 或 hash 进一步加固
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https: blob:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy,
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
];

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : undefined,
  trailingSlash: isStaticExport ? true : undefined,
  images: {
    loader: 'custom',
    loaderFile: './image-loader.ts',
    // unoptimized: true, // Removed to enable optimization
  },
  // React Compiler (Experimental)

  transpilePackages: ["next-image-export-optimizer"],

  experimental: {
  },
  // Set NEXT_PUBLIC_BASE_PATH=repo-name for GitHub Pages project sites.
  basePath: isStaticExport ? basePath : undefined,
  assetPrefix: isStaticExport && basePath ? `${basePath}/` : undefined,

  // Configuration for next-image-export-optimizer
  env: {
    nextImageExportOptimizer_imageFolderPath: "public/images",
    nextImageExportOptimizer_exportFolderPath: "out",
    nextImageExportOptimizer_quality: "75",
    nextImageExportOptimizer_storePicturesInWEBP: "true",
    nextImageExportOptimizer_exportFolderName: "nextImageExportOptimizer",
    nextImageExportOptimizer_generateAndUseBlurImages: "true",
    nextImageExportOptimizer_removeOriginalExtension: "true",
  },

  // Security headers (only applies to server mode, not static export)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
