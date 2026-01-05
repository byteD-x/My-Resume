import { z } from 'zod';

// ==========================================
// Zod Schema for Portfolio Data Validation
// Used for validating imported JSON
// ==========================================

const ExperienceDetailSchema = z.object({
    background: z.string().optional(),
    problem: z.string().optional(),
    solution: z.string().optional(),
    result: z.string().optional(),
    role: z.string().optional(),
    techStack: z.array(z.string()).optional(),
    links: z.array(z.object({
        label: z.string(),
        url: z.string().url(),
    })).optional(),
}).optional();

const QuickFactsSchema = z.object({
    role: z.string(),
    availability: z.string(),
    techStack: z.array(z.string()),
});

const TimelineItemSchema = z.object({
    id: z.string(),
    year: z.string(),
    role: z.string(),
    company: z.string(),
    location: z.string().optional(),
    summary: z.string(),
    bulletPoints: z.array(z.string()).optional(),
    expandedDetails: ExperienceDetailSchema.optional(),
    keyOutcomes: z.array(z.string()).optional(),
    techTags: z.array(z.string()),
    highlighted: z.boolean().optional(),
});

const ProjectItemSchema = z.object({
    id: z.string(),
    year: z.string(),
    name: z.string(),
    link: z.string().optional(),
    demoLink: z.string().optional(),
    tech: z.array(z.string()),
    techTags: z.array(z.string()),
    summary: z.string(),
    details: z.array(z.string()),
    impact: z.string().optional(),
    expandedDetails: ExperienceDetailSchema.optional(),
    keyOutcomes: z.array(z.string()).optional(),
    highlighted: z.boolean().optional(),
});

const ImpactItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    value: z.string(),
    label: z.string(),
    description: z.string().optional(),
    linkedExperienceId: z.string().optional(),
    icon: z.string(),
    colSpan: z.string().optional(),
    rowSpan: z.string().optional(),
    bg: z.string().optional(),
    isFocal: z.boolean().optional(),
});

const HeroBulletSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
});

const HeroDataSchema = z.object({
    name: z.string(),
    title: z.string(),
    subtitle: z.string(),
    location: z.string().optional(),
    bullets: z.array(HeroBulletSchema).min(1).max(5),
    quickFacts: QuickFactsSchema.optional(),
});

const SkillCategorySchema = z.object({
    id: z.string(),
    category: z.string(),
    description: z.string().optional(),
    items: z.array(z.string()),
});

const VibeCodingDataSchema = z.object({
    title: z.string(),
    description: z.string(),
});

const ContactDataSchema = z.object({
    phone: z.string(),
    email: z.string().email(),
    github: z.string().url(),
    website: z.string().url().optional(),
    websites: z.array(z.string().url()).optional(),
    resumeButtonText: z.string().optional(),
    ctaText: z.string().optional(),
});

const ServiceItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    techStack: z.array(z.string()).optional(),
    gradient: z.string().optional(),
});

export const PortfolioDataSchema = z.object({
    hero: HeroDataSchema,
    about: z.string(),
    impact: z.array(ImpactItemSchema),
    timeline: z.array(TimelineItemSchema).min(1),
    projects: z.array(ProjectItemSchema),
    skills: z.array(SkillCategorySchema),
    services: z.array(ServiceItemSchema),
    vibeCoding: VibeCodingDataSchema,
    contact: ContactDataSchema,
});

export type PortfolioDataInput = z.infer<typeof PortfolioDataSchema>;
/**
 * 验证导入的 JSON 数据
 * @param data 待验证的数据
 * @returns 验证结果，成功返回 { success: true, data }，失败返回 { success: false, errors }
 */
export function validatePortfolioData(data: unknown):
    | { success: true; data: PortfolioDataInput }
    | { success: false; errors: string[] } {
    try {
        const result = PortfolioDataSchema.safeParse(data);
        if (result.success) {
            return { success: true, data: result.data };
        } else {
            const errors = result.error.issues.map(issue => {
                const path = issue.path.join(' → ');
                return `${path ? `[${path}] ` : ''}${issue.message}`;
            });
            return { success: false, errors };
        }
    } catch {
        return { success: false, errors: ['JSON 解析失败，请检查格式'] };
    }
}
