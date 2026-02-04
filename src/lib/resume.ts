const INVALID_FILENAME_CHARS = /[\/\\:*?"<>|]+/g;
const TRAILING_SPACES_OR_DOTS = /[. ]+$/g;
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';

export interface ResumeDownloadClickEvent {
    preventDefault: () => void;
}

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
    if (isStaticExport) {
        const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').trim();
        const normalizedBasePath = basePath ? `/${basePath.replace(/^\/+|\/+$/g, '')}` : '';
        return `${normalizedBasePath}/resume.pdf`;
    }

    const params = new URLSearchParams({ filename: fileName });
    return `/api/resume?${params.toString()}`;
}

export async function triggerResumeDownload(fileName: string, url: string): Promise<void> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Resume download failed');
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
}

export function createResumeDownloadHandler(fileName: string, url: string) {
    if (!isStaticExport || typeof window === 'undefined') return undefined;

    return async (event: ResumeDownloadClickEvent) => {
        event.preventDefault();
        try {
            await triggerResumeDownload(fileName, url);
        } catch {
            window.location.href = url;
        }
    };
}
