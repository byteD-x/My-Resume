import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // Intercepting Routes are not supported with static export
  images: {
    unoptimized: true,
  },
  // GitHub Pages 部署配置
  // 如果部署到 https://username.github.io/repo-name/
  // 请取消注释以下行并修改 repo-name
  // basePath: '/repo-name',
  // assetPrefix: '/repo-name/',
};

export default nextConfig;
