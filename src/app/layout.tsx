import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { defaultPortfolioData } from "@/data";
import { AnalyticsProvider } from "@/lib/AnalyticsProvider";
import { MotionProvider } from "@/lib/MotionProvider";
import { WebVitals } from "@/lib/performance";
import { SkipToContent } from "@/components/SkipToContent";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    template: `%s | ${siteConfig.name} - ${siteConfig.role}`,
    default: `${siteConfig.name} - ${siteConfig.role}`,
  },
  description: siteConfig.description,
  keywords: [
    "后端工程师",
    "全栈开发",
    "AI工程",
    "Java",
    "Spring Boot",
    "Python",
    "LLM",
    "Resume",
    "Portfolio",
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    title: `${siteConfig.name} - ${siteConfig.role}`,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    siteName: `${siteConfig.name} Portfolio`,
    type: "website",
    locale: "zh_CN",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - ${siteConfig.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - ${siteConfig.role}`,
    description: siteConfig.description,
    images: [siteConfig.ogImagePath],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import { cn } from "@/lib/utils";

const fontHeading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const fontBody = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  // Generate SoftwareSourceCode schema for GitHub projects
  const softwareProjects = defaultPortfolioData.projects
    .filter((p) => p.link && p.link.includes("github.com"))
    .map((p) => ({
      "@type": "SoftwareSourceCode",
      name: p.name,
      description: p.summary,
      codeRepository: p.link,
      programmingLanguage: p.techTags.join(", "),
      author: {
        "@type": "Person",
        name: siteConfig.name,
      },
      datePublished: p.year,
    }));

  // JSON-LD structured data with Graph
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: siteConfig.name,
        url: siteConfig.siteUrl,
        jobTitle: siteConfig.role,
        description: siteConfig.description,
        image: `${siteConfig.siteUrl}/og.png`,
        sameAs: ["https://github.com/icefunicu", siteConfig.siteUrl],
        worksFor: {
          "@type": "Organization",
          name: "Open to Opportunities",
        },
      },
      ...softwareProjects,
    ],
  };

  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={cn(fontHeading.variable, fontBody.variable)}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="subpixel-antialiased font-body" suppressHydrationWarning>
        <AnalyticsProvider>
          <MotionProvider>
            <WebVitals />
            <SkipToContent />
            <div id="main-content">{children}</div>
            {modal}
          </MotionProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
