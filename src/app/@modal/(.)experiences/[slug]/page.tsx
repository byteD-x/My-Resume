import { getExperience } from '@/lib/experiences';
import { ExperienceModal } from '@/components/ExperienceModal';

export default async function InterceptedExperiencePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const item = getExperience(slug);

    if (!item) {
        return null;
    }

    return <ExperienceModal item={item} />;
}
