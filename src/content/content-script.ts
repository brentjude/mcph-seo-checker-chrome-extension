import type { PageAuditData } from '@/shared/types/page-data';

/**
 * Extracts raw SEO/AI-visibility facts from the current document.
 *
 * This function is injected into the active tab via
 * `chrome.scripting.executeScript({ func: extractPageData })` (see useScan.ts).
 * Because MV3 function-injection serializes only this function's own source
 * text, every helper it needs must be a NESTED declaration inside this
 * function body — it cannot call out to other modules or close over
 * anything outside its own scope. Only DOM/browser globals (document,
 * window, location, JSON, RegExp, ...) are available at injection time.
 */
export function extractPageData(): PageAuditData {
  function text(el: Element | null): string {
    return (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
  }

  function attr(el: Element | null, name: string): string | null {
    return el?.getAttribute(name) ?? null;
  }

  function absoluteUrl(href: string | null): string | null {
    if (!href) return null;
    try {
      return new URL(href, document.baseURI).href;
    } catch {
      return null;
    }
  }

  function extractMeta() {
    const titleEl = document.querySelector('title');
    const descEl = document.querySelector('meta[name="description"]');
    const canonicalEl = document.querySelector('link[rel="canonical"]');
    const robotsEl = document.querySelector('meta[name="robots"]');
    const viewportEl = document.querySelector('meta[name="viewport"]');
    const charsetEl = document.querySelector('meta[charset]');

    const title = text(titleEl) || null;
    const description = attr(descEl, 'content');

    return {
      title,
      titleLength: title?.length ?? 0,
      description,
      descriptionLength: description?.length ?? 0,
      canonical: absoluteUrl(attr(canonicalEl, 'href')),
      robots: attr(robotsEl, 'content'),
      viewport: attr(viewportEl, 'content'),
      charset: attr(charsetEl, 'charset') ?? document.characterSet ?? null,
      lang: document.documentElement.lang || null,
    };
  }

  function extractHeadings() {
    const h1 = Array.from(document.querySelectorAll('h1'))
      .map((el) => text(el))
      .filter(Boolean);
    const h2Count = document.querySelectorAll('h2').length;
    const h3Count = document.querySelectorAll('h3').length;
    const h4PlusCount = document.querySelectorAll('h4, h5, h6').length;

    let hierarchyIssues = false;
    let sawH2 = false;
    const ordered = Array.from(
      document.querySelectorAll('h1, h2, h3, h4, h5, h6'),
    );
    for (const el of ordered) {
      const level = Number(el.tagName[1]);
      if (level === 2) sawH2 = true;
      if (level === 3 && !sawH2) hierarchyIssues = true;
    }

    return { h1, h2Count, h3Count, h4PlusCount, hierarchyIssues };
  }

  function extractImages() {
    const images = Array.from(document.querySelectorAll('img'));
    const missing = images.filter((img) => {
      const alt = img.getAttribute('alt');
      return alt === null || alt.trim() === '';
    });
    const withLazyLoading = images.filter(
      (img) => img.getAttribute('loading') === 'lazy',
    ).length;

    return {
      total: images.length,
      missingAlt: missing.length,
      missingAltSrcs: missing
        .slice(0, 5)
        .map((img) => img.getAttribute('src') || '')
        .filter(Boolean),
      withLazyLoading,
    };
  }

  function extractLinks() {
    const anchors = Array.from(document.querySelectorAll('a[href]'));
    let internalCount = 0;
    let externalCount = 0;
    let nofollowCount = 0;
    let brokenAnchorCount = 0;
    const currentHost = location.hostname;

    for (const a of anchors) {
      const href = a.getAttribute('href') || '';
      const rel = a.getAttribute('rel') || '';
      if (rel.split(/\s+/).includes('nofollow')) nofollowCount++;

      if (
        href.trim() === '' ||
        href.trim() === '#' ||
        href.trim().toLowerCase() === 'javascript:void(0)'
      ) {
        brokenAnchorCount++;
        continue;
      }

      const resolved = absoluteUrl(href);
      if (!resolved) continue;

      try {
        const host = new URL(resolved).hostname;
        if (host === currentHost) internalCount++;
        else externalCount++;
      } catch {
        // ignore unparseable hrefs (mailto:, tel:, etc. are neither internal nor external links)
      }
    }

    return { internalCount, externalCount, nofollowCount, brokenAnchorCount };
  }

  function extractSchema() {
    const scripts = Array.from(
      document.querySelectorAll('script[type="application/ld+json"]'),
    );
    const jsonLdBlocks: Array<{
      type: string | string[] | null;
      raw: string;
    }> = [];

    let hasOrganization = false;
    let hasFaqPage = false;
    let hasArticleOrBlogPosting = false;
    let hasBreadcrumb = false;

    const checkType = (type: unknown) => {
      const types = Array.isArray(type) ? type : [type];
      const lower = types
        .filter((t): t is string => typeof t === 'string')
        .map((t) => t.toLowerCase());
      if (lower.includes('organization')) hasOrganization = true;
      if (lower.includes('faqpage')) hasFaqPage = true;
      if (lower.includes('article') || lower.includes('blogposting'))
        hasArticleOrBlogPosting = true;
      if (lower.includes('breadcrumblist')) hasBreadcrumb = true;
    };

    for (const script of scripts) {
      const raw = script.textContent || '';
      jsonLdBlocks.push({ type: null, raw: raw.slice(0, 500) });
      try {
        const parsed = JSON.parse(raw);
        const nodes = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed?.['@graph'])
            ? parsed['@graph']
            : [parsed];
        for (const node of nodes) {
          if (node && typeof node === 'object' && '@type' in node) {
            checkType((node as Record<string, unknown>)['@type']);
            jsonLdBlocks[jsonLdBlocks.length - 1].type = (
              node as Record<string, unknown>
            )['@type'] as string | string[] | null;
          }
        }
      } catch {
        // malformed JSON-LD block; leave type as null and move on
      }
    }

    return {
      jsonLdBlocks,
      hasOrganization,
      hasFaqPage,
      hasArticleOrBlogPosting,
      hasBreadcrumb,
    };
  }

  function extractSocial() {
    const openGraph: Record<string, string> = {};
    document
      .querySelectorAll('meta[property^="og:"]')
      .forEach((el) => {
        const property = el.getAttribute('property');
        const content = el.getAttribute('content');
        if (property && content) openGraph[property] = content;
      });

    const twitterCard: Record<string, string> = {};
    document
      .querySelectorAll('meta[name^="twitter:"]')
      .forEach((el) => {
        const name = el.getAttribute('name');
        const content = el.getAttribute('content');
        if (name && content) twitterCard[name] = content;
      });

    return { openGraph, twitterCard };
  }

  function getMainContentRoot(): Element {
    const candidate =
      document.querySelector('main') ||
      document.querySelector('article') ||
      document.body;
    return candidate;
  }

  function extractContentStats(schema: ReturnType<typeof extractSchema>) {
    const root = getMainContentRoot();
    const clone = root.cloneNode(true) as Element;
    clone
      .querySelectorAll('script, style, nav, header, footer, noscript')
      .forEach((el) => el.remove());

    const bodyText = text(clone);
    const words = bodyText.split(' ').filter(Boolean);
    const wordCount = words.length;
    const textSample = bodyText.slice(0, 500);

    const listCount = clone.querySelectorAll('ul, ol').length;
    const tableCount = clone.querySelectorAll('table').length;

    const paragraphs = Array.from(clone.querySelectorAll('p'))
      .map((p) => text(p))
      .filter((t) => t.length > 0);
    const paragraphCount = paragraphs.length;
    const avgParagraphLength = paragraphCount
      ? Math.round(
          paragraphs.reduce((sum, p) => sum + p.split(' ').length, 0) /
            paragraphCount,
        )
      : 0;

    const lowerText = bodyText.toLowerCase();
    const hasFaqPattern =
      schema.hasFaqPage ||
      /frequently asked questions|\bfaqs?\b/.test(lowerText) ||
      Array.from(document.querySelectorAll('h2, h3')).some((h) =>
        /frequently asked questions|\bfaq\b/i.test(text(h)),
      );

    const hasAuthorSignal =
      !!document.querySelector(
        'meta[name="author"], [rel="author"], [itemprop="author"], [class*="author" i], [class*="byline" i]',
      ) || /"author"\s*:/i.test(document.body.innerHTML.slice(0, 20000));

    const hasDateSignal =
      !!document.querySelector('time') ||
      !!document.querySelector(
        'meta[property="article:modified_time"], meta[property="article:published_time"]',
      ) ||
      /datepublished|datemodified/i.test(
        document.body.innerHTML.slice(0, 20000),
      );

    const hasDefinitionPattern =
      !!clone.querySelector('dl, dt') ||
      /\bis defined as\b|\brefers to\b|\bis a term (used|for)\b/i.test(
        bodyText,
      );

    const hasContactInfo =
      !!document.querySelector('a[href^="mailto:"], a[href^="tel:"]') ||
      !!document.querySelector('a[href*="contact" i]') ||
      /[\w.+-]+@[\w-]+\.[a-z]{2,}/i.test(bodyText) ||
      /\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(bodyText);

    const properNounMatches = bodyText.match(
      /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})\b/g,
    );
    const entityDensityHint =
      wordCount > 0
        ? Math.round(
            ((properNounMatches?.length ?? 0) / wordCount) * 100 * 10,
          ) / 10
        : 0;

    return {
      wordCount,
      textSample,
      hasFaqPattern,
      listCount,
      tableCount,
      paragraphCount,
      avgParagraphLength,
      hasAuthorSignal,
      hasDateSignal,
      hasDefinitionPattern,
      hasContactInfo,
      entityDensityHint,
    };
  }

  function extractFavicon(): string | null {
    const iconEl = document.querySelector(
      'link[rel~="icon"], link[rel="shortcut icon"]',
    );
    const href = attr(iconEl, 'href');
    return absoluteUrl(href) ?? `${location.origin}/favicon.ico`;
  }

  const schema = extractSchema();
  const { openGraph, twitterCard } = extractSocial();

  return {
    url: location.href,
    domain: location.hostname,
    favicon: extractFavicon(),
    meta: extractMeta(),
    headings: extractHeadings(),
    images: extractImages(),
    links: extractLinks(),
    schema,
    openGraph,
    twitterCard,
    content: extractContentStats(schema),
  };
}
