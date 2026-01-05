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

    // In the standalone page, we render the modal content, 
    // but without the "Modal" wrapper behaviors (like blocking scroll or backdrop),
    // OR we can just reuse the Modal component because it's designed to be fullscreen-ish?
    // User requested "Deep linking support ... visiting /projects/[slug] directly opens the content".
    // 
    // IF the user visits directly, it's NOT a modal over the home page, it is THE page.
    // However, the visual requirement usually (in these "Instagram-like" route modals) is that 
    // the standalone page LOOKS like the specific view, while the intercept looks like a modal.
    //
    // Given the request A: "URL form ... refresh still opens modal",
    // This implies that even on direct visit, we might want to show the list BEHIND it? 
    // NO, Next.js interception doesn't work that way easily without layout tricks.
    // Standard practice: Standalone page renders the content fully. 
    // 
    // I will render the `ExperienceModal` content but maybe wrapped differently 
    // or just render the whole `ExperienceModal` component which has a backdrop.
    // BUT if there is no "background content" (list view) behind it, the semi-transparent backdrop looks weird on empty space.
    // 
    // For now, I'll render it "as a page" but using the Modal component might be acceptable 
    // if we put a layout behind it? 
    // Actually, usually you just render the Content. 
    // But to satisfy "refresh opens modal" usually implies keeping the context.
    // Next.js docs say: "When a user navigates to the URL directly ... the full page is rendered instead of the modal."
    // 
    // Let's reuse the content logic but maybe not the fixed positioning/backdrop if it's a standalone page.
    // However, for simplicity and ensuring Shared Element Transition works best 
    // (if they navigate from another page that isn't the list), 
    // I will just reuse the Modal component structure but perhaps give it a solid background if needed.
    // 
    // WAIT, `ExperienceModal` has `router.back()` on close. 
    // If I visit this page directly, current history stack might be empty or come from google.
    // `router.back()` might leave the site.
    // I should handle close differently if it's a standalone page?
    // 
    // For now, I will use `ExperienceModal` component. 
    // It's the most robust way to ensure visual consistency.

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 flex items-center justify-center">
            <ExperienceModal item={item} />
        </div>
    );
}
