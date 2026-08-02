import type { PageAuditData } from '@/shared/types/page-data';
import type { CheckItem } from '@/shared/types/audit-result';
import { makeCheck, scoreFromChecks } from './rules/severity';
import { AI_SEVERITY_WEIGHTS, THRESHOLDS } from './rules/thresholds';

export function computeAiVisibilityChecks(data: PageAuditData): CheckItem[] {
  const { content, schema } = data;
  const checks: CheckItem[] = [];

  checks.push(
    makeCheck({
      id: 'ai-faq',
      category: 'ai',
      title: 'FAQ Section',
      description:
        content.hasFaqPattern || schema.hasFaqPage
          ? 'A FAQ section or FAQPage schema was detected.'
          : 'No FAQ section or FAQPage schema was found.',
      severity: content.hasFaqPattern || schema.hasFaqPage ? 'pass' : 'warning',
      whyItMatters: 'AI answer engines favor question-and-answer formatted content when generating direct responses.',
      suggestedFix: 'Add an FAQ section with FAQPage schema markup covering common questions.',
      estimatedImpact: 'High',
    }),
  );

  checks.push(
    makeCheck({
      id: 'ai-lists',
      category: 'ai',
      title: 'Lists',
      description:
        content.listCount > 0
          ? `${content.listCount} list${content.listCount === 1 ? '' : 's'} found on this page.`
          : 'No bulleted or numbered lists were found.',
      severity: content.listCount > 0 ? 'pass' : 'warning',
      whyItMatters: 'Lists are easy for AI systems to extract and summarize as discrete facts.',
      suggestedFix: 'Break dense information into bulleted or numbered lists where relevant.',
      estimatedImpact: 'Medium',
    }),
  );

  checks.push(
    makeCheck({
      id: 'ai-tables',
      category: 'ai',
      title: 'Tables',
      description:
        content.tableCount > 0
          ? `${content.tableCount} table${content.tableCount === 1 ? '' : 's'} found on this page.`
          : 'No structured tables were found.',
      severity: content.tableCount > 0 ? 'pass' : 'recommendation',
      whyItMatters: 'Tables give AI systems clean, structured data that is easy to extract for comparisons.',
      suggestedFix: 'Consider presenting comparative or structured data in a table.',
      estimatedImpact: 'Low',
    }),
  );

  checks.push(
    makeCheck({
      id: 'ai-organization-schema',
      category: 'ai',
      title: 'Organization Schema',
      description: schema.hasOrganization
        ? 'Organization schema markup was detected.'
        : 'No Organization schema markup was found.',
      severity: schema.hasOrganization ? 'pass' : 'warning',
      whyItMatters: 'Organization schema helps AI systems correctly identify and attribute your brand as an entity.',
      suggestedFix: 'Add Organization JSON-LD schema with your brand name, logo, and URL.',
      estimatedImpact: 'Medium',
    }),
  );

  checks.push(
    makeCheck({
      id: 'ai-author',
      category: 'ai',
      title: 'Author',
      description: content.hasAuthorSignal
        ? 'An author signal was detected.'
        : 'No author byline or schema was found.',
      severity: content.hasAuthorSignal ? 'pass' : 'warning',
      whyItMatters: 'Clear authorship is a trust (E-E-A-T) signal that AI systems weigh when selecting sources to cite.',
      suggestedFix: 'Add a visible author byline and/or Person schema markup.',
      estimatedImpact: 'Medium',
    }),
  );

  checks.push(
    makeCheck({
      id: 'ai-updated-date',
      category: 'ai',
      title: 'Updated Date',
      description: content.hasDateSignal
        ? 'A published or last-updated date was detected.'
        : 'No published or last-updated date was found.',
      severity: content.hasDateSignal ? 'pass' : 'warning',
      whyItMatters: 'Freshness signals help AI systems prefer current, reliable information over stale content.',
      suggestedFix: 'Display a visible "Last updated" date and add datePublished/dateModified schema.',
      estimatedImpact: 'Medium',
    }),
  );

  checks.push(
    makeCheck({
      id: 'ai-definitions',
      category: 'ai',
      title: 'Definitions',
      description: content.hasDefinitionPattern
        ? 'Definition-style content was detected.'
        : 'No clear definitions or glossary-style content was found.',
      severity: content.hasDefinitionPattern ? 'pass' : 'recommendation',
      whyItMatters: 'Clear "X is Y" style definitions are frequently lifted directly into AI-generated answers.',
      suggestedFix: 'Add concise definitions for key terms using clear "X is..." phrasing.',
      estimatedImpact: 'Low',
    }),
  );

  checks.push(
    makeCheck({
      id: 'ai-contact-info',
      category: 'ai',
      title: 'Contact Info',
      description: content.hasContactInfo
        ? 'Contact information was detected.'
        : 'No contact information was found on this page.',
      severity: content.hasContactInfo ? 'pass' : 'warning',
      whyItMatters: 'Visible contact details are a trust and entity-verification signal for both users and AI systems.',
      suggestedFix: 'Add a visible email, phone number, or link to a contact page.',
      estimatedImpact: 'Medium',
    }),
  );

  const entityRich = content.entityDensityHint >= THRESHOLDS.entityDensity.recommendation;
  checks.push(
    makeCheck({
      id: 'ai-entity-rich',
      category: 'ai',
      title: 'Entity-Rich Content',
      description: `Approx. ${content.entityDensityHint} named entities per 100 words.`,
      severity: entityRich ? 'pass' : 'recommendation',
      whyItMatters: 'Specific names, places, and brands help AI systems understand what your content is actually about.',
      suggestedFix: 'Reference specific names, products, places, or organizations rather than vague generalities.',
      estimatedImpact: 'Low',
    }),
  );

  const paraLen = content.avgParagraphLength;
  const readable =
    content.paragraphCount === 0
      ? false
      : paraLen <= THRESHOLDS.paragraphLength.warningMax &&
        paraLen >= THRESHOLDS.paragraphLength.recommendationMin;
  checks.push(
    makeCheck({
      id: 'ai-readable-paragraphs',
      category: 'ai',
      title: 'Readable Paragraphs',
      description:
        content.paragraphCount === 0
          ? 'No paragraph content was found to analyze.'
          : `Average paragraph length: ${paraLen} words.`,
      severity: content.paragraphCount === 0 ? 'warning' : readable ? 'pass' : 'warning',
      whyItMatters: 'Overly dense paragraphs are harder for AI systems to parse and extract into concise answers.',
      suggestedFix: `Aim for paragraphs under ${THRESHOLDS.paragraphLength.warningMax} words that focus on a single idea.`,
      estimatedImpact: 'Medium',
    }),
  );

  return checks;
}

export function computeAiVisibilityScore(checks: CheckItem[]): number {
  const relevant = checks.filter((c) => c.category === 'ai');
  return scoreFromChecks(relevant, AI_SEVERITY_WEIGHTS);
}
