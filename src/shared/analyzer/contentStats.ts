import type { PageAuditData } from '@/shared/types/page-data';
import { THRESHOLDS } from './rules/thresholds';

export function computeContentOverview(data: PageAuditData) {
  const readingTimeMinutes = Math.max(
    1,
    Math.ceil(data.content.wordCount / THRESHOLDS.readingWpm),
  );

  return {
    wordCount: data.content.wordCount,
    images: data.images.total,
    internalLinks: data.links.internalCount,
    externalLinks: data.links.externalCount,
    readingTimeMinutes,
  };
}
