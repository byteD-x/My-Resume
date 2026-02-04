import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';
import { formatResumeFileName } from '@/lib/resume';

export const runtime = 'nodejs';

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';
export const dynamic = isStaticExport ? 'force-static' : 'auto';

const RESUME_PATH = path.join(process.cwd(), 'public', 'resume.pdf');
const FALLBACK_NAME = 'resume.pdf';

const sanitizeAsciiFilename = (value: string) => {
    const ascii = value.replace(/[^\x20-\x7E]/g, '_');
    return ascii || FALLBACK_NAME;
};

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const rawFileName = searchParams.get('filename') || FALLBACK_NAME;
    const safeFileName = formatResumeFileName(rawFileName);

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
