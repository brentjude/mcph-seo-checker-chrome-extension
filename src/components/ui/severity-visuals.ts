import { CheckCircle2, Lightbulb, TriangleAlert, XCircle, type LucideIcon } from 'lucide-react';
import type { Severity } from '@/shared/types/audit-result';

export const SEVERITY_ICON: Record<Severity, LucideIcon> = {
  pass: CheckCircle2,
  warning: TriangleAlert,
  critical: XCircle,
  recommendation: Lightbulb,
};

export const SEVERITY_TEXT_COLOR: Record<Severity, string> = {
  pass: 'text-status-success',
  warning: 'text-status-warning',
  critical: 'text-status-critical',
  recommendation: 'text-brand-primary',
};

export const SEVERITY_BG_COLOR: Record<Severity, string> = {
  pass: 'bg-status-success/10',
  warning: 'bg-status-warning/10',
  critical: 'bg-status-critical/10',
  recommendation: 'bg-brand-primary/10',
};

export const SEVERITY_DEFAULT_LABEL: Record<Severity, string> = {
  pass: 'PASS',
  warning: 'WARNING',
  critical: 'CRITICAL',
  recommendation: 'RECOMMENDATION',
};
