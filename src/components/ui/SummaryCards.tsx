interface SummaryCardsProps {
  critical: number;
  warning: number;
  passed: number;
}

const CARDS = [
  { key: 'critical', label: 'Critical', colorClass: 'text-status-critical' },
  { key: 'warning', label: 'Warnings', colorClass: 'text-status-warning' },
  { key: 'passed', label: 'Passed', colorClass: 'text-status-success' },
] as const;

export function SummaryCards({ critical, warning, passed }: SummaryCardsProps) {
  const values = { critical, warning, passed };

  return (
    <div className="grid grid-cols-3 gap-3">
      {CARDS.map((card) => (
        <div
          key={card.key}
          className="animate-fade-in rounded-2xl border border-surface-border bg-white p-4 text-center shadow-card dark:border-surface-darkBorder dark:bg-surface-darkCard"
        >
          <p className={`text-2xl font-semibold ${card.colorClass}`}>{values[card.key]}</p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-text-secondary dark:text-text-darkSecondary">
            {card.label}
          </p>
        </div>
      ))}
    </div>
  );
}
