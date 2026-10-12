import { cn } from "@/lib/utils";
import Image from "next/image";
import type { Locale } from "@/lib/locale";

const imageByKind: Record<string, string> = {
  runtime: "/images/project-customer-runtime.webp",
  retrieval: "/images/project-rag-retrieval.webp",
  memory: "/images/project-wechat-memory.webp",
  storage: "/images/project-cloudpan-storage.webp",
};

const visualMeta: Record<string, { zh: { title: string; flow: string; tech: string[] }; en: { title: string; flow: string; tech: string[] } }> = {
  runtime: {
    zh: { title: "智能客服运行时", flow: "对话 → 路由 → 工具 / 人工", tech: ["6 层运行时", "7 类插件", "Auth Bridge"] },
    en: { title: "Customer-service runtime", flow: "Message → route → tool / human", tech: ["6-layer runtime", "7 plugin types", "Auth Bridge"] },
  },
  retrieval: {
    zh: { title: "RAG-QA System", flow: "文档 → 检索 → 证据答案", tech: ["混合检索", "Qdrant", "Eval gates"] },
    en: { title: "RAG-QA System", flow: "Docs → retrieval → cited answer", tech: ["Hybrid retrieval", "Qdrant", "Eval gates"] },
  },
  memory: {
    zh: { title: "微信智能助手", flow: "对话 → 记忆 → 工具执行", tech: ["三层记忆", "LangGraph", "Cross-Encoder"] },
    en: { title: "Long-running assistant", flow: "Chat → memory → tool execution", tech: ["3-layer memory", "LangGraph", "Cross-Encoder"] },
  },
  storage: {
    zh: { title: "EasyCloudPan", flow: "上传 → 存储 → 同步 / 权限", tech: ["Java 21", "OAuth2", "MinIO / S3"] },
    en: { title: "EasyCloudPan", flow: "Upload → store → sync / access", tech: ["Java 21", "OAuth2", "MinIO / S3"] },
  },
};

export function DarkProjectVisual({ kind, label, locale = "zh", priority = false }: { kind: string; label: string; locale?: Locale; priority?: boolean }) {
  const meta = (visualMeta[kind] ?? visualMeta.runtime)[locale];

  return (
    <div className={cn("dark-project-visual", `visual-${kind}`)} role="img" aria-label={`${label} ${locale === "zh" ? "概念视觉" : "concept visual"}`}>
      <Image
        src={imageByKind[kind] ?? imageByKind.runtime}
        alt=""
        fill
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        sizes="(max-width: 767px) 100vw, 50vw"
        className="dark-project-visual-image"
      />
      <span className="visual-orbit visual-orbit-a" />
      <span className="visual-orbit visual-orbit-b" />
      <span className="visual-core" />
      <div className="visual-explainer">
        <span className="visual-explainer-kicker">{meta.title}</span>
        <strong>{meta.flow}</strong>
        <div className="visual-explainer-tech">
          {meta.tech.map((tech) => <span key={tech}>{tech}</span>)}
        </div>
      </div>
      <span className="visual-caption">CONCEPT / {kind.toUpperCase()}</span>
    </div>
  );
}
