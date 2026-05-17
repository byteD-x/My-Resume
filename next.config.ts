import type { NextConfig } from 'next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import packageJson from './package.json';

const createBundleAnalyzer = () => {
    if (process.env.ANALYZE !== 'true') {
        return (config: NextConfig) => config;
    }

    try {
        // Keep `@next/bundle-analyzer` in devDependencies; don't require it in production installs.
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const bundleAnalyzerModule = require('@next/bundle-analyzer');
        const factory = bundleAnalyzerModule?.default ?? bundleAnalyzerModule;
        return factory({ enabled: true });
    } catch {
        return (config: NextConfig) => config;
    }
};

const withBundleAnalyzer = createBundleAnalyzer();

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const configuredDistDir = process.env.NEXT_DIST_DIR?.trim();
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ? `/${process.env.NEXT_PUBLIC_BASE_PATH}` : '';
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').trim();
const shouldUpgradeInsecureRequests = siteUrl.startsWith('https://');
const enableVerboseFetchLogging = process.env.NEXT_FETCH_LOGGING === '1';

if (configuredDistDir) {
    const resolvedDistDir = path.resolve(projectRoot, configuredDistDir);
    const normalizedProjectRoot = `${path.resolve(projectRoot)}${path.sep}`;
    const normalizedDistDir = `${resolvedDistDir}${path.sep}`;

    if (!normalizedDistDir.startsWith(normalizedProjectRoot)) {
        throw new Error(
            `NEXT_DIST_DIR must stay inside the project directory. Received: ${configuredDistDir}`,
        );
    }
}

const contentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https: blob:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://api.github.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  object-src 'none';
  ${shouldUpgradeInsecureRequests ? 'upgrade-insecure-requests;' : ''}
`
    .replace(/\s{2,}/g, ' ')
    .trim();

const securityHeaders = [
    {
        key: 'Content-Security-Policy',
        value: contentSecurityPolicy,
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
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
    },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
    },
    {
        key: 'Cross-Origin-Opener-Policy',
        value: 'same-origin',
    },
    {
        key: 'Cross-Origin-Resource-Policy',
        value: 'same-site',
    },
];

const headersConfig = isStaticExport
    ? {}
    : {
        async headers() {
            return [
                {
                    source: '/(.*)',
                    headers: securityHeaders,
                },
            ];
        },
    };

const buildTimestamp = process.env.NEXT_PUBLIC_BUILD_TIMESTAMP ?? new Date().toISOString();

const nextConfig: NextConfig = {
    // Self-hosted server deployments use the standalone output so runtime no longer
    // depends on a separate `npm ci` step or `next` binary in the release directory.
    output: isStaticExport ? 'export' : 'standalone',
    distDir: configuredDistDir || undefined,
    allowedDevOrigins: ['127.0.0.1', 'localhost'],
    trailingSlash: isStaticExport ? true : undefined,
    typescript: {
        tsconfigPath: './tsconfig.next.json',
    },
    turbopack: {
        root: projectRoot,
    },
    experimental: {
        optimizePackageImports: ['lucide-react', 'framer-motion'],
    },
    logging: enableVerboseFetchLogging
        ? {
            fetches: {
                fullUrl: true,
            },
        }
        : undefined,
    images: {
        loader: 'custom',
        loaderFile: './image-loader.ts',
    },
    transpilePackages: ['next-image-export-optimizer'],
    basePath: isStaticExport ? basePath : undefined,
    assetPrefix: isStaticExport && basePath ? `${basePath}/` : undefined,
    env: {
        nextImageExportOptimizer_imageFolderPath: 'public/images',
        nextImageExportOptimizer_exportFolderPath: 'out',
        nextImageExportOptimizer_quality: '75',
        nextImageExportOptimizer_storePicturesInWEBP: 'true',
        nextImageExportOptimizer_exportFolderName: 'nextImageExportOptimizer',
        nextImageExportOptimizer_generateAndUseBlurImages: 'true',
        nextImageExportOptimizer_removeOriginalExtension: 'true',
        NEXT_PUBLIC_BUILD_TIMESTAMP: buildTimestamp,
        NEXT_PUBLIC_DEPLOY_TARGET: isStaticExport ? 'static-export' : 'server',
        NEXT_PUBLIC_NEXT_VERSION: packageJson.dependencies.next,
        NEXT_PUBLIC_REACT_VERSION: packageJson.dependencies.react,
        NEXT_PUBLIC_TYPESCRIPT_VERSION: packageJson.devDependencies.typescript,
    },
    ...headersConfig,
};

export default withBundleAnalyzer(nextConfig);
