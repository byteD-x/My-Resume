import { notFound } from 'next/navigation';
import { getExperience, getAllExperienceSlugs } from '@/lib/experiences';
import { ExperienceModal } from '@/components/ExperienceModal';

export async function generateStaticParams() {
    return getAllExperienceSlugs();
}

export default async function ExperiencePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const item = getExperience(slug);

    if (!item) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 flex items-center justify-center">
            <ExperienceModal item={item} variant="page" />
        </div>
    );
}
