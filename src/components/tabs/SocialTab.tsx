import { useState } from 'react';
import { SocialPreviewCard } from '@/components/social/SocialPreviewCard';
import { MetadataChecklist } from '@/components/social/MetadataChecklist';
import { useScanContext } from '@/popup/state/ScanContext';

export function SocialTab() {
  const { auditResult, tabInfo, refresh, status } = useScanContext();
  const [rerunning, setRerunning] = useState(false);

  if (!auditResult || !tabInfo) return null;

  const socialChecks = auditResult.checks.filter((c) => c.category === 'social');

  const handleRerun = () => {
    setRerunning(true);
    refresh();
  };

  const isRefreshing = rerunning && status === 'scanning';

  return (
    <div className="space-y-4 p-4">
      <SocialPreviewCard variant="facebook" data={auditResult.social.facebook} domain={tabInfo.domain} />
      <SocialPreviewCard variant="twitter" data={auditResult.social.twitter} domain={tabInfo.domain} />
      <MetadataChecklist checks={socialChecks} onRerun={handleRerun} isRefreshing={isRefreshing} />
    </div>
  );
}
