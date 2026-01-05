import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    template: `%s | ${siteConfig.name} - ${siteConfig.role}`,
    default: `${siteConfig.name} - ${siteConfig.role}`,
  },
  description: siteConfig.description,
  keywords: ["后端工程师", "全栈开发", "AI工程", "Java", "Spring Boot", "Python", "LLM", "Resume", "Portfolio"],
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

export default function RootLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  // JSON-LD structured data for Person schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": siteConfig.name,
    "jobTitle": siteConfig.role,
    "url": siteConfig.siteUrl,
    "email": siteConfig.email,
    "sameAs": [
      "https://github.com/icefunicu"
    ],
    "knowsAbout": ["后端开发", "全栈开发", "AI工程化", "Java", "Spring Boot", "Python", "LLM"],
    "worksFor": {
      "@type": "Organization",
      "name": "Open to Opportunities"
    }
  };

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${ibmPlexSans.variable} antialiased`}
        style={{
          fontFamily: "var(--font-ibm), 'IBM Plex Sans SC', system-ui, sans-serif"
        }}
        suppressHydrationWarning
      >
        {children}
        {modal}
      </body>
    </html>
  );
}
