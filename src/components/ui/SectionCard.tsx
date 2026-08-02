import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface SectionCardProps {
  icon?: LucideIcon;
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** The rounded-card container reused by every section: SEO Overview, Quick Wins, On-Page sections, AI Readiness, Social checklist. */
export function SectionCard({ icon: Icon, title, action, children, className = '' }: SectionCardProps) {
  return (
    <section
      className={`animate-fade-in rounded-2xl border border-surface-border bg-white p-4 shadow-card dark:border-surface-darkBorder dark:bg-surface-darkCard ${className}`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-brand-primary" strokeWidth={2.25} />}
          <h2 className="text-sm font-semibold text-text-primary dark:text-text-darkPrimary">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
