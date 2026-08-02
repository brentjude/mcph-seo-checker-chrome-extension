import type { Severity } from '@/shared/types/audit-result';
import { SEVERITY_BG_COLOR, SEVERITY_DEFAULT_LABEL, SEVERITY_TEXT_COLOR } from './severity-visuals';

interface BadgeProps {
  severity: Severity;
  label?: string;
}

export function Badge({ severity, label }: BadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide ${SEVERITY_BG_COLOR[severity]} ${SEVERITY_TEXT_COLOR[severity]}`}
    >
      {label ?? SEVERITY_DEFAULT_LABEL[severity]}
    </span>
  );
}
