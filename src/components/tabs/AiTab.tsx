import { Bot } from 'lucide-react';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { SectionCard } from '@/components/ui/SectionCard';
import { CheckItem } from '@/components/ui/CheckItem';
import { useScanContext } from '@/popup/state/ScanContext';

export function AiTab() {
  const { auditResult } = useScanContext();
  if (!auditResult) return null;

  const aiChecks = auditResult.checks.filter((c) => c.category === 'ai');

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col items-center gap-1.5 py-2">
        <ScoreRing score={auditResult.aiVisibilityScore} label="AI Visibility" size={152} />
        <p className="max-w-[280px] text-center text-xs text-text-secondary dark:text-text-darkSecondary">
          How well this page is structured for AI answer engines like ChatGPT, Perplexity, and Google AI Overviews.
        </p>
      </div>

      <SectionCard icon={Bot} title="AI Readiness">
        <div className="divide-y divide-surface-border dark:divide-surface-darkBorder">
          {aiChecks.map((item) => (
            <CheckItem key={item.id} item={item} />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
