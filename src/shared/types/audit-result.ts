export type Severity = 'pass' | 'warning' | 'critical' | 'recommendation';

export type CheckCategory =
  | 'meta'
  | 'headings'
  | 'images'
  | 'links'
  | 'schema'
  | 'social'
  | 'ai';

export interface CheckItem {
  id: string;
  category: CheckCategory;
  title: string;
  description: string;
  severity: Severity;
  /** Overrides the badge's displayed text while keeping the severity's color (e.g. "MISSING" on the Social tab). */
  statusLabel?: string;
  whyItMatters?: string;
  suggestedFix?: string;
  estimatedImpact?: 'High' | 'Medium' | 'Low';
}

export type HealthLabel = 'Excellent' | 'Good' | 'Needs Improvement';

export interface SocialPreviewData {
  title: string | null;
  description: string | null;
  image: string | null;
}

export interface AuditResult {
  seoScore: number;
  aiVisibilityScore: number;
  healthLabel: HealthLabel;
  auditedAt: number;

  counts: {
    critical: number;
    warning: number;
    passed: number;
  };

  checks: CheckItem[];

  contentOverview: {
    seoScore: number;
    aiVisibilityScore: number;
    wordCount: number;
    images: number;
    internalLinks: number;
    externalLinks: number;
    readingTimeMinutes: number;
  };

  social: {
    facebook: SocialPreviewData;
    twitter: SocialPreviewData;
  };

  quickWins: CheckItem[];
}
