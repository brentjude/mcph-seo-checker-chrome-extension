import { Facebook, ImageOff, Link as LinkIcon, Twitter } from 'lucide-react';
import type { SocialPreviewData } from '@/shared/types/audit-result';

interface SocialPreviewCardProps {
  variant: 'facebook' | 'twitter';
  data: SocialPreviewData;
  domain: string;
}

const VARIANT_META = {
  facebook: { icon: Facebook, label: 'Facebook Open Graph' },
  twitter: { icon: Twitter, label: 'Twitter / X Card' },
} as const;

export function SocialPreviewCard({ variant, data, domain }: SocialPreviewCardProps) {
  const { icon: Icon, label } = VARIANT_META[variant];

  return (
    <div className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-card dark:border-surface-darkBorder dark:bg-surface-darkCard">
      <div className="flex items-center gap-2 border-b border-surface-border px-4 py-2.5 dark:border-surface-darkBorder">
        <Icon className="h-3.5 w-3.5 text-text-secondary dark:text-text-darkSecondary" strokeWidth={2.25} />
        <span className="text-xs font-medium text-text-secondary dark:text-text-darkSecondary">{label}</span>
      </div>

      <div className="aspect-[1.91/1] w-full bg-surface-light dark:bg-surface-darkBase">
        {data.image ? (
          <img src={data.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-text-secondary dark:text-text-darkSecondary">
            <ImageOff className="h-6 w-6" strokeWidth={1.75} />
            <span className="text-[11px] font-medium">No image found</span>
          </div>
        )}
      </div>

      <div className="space-y-1 px-4 py-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary dark:text-text-darkSecondary">
          {domain}
        </p>
        <p className="line-clamp-2 text-sm font-semibold text-text-primary dark:text-text-darkPrimary">
          {data.title || 'Untitled page'}
        </p>
        <p className="line-clamp-2 text-xs text-text-secondary dark:text-text-darkSecondary">
          {data.description || 'No description available.'}
        </p>
        {variant === 'twitter' && (
          <div className="flex items-center gap-1 pt-1 text-[11px] text-text-secondary dark:text-text-darkSecondary">
            <LinkIcon className="h-3 w-3" strokeWidth={2.25} />
            {domain}
          </div>
        )}
      </div>
    </div>
  );
}
