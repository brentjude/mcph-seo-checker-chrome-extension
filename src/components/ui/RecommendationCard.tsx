import type { CheckItem } from '@/shared/types/audit-result';
import { Badge } from './Badge';

interface RecommendationCardProps {
  item: CheckItem;
}

export function RecommendationCard({ item }: RecommendationCardProps) {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-light p-3 dark:border-surface-darkBorder dark:bg-surface-darkBase">
      <div className="flex items-center justify-between gap-2">
        <Badge severity={item.severity} label={item.statusLabel} />
        {item.estimatedImpact && (
          <span className="text-[11px] font-medium text-text-secondary dark:text-text-darkSecondary">
            Impact: {item.estimatedImpact}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm font-semibold text-text-primary dark:text-text-darkPrimary">
        {item.title}
      </p>
      {item.whyItMatters && (
        <p className="mt-1 text-xs leading-relaxed text-text-secondary dark:text-text-darkSecondary">
          {item.whyItMatters}
        </p>
      )}
      {item.suggestedFix && (
        <div className="mt-2 rounded-lg bg-white p-2 text-xs text-text-primary dark:bg-surface-darkCard dark:text-text-darkPrimary">
          <span className="font-medium text-brand-dark dark:text-brand-accent">Suggested Fix: </span>
          {item.suggestedFix}
        </div>
      )}
    </div>
  );
}
