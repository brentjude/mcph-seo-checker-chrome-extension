import { ClipboardList, RotateCw } from 'lucide-react';
import { SectionCard } from '@/components/ui/SectionCard';
import { CheckItem } from '@/components/ui/CheckItem';
import type { CheckItem as CheckItemType } from '@/shared/types/audit-result';

interface MetadataChecklistProps {
  checks: CheckItemType[];
  onRerun: () => void;
  isRefreshing: boolean;
}

export function MetadataChecklist({ checks, onRerun, isRefreshing }: MetadataChecklistProps) {
  return (
    <SectionCard icon={ClipboardList} title="Metadata Checklist">
      <div className="divide-y divide-surface-border dark:divide-surface-darkBorder">
        {checks.map((item) => (
          <CheckItem key={item.id} item={item} />
        ))}
      </div>
      <button
        type="button"
        onClick={onRerun}
        disabled={isRefreshing}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-brand-primary py-2.5 text-sm font-semibold text-brand-primary transition-colors duration-200 hover:bg-brand-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RotateCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} strokeWidth={2.25} />
        Re-run Social Audit
      </button>
    </SectionCard>
  );
}
