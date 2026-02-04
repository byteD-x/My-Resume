import { promises as fs } from 'fs';
import path from 'path';
import { defaultPortfolioData } from '@/data';
import { formatResumeFileName } from '@/lib/resume';

export const runtime = 'nodejs';

// Static export ignores API routes but needs a static segment config to avoid build errors.
export const dynamic = 'force-static';

const RESUME_PATH = path.join(process.cwd(), 'public', 'resume.pdf');
const FALLBACK_NAME = 'resume.pdf';
const DEFAULT_FILE_NAME = formatResumeFileName(
    defaultPortfolioData.hero.title,
    defaultPortfolioData.hero.name,
);

const sanitizeAsciiFilename = (value: string) => {
    const ascii = value.replace(/[^\x20-\x7E]/g, '_');
    return ascii || FALLBACK_NAME;
};

export async function GET() {
    const safeFileName = DEFAULT_FILE_NAME || FALLBACK_NAME;
    try {
        const file = await fs.readFile(RESUME_PATH);
        const asciiFallback = sanitizeAsciiFilename(safeFileName);
        const encodedName = encodeURIComponent(safeFileName);

        return new Response(file, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodedName}`,
            },
        });
    } catch {
        return new Response('Resume not found', { status: 404 });
    }
}
