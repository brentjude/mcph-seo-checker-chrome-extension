import type { PageAuditData } from '@/shared/types/page-data';
import type { AuditResult, HealthLabel } from '@/shared/types/audit-result';
import { computeSeoChecks, computeSeoScore } from './seoScore';
import { computeAiVisibilityChecks, computeAiVisibilityScore } from './aiVisibilityScore';
import { computeSocialChecks, buildSocialPreviews } from './socialChecks';
import { computeContentOverview } from './contentStats';
import { tallyCounts } from './rules/severity';
import { THRESHOLDS } from './rules/thresholds';

function healthLabelFromScore(score: number): HealthLabel {
  if (score >= THRESHOLDS.healthLabel.excellent) return 'Excellent';
  if (score >= THRESHOLDS.healthLabel.good) return 'Good';
  return 'Needs Improvement';
}

export function runAudit(data: PageAuditData): AuditResult {
  const seoChecks = computeSeoChecks(data);
  const aiChecks = computeAiVisibilityChecks(data);
  const socialChecks = computeSocialChecks(data);

  const checks = [...seoChecks, ...aiChecks, ...socialChecks];

  const seoScore = computeSeoScore(seoChecks);
  const aiVisibilityScore = computeAiVisibilityScore(aiChecks);
  const healthLabel = healthLabelFromScore(seoScore);

  const counts = tallyCounts(checks);

  const quickWins = [...checks]
    .filter((c) => c.severity === 'critical' || c.severity === 'warning')
    .sort((a, b) => (a.severity === 'critical' ? -1 : 0) - (b.severity === 'critical' ? -1 : 0))
    .slice(0, THRESHOLDS.quickWinsCount);

  const contentOverview = {
    seoScore,
    aiVisibilityScore,
    ...computeContentOverview(data),
  };

  return {
    seoScore,
    aiVisibilityScore,
    healthLabel,
    auditedAt: Date.now(),
    counts,
    checks,
    contentOverview,
    social: buildSocialPreviews(data),
    quickWins,
  };
}
