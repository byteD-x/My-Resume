export type TechColor = {
  bg: string;
  text: string;
  border: string;
  icon?: string;
};

const neutral: TechColor = {
  bg: "#F1F5F9",
  text: "#475569",
  border: "#E2E8F0",
};

export const techColorMap: Record<string, TechColor> = {
  java: { bg: "#F3E8FF", text: "#7C3AED", border: "#E9D5FF" },
  "spring boot": { bg: "#DCFCE7", text: "#15803D", border: "#BBF7D0" },
  python: { bg: "#DBEAFE", text: "#2563EB", border: "#BFDBFE" },
  mysql: { bg: "#FEF3C7", text: "#D97706", border: "#FDE68A" },
  redis: { bg: "#FEE2E2", text: "#DC2626", border: "#FECACA" },
  typescript: { bg: "#EFF6FF", text: "#0284C7", border: "#BFDBFE" },
  javascript: { bg: "#FEF9C3", text: "#CA8A04", border: "#FDE68A" },
  react: { bg: "#CFFAFE", text: "#0891B2", border: "#A5F3FC" },
  "node.js": { bg: "#DCFCE7", text: "#16A34A", border: "#BBF7D0" },
  "next.js": { bg: "#E2E8F0", text: "#0F172A", border: "#CBD5E1" },
  tailwind: { bg: "#CCFBF1", text: "#0D9488", border: "#99F6E4" },
  tailwindcss: { bg: "#CCFBF1", text: "#0D9488", border: "#99F6E4" },
  vue: { bg: "#DCFCE7", text: "#16A34A", border: "#BBF7D0" },
  "vue.js": { bg: "#DCFCE7", text: "#16A34A", border: "#BBF7D0" },
  docker: { bg: "#DBEAFE", text: "#1D4ED8", border: "#BFDBFE" },
  clickhouse: { bg: "#FEF9C3", text: "#A16207", border: "#FDE68A" },
  elasticsearch: { bg: "#E0E7FF", text: "#4338CA", border: "#C7D2FE" },
  nginx: { bg: "#DCFCE7", text: "#166534", border: "#BBF7D0" },
  "llm apis": { bg: "#EDE9FE", text: "#6D28D9", border: "#DDD6FE" },
  openai: { bg: "#E2E8F0", text: "#0F172A", border: "#CBD5E1" },
  claude: { bg: "#FFE4E6", text: "#BE123C", border: "#FECDD3" },
  gemini: { bg: "#E0F2FE", text: "#0369A1", border: "#BAE6FD" },
  "spring cloud": { bg: "#DCFCE7", text: "#15803D", border: "#BBF7D0" },
  "ci/cd": { bg: "#E2E8F0", text: "#475569", border: "#CBD5E1" },
  "prompt engineering": { bg: "#FDF2F8", text: "#BE185D", border: "#FBCFE8" },
  "function calling": { bg: "#DBEAFE", text: "#1D4ED8", border: "#BFDBFE" },
};

const normalize = (name: string) => name.trim().toLowerCase();

export const getTechColor = (name: string): TechColor => {
  const key = normalize(name);
  return techColorMap[key] || neutral;
};
