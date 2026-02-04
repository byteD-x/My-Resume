const INVALID_FILENAME_CHARS = /[\/\\:*?"<>|]+/g;
const TRAILING_SPACES_OR_DOTS = /[. ]+$/g;

export function formatResumeFileName(
    title?: string,
    name?: string,
    separator = '-',
): string {
    const parts = [title, name]
        .map(value => (value ?? '').trim())
        .filter(Boolean);

    const baseName = parts.join(separator);
    let cleaned = baseName
        .replace(INVALID_FILENAME_CHARS, '-')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(TRAILING_SPACES_OR_DOTS, '');

    if (!cleaned) return 'resume.pdf';

    if (!cleaned.toLowerCase().endsWith('.pdf')) {
        cleaned = `${cleaned}.pdf`;
    }

    return cleaned;
}

export function getResumeDownloadUrl(fileName: string): string {
    const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';
    if (isStaticExport) {
        const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').trim();
        const normalizedBasePath = basePath ? `/${basePath.replace(/^\/+|\/+$/g, '')}` : '';
        return `${normalizedBasePath}/resume.pdf`;
    }

    const params = new URLSearchParams({ filename: fileName });
    return `/api/resume?${params.toString()}`;
}
