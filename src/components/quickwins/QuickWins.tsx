import { Sparkles } from 'lucide-react';
import { SectionCard } from '@/components/ui/SectionCard';
import { CheckItem } from '@/components/ui/CheckItem';
import { useScanContext } from '@/popup/state/ScanContext';

export function QuickWins() {
  const { auditResult, setActiveTab } = useScanContext();
  if (!auditResult) return null;

  const wins = auditResult.quickWins;

  return (
    <SectionCard
      icon={Sparkles}
      title="Quick Wins"
      action={
        <button
          type="button"
          onClick={() => setActiveTab('onpage')}
          className="text-xs font-semibold text-brand-primary transition-colors duration-200 hover:text-brand-dark"
        >
          View All
        </button>
      }
    >
      {wins.length === 0 ? (
        <p className="text-xs text-text-secondary dark:text-text-darkSecondary">
          No critical issues found — nice work!
        </p>
      ) : (
        <div className="divide-y divide-surface-border dark:divide-surface-darkBorder">
          {wins.map((item) => (
            <CheckItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </SectionCard>
  );
}
