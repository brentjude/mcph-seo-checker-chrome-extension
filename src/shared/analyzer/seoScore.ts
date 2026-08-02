import type { PageAuditData } from '@/shared/types/page-data';
import type { CheckItem } from '@/shared/types/audit-result';
import { makeCheck, scoreFromChecks } from './rules/severity';
import { SEO_SEVERITY_WEIGHTS, THRESHOLDS } from './rules/thresholds';

export function computeSeoChecks(data: PageAuditData): CheckItem[] {
  const checks: CheckItem[] = [];
  const { title, titleLength, description, descriptionLength, canonical, robots, viewport } =
    data.meta;

  // --- Title ---
  if (!title) {
    checks.push(
      makeCheck({
        id: 'title-missing',
        category: 'meta',
        title: 'Missing Page Title',
        description: 'No <title> tag was found on this page.',
        severity: 'critical',
        whyItMatters:
          'The title tag is the single most important on-page SEO signal and what appears as the clickable headline in search results.',
        suggestedFix: 'Add a unique, descriptive title between 30-60 characters.',
        estimatedImpact: 'High',
      }),
    );
  } else if (titleLength < THRESHOLDS.title.min || titleLength > THRESHOLDS.title.max) {
    checks.push(
      makeCheck({
        id: 'title-length',
        category: 'meta',
        title: 'Title Length',
        description: `Length: ${titleLength} characters`,
        severity: 'warning',
        whyItMatters: `Titles outside ${THRESHOLDS.title.min}-${THRESHOLDS.title.max} characters may be truncated or fail to communicate relevance in search results.`,
        suggestedFix: `Rewrite the title to fall between ${THRESHOLDS.title.min} and ${THRESHOLDS.title.max} characters.`,
        estimatedImpact: 'Medium',
      }),
    );
  } else {
    checks.push(
      makeCheck({
        id: 'title-length',
        category: 'meta',
        title: 'Page Title',
        description: `Length: ${titleLength} characters`,
        severity: 'pass',
      }),
    );
  }

  // --- Meta description ---
  if (!description) {
    checks.push(
      makeCheck({
        id: 'meta-description-missing',
        category: 'meta',
        title: 'Missing Meta Description',
        description: 'This page is missing a meta description which may reduce search CTR.',
        severity: 'critical',
        whyItMatters:
          'Search engines often use the meta description as the snippet shown under your title — a missing one hurts click-through rate.',
        suggestedFix: 'Add a compelling 140-160 character description.',
        estimatedImpact: 'High',
      }),
    );
  } else if (
    descriptionLength < THRESHOLDS.metaDescription.min ||
    descriptionLength > THRESHOLDS.metaDescription.max
  ) {
    checks.push(
      makeCheck({
        id: 'meta-description-length',
        category: 'meta',
        title: 'Meta Description',
        description: `Length: ${descriptionLength} characters. Recommended: ${THRESHOLDS.metaDescription.min}-${THRESHOLDS.metaDescription.max}+ for Facebook previews.`,
        severity: 'warning',
        whyItMatters: 'Descriptions outside the ideal range get truncated or waste an opportunity to sell the click.',
        suggestedFix: `Rewrite to ${THRESHOLDS.metaDescription.min}-${THRESHOLDS.metaDescription.max} characters.`,
        estimatedImpact: 'Medium',
      }),
    );
  } else {
    checks.push(
      makeCheck({
        id: 'meta-description-length',
        category: 'meta',
        title: 'Meta Description',
        description: `Length: ${descriptionLength} characters`,
        severity: 'pass',
      }),
    );
  }

  // --- Canonical ---
  if (!canonical) {
    checks.push(
      makeCheck({
        id: 'canonical-missing',
        category: 'meta',
        title: 'Missing Canonical Tag',
        description: 'No canonical URL detected.',
        severity: 'critical',
        whyItMatters: 'Without a canonical tag, search engines may index duplicate versions of this page and dilute ranking signals.',
        suggestedFix: 'Add a self-referencing <link rel="canonical"> tag.',
        estimatedImpact: 'High',
      }),
    );
  } else {
    checks.push(
      makeCheck({
        id: 'canonical-present',
        category: 'meta',
        title: 'Canonical Tag',
        description: canonical,
        severity: 'pass',
      }),
    );
  }

  // --- Robots ---
  if (robots && /noindex/i.test(robots)) {
    checks.push(
      makeCheck({
        id: 'robots-noindex',
        category: 'meta',
        title: 'Page Set to Noindex',
        description: `Robots meta tag: "${robots}"`,
        severity: 'critical',
        whyItMatters: 'A noindex directive tells search engines to exclude this page from search results entirely.',
        suggestedFix: 'Remove the noindex directive if this page should be discoverable in search.',
        estimatedImpact: 'High',
      }),
    );
  }

  // --- Viewport ---
  if (!viewport) {
    checks.push(
      makeCheck({
        id: 'viewport-missing',
        category: 'meta',
        title: 'Missing Viewport Tag',
        description: 'No responsive viewport meta tag was found.',
        severity: 'warning',
        whyItMatters: 'Mobile-friendliness is a ranking factor; without a viewport tag, mobile rendering and mobile SEO suffer.',
        suggestedFix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.',
        estimatedImpact: 'Medium',
      }),
    );
  }

  // --- Headings ---
  const { h1, hierarchyIssues } = data.headings;
  if (h1.length === 0) {
    checks.push(
      makeCheck({
        id: 'h1-missing',
        category: 'headings',
        title: 'Missing H1',
        description: 'No H1 heading was found on this page.',
        severity: 'critical',
        whyItMatters: 'The H1 tells both users and search engines the primary topic of the page.',
        suggestedFix: 'Add a single, descriptive H1 heading.',
        estimatedImpact: 'High',
      }),
    );
  } else if (h1.length > 1) {
    checks.push(
      makeCheck({
        id: 'h1-multiple',
        category: 'headings',
        title: 'Improve H1 Structure',
        description: `Found ${h1.length} H1 headings on this page.`,
        severity: 'warning',
        whyItMatters: 'Multiple H1s can dilute topical focus and confuse the page hierarchy for search engines.',
        suggestedFix: 'Use a single H1 for the main page topic and H2/H3 for subsections.',
        estimatedImpact: 'Medium',
      }),
    );
  } else {
    checks.push(
      makeCheck({
        id: 'h1-present',
        category: 'headings',
        title: 'H1 Heading',
        description: h1[0],
        severity: 'pass',
      }),
    );
  }

  if (hierarchyIssues) {
    checks.push(
      makeCheck({
        id: 'heading-hierarchy',
        category: 'headings',
        title: 'Heading Hierarchy Skips a Level',
        description: 'An H3 appears before any H2 in the document.',
        severity: 'warning',
        whyItMatters: 'Skipping heading levels breaks the logical outline of the page for accessibility tools and search engines.',
        suggestedFix: 'Reorder headings so levels descend sequentially (H1 → H2 → H3).',
        estimatedImpact: 'Low',
      }),
    );
  }

  // --- Images ---
  const { total: totalImages, missingAlt } = data.images;
  if (totalImages > 0) {
    const missingRatio = missingAlt / totalImages;
    if (missingRatio >= THRESHOLDS.altTextMissingRatio.critical) {
      checks.push(
        makeCheck({
          id: 'images-alt-critical',
          category: 'images',
          title: 'Images Missing Alt Text',
          description: `${totalImages} images, ${missingAlt} missing ALT`,
          severity: 'critical',
          whyItMatters: 'Alt text helps search engines understand images and is essential for screen-reader accessibility.',
          suggestedFix: 'Add descriptive alt attributes to all meaningful images.',
          estimatedImpact: 'High',
        }),
      );
    } else if (missingRatio >= THRESHOLDS.altTextMissingRatio.warning) {
      checks.push(
        makeCheck({
          id: 'images-alt-warning',
          category: 'images',
          title: 'Images',
          description: `${totalImages} images, ${missingAlt} missing ALT`,
          severity: 'warning',
          whyItMatters: 'Missing alt text on a portion of your images still limits accessibility and image-search visibility.',
          suggestedFix: 'Fill in alt text for the remaining images without one.',
          estimatedImpact: 'Medium',
        }),
      );
    } else {
      checks.push(
        makeCheck({
          id: 'images-alt-pass',
          category: 'images',
          title: 'Images',
          description: `${totalImages} images, ${missingAlt} missing ALT`,
          severity: 'pass',
        }),
      );
    }
  }

  // --- Links ---
  if (data.links.internalCount === 0) {
    checks.push(
      makeCheck({
        id: 'links-no-internal',
        category: 'links',
        title: 'No Internal Links Found',
        description: 'This page does not link to any other pages on the same site.',
        severity: 'warning',
        whyItMatters: 'Internal links distribute ranking authority and help both users and crawlers discover related content.',
        suggestedFix: 'Add links to relevant related pages on your site.',
        estimatedImpact: 'Medium',
      }),
    );
  } else {
    checks.push(
      makeCheck({
        id: 'links-internal-pass',
        category: 'links',
        title: 'Internal Links',
        description: `${data.links.internalCount} internal links found`,
        severity: 'pass',
      }),
    );
  }

  if (data.links.brokenAnchorCount > 0) {
    checks.push(
      makeCheck({
        id: 'links-broken-anchors',
        category: 'links',
        title: 'Fix Broken Links',
        description: `Found ${data.links.brokenAnchorCount} dead internal links pointing to empty or "#" anchors.`,
        severity: 'critical',
        whyItMatters: 'Broken or empty anchor links waste crawl budget and create dead ends for users.',
        suggestedFix: 'Point each link to a valid destination or remove it.',
        estimatedImpact: 'Medium',
      }),
    );
  }

  // --- Schema / structured data ---
  if (data.schema.jsonLdBlocks.length === 0) {
    checks.push(
      makeCheck({
        id: 'schema-missing',
        category: 'schema',
        title: 'No Structured Data Found',
        description: 'This page has no JSON-LD structured data.',
        severity: 'warning',
        whyItMatters: 'Structured data helps search engines and AI systems understand entities, articles, and rich-result eligibility.',
        suggestedFix: 'Add JSON-LD schema relevant to this page (Organization, Article, FAQPage, etc).',
        estimatedImpact: 'Medium',
      }),
    );
  } else {
    checks.push(
      makeCheck({
        id: 'schema-present',
        category: 'schema',
        title: 'Structured Data',
        description: `${data.schema.jsonLdBlocks.length} JSON-LD block${data.schema.jsonLdBlocks.length === 1 ? '' : 's'} found on this page.`,
        severity: 'pass',
      }),
    );
  }

  checks.push(
    makeCheck({
      id: 'schema-breadcrumb',
      category: 'schema',
      title: 'Breadcrumb Schema',
      description: data.schema.hasBreadcrumb
        ? 'BreadcrumbList schema was detected.'
        : 'No BreadcrumbList schema was found.',
      severity: data.schema.hasBreadcrumb ? 'pass' : 'recommendation',
      whyItMatters: 'Breadcrumb schema can surface a navigable trail directly in search results.',
      suggestedFix: 'Add BreadcrumbList JSON-LD schema reflecting this page\'s position in your site hierarchy.',
      estimatedImpact: 'Low',
    }),
  );

  return checks;
}

export function computeSeoScore(checks: CheckItem[]): number {
  const relevant = checks.filter((c) => c.category !== 'ai' && c.category !== 'social');
  return scoreFromChecks(relevant, SEO_SEVERITY_WEIGHTS);
}
