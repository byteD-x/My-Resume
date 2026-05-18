import { promises as fs } from "fs";
import path from "path";
import {
  EN_RESUME_FILE_NAME,
  RESUME_FILE_NAME,
} from "@/lib/resume";
import { getDefaultLocale, normalizeLocale } from "@/lib/locale";

export const runtime = "nodejs";

// Static export ignores API routes but needs a static segment config to avoid build errors.
export const dynamic = "force-static";
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

const FALLBACK_NAME = RESUME_FILE_NAME;
const RESUME_CACHE_CONTROL =
  "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400";

const sanitizeAsciiFilename = (value: string) => {
  const ascii = value.replace(/[^\x20-\x7E]/g, "_");
  return ascii || FALLBACK_NAME;
};

function getResumeAsset(localeParam: string | null) {
  const locale = normalizeLocale(localeParam);
  const fileName = locale === "en" ? EN_RESUME_FILE_NAME : RESUME_FILE_NAME;

  return {
    fileName,
    filePath: path.join(process.cwd(), "public", fileName),
  };
}

export async function GET(request: Request) {
  const localeParam = isStaticExport
    ? getDefaultLocale()
    : new URL(request.url).searchParams.get("locale");
  const { fileName: safeFileName, filePath } = getResumeAsset(localeParam);

  try {
    const file = await fs.readFile(filePath);
    const asciiFallback = sanitizeAsciiFilename(safeFileName);
    const encodedName = encodeURIComponent(safeFileName);

    return new Response(file, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodedName}`,
        "Cache-Control": RESUME_CACHE_CONTROL,
      },
    });
  } catch {
    return new Response("Resume not found", { status: 404 });
  }
}
