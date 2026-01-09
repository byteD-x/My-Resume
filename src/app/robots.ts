import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

/**
 * Robots.txt 配置，控制搜索引擎爬虫行为
 */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/_next/'],
            },
        ],
        sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
    };
}
