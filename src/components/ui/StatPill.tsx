import type { LucideIcon } from 'lucide-react';

interface StatPillProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
}

/** Small icon+number+label chip, reused in SEO Overview, Links, and Content Statistics grids. */
export function StatPill({ icon: Icon, value, label }: StatPillProps) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-surface-border bg-surface-light p-3 dark:border-surface-darkBorder dark:bg-surface-darkBase">
      <div className="flex items-center gap-1.5 text-text-secondary dark:text-text-darkSecondary">
        <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
        <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
      </div>
      <span className="text-lg font-semibold text-text-primary dark:text-text-darkPrimary">{value}</span>
    </div>
  );
}
