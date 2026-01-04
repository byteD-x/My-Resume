'use client';

import { notFound } from 'next/navigation';
import { getExperience } from '@/lib/experiences';
import { ExperienceModal } from '@/components/ExperienceModal';
import { useEffect, useState, use } from 'react';

// We need to fetch data client-side or pass it somehow. 
// Intercepting routes are Client Components if they use client hooks or animations usually?
// But `page.tsx` is Server Component by default.
// 
// ISSUE: getExperience is a helper using `defaultPortfolioData` which is in `data.ts`.
// If `data.ts` is purely static JS/TS, we can import it in Server Components.

export default function InterceptedExperiencePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const item = getExperience(slug);

    if (!item) {
        return null; // Or handle not found
    }

    return <ExperienceModal item={item} />;
}
