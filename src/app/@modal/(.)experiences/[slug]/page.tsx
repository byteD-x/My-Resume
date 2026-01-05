import { getExperience, getAllExperienceSlugs } from '@/lib/experiences';
import { ExperienceModal } from '@/components/ExperienceModal';

// We need to fetch data client-side or pass it somehow. 
// Intercepting routes are Client Components if they use client hooks or animations usually?
// But `page.tsx` is Server Component by default.
// 
// ISSUE: getExperience is a helper using `defaultPortfolioData` which is in `data.ts`.
// If `data.ts` is purely static JS/TS, we can import it in Server Components.

export async function generateStaticParams() {
    return getAllExperienceSlugs();
}

export default async function InterceptedExperiencePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const item = getExperience(slug);

    if (!item) {
        return null; // Or handle not found
    }

    return <ExperienceModal item={item} />;
}
