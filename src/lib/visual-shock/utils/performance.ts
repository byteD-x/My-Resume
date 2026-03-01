import type { QualityLevel } from "@/lib/visual-shock/types";

export interface QualityAdjustmentInput {
  currentLevel: QualityLevel;
  fps: number;
  now: number;
  lowFpsSince: number | null;
  highFpsSince: number | null;
}

export interface QualityAdjustmentResult {
  nextLevel: QualityLevel | null;
  lowFpsSince: number | null;
  highFpsSince: number | null;
}

export function evaluateQualityAdjustment(
  input: QualityAdjustmentInput,
): QualityAdjustmentResult {
  const { currentLevel, fps, now } = input;
  let lowFpsSince = input.lowFpsSince;
  let highFpsSince = input.highFpsSince;
  let nextLevel: QualityLevel | null = null;

  if (fps < 45) {
    highFpsSince = null;
    if (lowFpsSince === null) {
      lowFpsSince = now;
    }
    const lowFpsDuration = now - lowFpsSince;
    if (lowFpsDuration > 2400) {
      if (currentLevel === "high") {
        nextLevel = "medium";
      } else if (currentLevel === "medium" && fps < 35) {
        nextLevel = "low";
      }
      lowFpsSince = now;
    }

    return {
      nextLevel,
      lowFpsSince,
      highFpsSince,
    };
  }

  lowFpsSince = null;

  if (fps > 58) {
    if (highFpsSince === null) {
      highFpsSince = now;
    }
    const stableDuration = now - highFpsSince;
    if (stableDuration > 9000) {
      if (currentLevel === "low") {
        nextLevel = "medium";
      } else if (currentLevel === "medium") {
        nextLevel = "high";
      }
      highFpsSince = now;
    }
  } else {
    highFpsSince = null;
  }

  return {
    nextLevel,
    lowFpsSince,
    highFpsSince,
  };
}
