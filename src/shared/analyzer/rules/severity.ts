import type { CheckCategory, CheckItem, Severity } from '@/shared/types/audit-result';

export function makeCheck(params: {
  id: string;
  category: CheckCategory;
  title: string;
  description: string;
  severity: Severity;
  statusLabel?: string;
  whyItMatters?: string;
  suggestedFix?: string;
  estimatedImpact?: 'High' | 'Medium' | 'Low';
}): CheckItem {
  return { ...params };
}

export function scoreFromChecks(
  checks: CheckItem[],
  weights: Record<string, number>,
): number {
  const deduction = checks.reduce(
    (sum, check) => sum + (weights[check.severity] ?? 0),
    0,
  );
  return Math.max(0, Math.min(100, 100 - deduction));
}

export function tallyCounts(checks: CheckItem[]) {
  return {
    critical: checks.filter((c) => c.severity === 'critical').length,
    warning: checks.filter((c) => c.severity === 'warning').length,
    passed: checks.filter((c) => c.severity === 'pass').length,
  };
}
