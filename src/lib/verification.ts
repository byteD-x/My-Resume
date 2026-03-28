import { VerificationInfo } from "@/types";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const sourceTypeLabelMap: Record<VerificationInfo["sourceType"], string> = {
  repo: "仓库/代码记录",
  experience: "项目经历/交付记录",
  manual: "人工整理与交叉校对",
};

const confidenceLabelMap: Record<VerificationInfo["confidence"], string> = {
  high: "高",
  medium: "中",
};

export interface VerificationAssessment {
  confidenceText: string;
  basis: string[];
  reason: string;
}

function parseVerifiedAt(verifiedAt: string): Date | null {
  const normalized = verifiedAt.trim();
  if (!normalized) return null;

  const date = new Date(`${normalized}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function getDaysSince(verifiedAt: string, referenceDate: Date): number | null {
  const verifiedDate = parseVerifiedAt(verifiedAt);
  if (!verifiedDate) return null;
  const diff = referenceDate.getTime() - verifiedDate.getTime();
  if (diff < 0) return 0;
  return Math.floor(diff / MS_PER_DAY);
}

function buildDerivedBasis(
  verification: VerificationInfo,
  daysSince: number | null,
): string[] {
  const basis: string[] = [];

  if (verification.level === "strict") {
    basis.push("证据级别：严格复核（核心区仅展示可复核指标）");
  } else {
    basis.push("证据级别：估算复核（建议二次确认）");
  }

  basis.push(`来源类型：${sourceTypeLabelMap[verification.sourceType]}`);

  if (verification.sourceUrl) {
    basis.push("来源链接：已提供公开链接，可独立复核");
  } else {
    basis.push("来源链接：未提供公开链接，需结合履历或交付记录复核");
  }

  if (daysSince === null) {
    basis.push(
      `验证时间：${verification.verifiedAt}（格式异常，无法计算距今天数）`,
    );
  } else if (daysSince <= 180) {
    basis.push(
      `验证时间：${verification.verifiedAt}（距今 ${daysSince} 天，时效性高）`,
    );
  } else if (daysSince <= 365) {
    basis.push(
      `验证时间：${verification.verifiedAt}（距今 ${daysSince} 天，时效性可接受）`,
    );
  } else {
    basis.push(
      `验证时间：${verification.verifiedAt}（距今 ${daysSince} 天，建议更新复核）`,
    );
  }

  return basis;
}

function buildDerivedReason(
  verification: VerificationInfo,
  daysSince: number | null,
): string {
  if (verification.confidence === "high") {
    const positives: string[] = [];

    if (verification.level === "strict") {
      positives.push("按严格口径整理");
    }

    if (verification.sourceType === "repo") {
      positives.push("可回溯到仓库或代码记录");
    } else if (verification.sourceType === "experience") {
      positives.push("可与项目经历交叉验证");
    } else {
      positives.push("已完成人工交叉校对");
    }

    if (verification.sourceUrl) {
      positives.push("包含可访问来源链接");
    }

    if (daysSince !== null && daysSince <= 365) {
      positives.push(`验证时间距今 ${daysSince} 天`);
    }

    if (positives.length === 0) {
      return "判定为高置信度：当前证据链完整且可复核。";
    }

    return `判定为高置信度：${positives.join("，")}。`;
  }

  const constraints: string[] = [];

  if (verification.sourceType === "manual") {
    constraints.push("证据主要来自人工整理");
  }

  if (!verification.sourceUrl) {
    constraints.push("缺少公开来源链接");
  }

  if (verification.level !== "strict") {
    constraints.push("采用估算复核口径");
  }

  if (daysSince !== null && daysSince > 365) {
    constraints.push(`验证时间距今 ${daysSince} 天，时效性偏弱`);
  }

  if (constraints.length === 0) {
    constraints.push("可公开交叉验证信息不足");
  }

  return `判定为中置信度：${constraints.join("；")}。`;
}

export function getConfidenceDisplayText(
  confidence: VerificationInfo["confidence"],
): string {
  return confidenceLabelMap[confidence];
}

export function evaluateVerificationConfidence(
  verification: VerificationInfo,
  referenceDate: Date = new Date(),
): VerificationAssessment {
  const daysSince = getDaysSince(verification.verifiedAt, referenceDate);
  const derivedBasis = buildDerivedBasis(verification, daysSince);

  const manualBasis = (verification.confidenceBasis ?? [])
    .map((item) => item.trim())
    .filter(Boolean);
  const basis = manualBasis.length > 0 ? manualBasis : derivedBasis;

  const manualReason = verification.confidenceReason?.trim();
  const reason = manualReason || buildDerivedReason(verification, daysSince);

  return {
    confidenceText: getConfidenceDisplayText(verification.confidence),
    basis,
    reason,
  };
}
