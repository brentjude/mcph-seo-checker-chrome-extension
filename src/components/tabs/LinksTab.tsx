import { ExternalLink, Link2 } from 'lucide-react';
import { SectionCard } from '@/components/ui/SectionCard';
import { StatPill } from '@/components/ui/StatPill';
import { CheckItem } from '@/components/ui/CheckItem';
import { useScanContext } from '@/popup/state/ScanContext';

export function LinksTab() {
  const { auditResult } = useScanContext();
  if (!auditResult) return null;

  const linkChecks = auditResult.checks.filter((c) => c.category === 'links');
  const { internalLinks, externalLinks } = auditResult.contentOverview;

  return (
    <div className="space-y-4 p-4">
      <SectionCard icon={Link2} title="Links">
        <div className="mb-4 grid grid-cols-2 gap-3">
          <StatPill icon={Link2} value={internalLinks} label="Internal Links" />
          <StatPill icon={ExternalLink} value={externalLinks} label="External Links" />
        </div>
        <div className="divide-y divide-surface-border dark:divide-surface-darkBorder">
          {linkChecks.map((item) => (
            <CheckItem key={item.id} item={item} />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
