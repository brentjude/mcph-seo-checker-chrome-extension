import type { CheckItem as CheckItemType } from '@/shared/types/audit-result';
import { Badge } from './Badge';
import { SEVERITY_BG_COLOR, SEVERITY_ICON, SEVERITY_TEXT_COLOR } from './severity-visuals';

interface CheckItemProps {
  item: CheckItemType;
}

/** The single reusable "check row" — icon, title, description, severity badge — used across every section. */
export function CheckItem({ item }: CheckItemProps) {
  const Icon = SEVERITY_ICON[item.severity];

  return (
    <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <span
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${SEVERITY_BG_COLOR[item.severity]}`}
      >
        <Icon className={`h-4 w-4 ${SEVERITY_TEXT_COLOR[item.severity]}`} strokeWidth={2.25} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text-primary dark:text-text-darkPrimary">
          {item.title}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-text-secondary dark:text-text-darkSecondary">
          {item.description}
        </p>
      </div>
      <Badge severity={item.severity} label={item.statusLabel} />
    </div>
  );
}
