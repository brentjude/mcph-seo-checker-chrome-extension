import { Bot, Clock, ExternalLink, FileText, Image as ImageIcon, Link2, Search } from 'lucide-react';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { SummaryCards } from '@/components/ui/SummaryCards';
import { SectionCard } from '@/components/ui/SectionCard';
import { StatPill } from '@/components/ui/StatPill';
import { QuickWins } from '@/components/quickwins/QuickWins';
import { useScanContext } from '@/popup/state/ScanContext';
import { relativeTimeFromNow } from '@/shared/utils/format';

export function OverviewTab() {
  const { auditResult } = useScanContext();
  if (!auditResult) return null;

  const { seoScore, healthLabel, auditedAt, counts, contentOverview } = auditResult;

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col items-center gap-1.5 py-2">
        <ScoreRing score={seoScore} label="SEO Score" size={176} />
        <p className="text-sm font-semibold text-text-primary dark:text-text-darkPrimary">
          Website Health: <span className="text-brand-primary">{healthLabel}</span>
        </p>
        <p className="text-xs text-text-secondary dark:text-text-darkSecondary">
          Last audited: {relativeTimeFromNow(auditedAt)}
        </p>
      </div>

      <SummaryCards critical={counts.critical} warning={counts.warning} passed={counts.passed} />

      <QuickWins />

      <SectionCard icon={Search} title="SEO Overview">
        <div className="grid grid-cols-2 gap-3">
          <StatPill icon={Search} value={contentOverview.seoScore} label="SEO Score" />
          <StatPill icon={Bot} value={contentOverview.aiVisibilityScore} label="AI Visibility" />
          <StatPill icon={FileText} value={contentOverview.wordCount} label="Word Count" />
          <StatPill icon={ImageIcon} value={contentOverview.images} label="Images" />
          <StatPill icon={Link2} value={contentOverview.internalLinks} label="Internal Links" />
          <StatPill icon={ExternalLink} value={contentOverview.externalLinks} label="External Links" />
          <StatPill icon={Clock} value={`${contentOverview.readingTimeMinutes} min`} label="Reading Time" />
        </div>
      </SectionCard>
    </div>
  );
}
