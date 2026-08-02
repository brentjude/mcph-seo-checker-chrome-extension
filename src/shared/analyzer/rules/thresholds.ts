/** Single source of truth for every tunable number the analyzer uses. */
export const THRESHOLDS = {
  title: { min: 30, max: 60 },
  metaDescription: { min: 120, max: 160 },
  altTextMissingRatio: { warning: 0.15, critical: 0.5 },
  readingWpm: 200,
  entityDensity: { recommendation: 1.5 },
  paragraphLength: { warningMax: 150, recommendationMin: 15 },
  healthLabel: { excellent: 90, good: 70 },
  quickWinsCount: 5,
} as const;

/** Score deducted per check at each severity, floored at 0 and capped at 100. */
export const SEO_SEVERITY_WEIGHTS: Record<string, number> = {
  critical: 18,
  warning: 7,
  recommendation: 2,
  pass: 0,
};

export const AI_SEVERITY_WEIGHTS: Record<string, number> = {
  critical: 15,
  warning: 9,
  recommendation: 4,
  pass: 0,
};
