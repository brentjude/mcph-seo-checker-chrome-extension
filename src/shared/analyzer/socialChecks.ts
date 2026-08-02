import type { PageAuditData } from '@/shared/types/page-data';
import type {
  CheckItem,
  SocialPreviewData,
  Severity,
} from '@/shared/types/audit-result';
import { makeCheck } from './rules/severity';
import { THRESHOLDS } from './rules/thresholds';

interface SocialField {
  key: string;
  id: string;
  title: string;
  whyItMatters: string;
  suggestedFix: string;
  /** Optional extra validation once the tag is present (e.g. length recommendations). */
  presentCheck?: (value: string) => { severity: Severity; description: string } | null;
}

const ogDescriptionLengthCheck = (value: string) => {
  if (value.length < THRESHOLDS.metaDescription.max) {
    return {
      severity: 'warning' as Severity,
      description: `Description is ${value.length} characters. Recommended: ${THRESHOLDS.metaDescription.max}+ for Facebook previews.`,
    };
  }
  return null;
};

const OG_FIELDS: SocialField[] = [
  {
    key: 'og:title',
    id: 'og-title',
    title: 'og:title',
    whyItMatters: 'Controls the headline shown when this page is shared on Facebook, LinkedIn, and other platforms.',
    suggestedFix: 'Add an og:title meta tag with a compelling, share-worthy headline.',
  },
  {
    key: 'og:description',
    id: 'og-description',
    title: 'og:description',
    whyItMatters: 'Controls the summary text shown beneath the title in social previews.',
    suggestedFix: 'Add an og:description meta tag, ideally 60-160 characters.',
    presentCheck: ogDescriptionLengthCheck,
  },
  {
    key: 'og:image',
    id: 'og-image',
    title: 'og:image',
    whyItMatters: 'Without an image, social previews render as plain text and get far fewer clicks.',
    suggestedFix: 'Add an og:image tag pointing to a 1200x630px image.',
  },
  {
    key: 'og:type',
    id: 'og-type',
    title: 'og:type',
    whyItMatters: 'Recommended to set as "website" or "article" for semantic clarity.',
    suggestedFix: 'Add an og:type meta tag (e.g. "website" or "article").',
  },
];

const TWITTER_FIELDS: SocialField[] = [
  {
    key: 'twitter:card',
    id: 'twitter-card',
    title: 'twitter:card',
    whyItMatters: 'Determines the card layout (summary vs. large image) used when shared on X/Twitter.',
    suggestedFix: 'Add a twitter:card tag, typically "summary_large_image".',
  },
  {
    key: 'twitter:title',
    id: 'twitter-title',
    title: 'twitter:title',
    whyItMatters: 'Controls the headline shown in the X/Twitter card preview.',
    suggestedFix: 'Add a twitter:title meta tag.',
  },
  {
    key: 'twitter:image',
    id: 'twitter-image',
    title: 'twitter:image',
    whyItMatters: 'Without an image, the card renders as text-only and gets far less engagement.',
    suggestedFix: 'Add a twitter:image meta tag.',
  },
  {
    key: 'twitter:site',
    id: 'twitter-site',
    title: 'twitter:site',
    whyItMatters: 'The @username for the website used in the card footer is missing.',
    suggestedFix: 'Add a twitter:site meta tag with your brand\'s @username.',
  },
];

function buildFieldChecks(
  fields: SocialField[],
  source: Record<string, string>,
): CheckItem[] {
  return fields.map((field) => {
    const value = source[field.key];
    if (!value) {
      return makeCheck({
        id: field.id,
        category: 'social',
        title: field.title,
        description: field.whyItMatters,
        severity: 'critical',
        statusLabel: 'MISSING',
        whyItMatters: field.whyItMatters,
        suggestedFix: field.suggestedFix,
        estimatedImpact: 'Medium',
      });
    }

    const flagged = field.presentCheck?.(value);
    if (flagged) {
      return makeCheck({
        id: field.id,
        category: 'social',
        title: field.title,
        description: flagged.description,
        severity: flagged.severity,
        whyItMatters: field.whyItMatters,
        suggestedFix: field.suggestedFix,
        estimatedImpact: 'Low',
      });
    }

    return makeCheck({
      id: field.id,
      category: 'social',
      title: field.title,
      description: value,
      severity: 'pass',
    });
  });
}

export function computeSocialChecks(data: PageAuditData): CheckItem[] {
  return [
    ...buildFieldChecks(OG_FIELDS, data.openGraph),
    ...buildFieldChecks(TWITTER_FIELDS, data.twitterCard),
  ];
}

export function buildSocialPreviews(data: PageAuditData): {
  facebook: SocialPreviewData;
  twitter: SocialPreviewData;
} {
  const { openGraph, twitterCard, meta } = data;

  const facebook: SocialPreviewData = {
    title: openGraph['og:title'] || meta.title,
    description: openGraph['og:description'] || meta.description,
    image: openGraph['og:image'] || null,
  };

  const twitter: SocialPreviewData = {
    title: twitterCard['twitter:title'] || openGraph['og:title'] || meta.title,
    description:
      twitterCard['twitter:description'] || openGraph['og:description'] || meta.description,
    image: twitterCard['twitter:image'] || openGraph['og:image'] || null,
  };

  return { facebook, twitter };
}
