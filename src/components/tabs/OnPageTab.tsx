import { BarChart3, CheckCircle2, Clock, FileText, Heading, Image as ImageIcon, Sparkles } from 'lucide-react';
import { AccordionSection } from '@/components/ui/AccordionSection';
import { CheckItem } from '@/components/ui/CheckItem';
import { StatPill } from '@/components/ui/StatPill';
import { RecommendationCard } from '@/components/ui/RecommendationCard';
import { useScanContext } from '@/popup/state/ScanContext';
import type { CheckCategory, CheckItem as CheckItemType } from '@/shared/types/audit-result';

function byCategory(checks: CheckItemType[], category: CheckCategory) {
  return checks.filter((c) => c.category === category);
}

export function OnPageTab() {
  const { auditResult } = useScanContext();
  if (!auditResult) return null;

  const { checks, contentOverview } = auditResult;
  const metaChecks = byCategory(checks, 'meta');
  const headingChecks = byCategory(checks, 'headings');
  const imageChecks = byCategory(checks, 'images');
  const schemaChecks = byCategory(checks, 'schema');
  const recommendations = checks.filter((c) => c.severity !== 'pass' && c.category !== 'social');

  return (
    <div className="space-y-4 p-4">
      <AccordionSection icon={FileText} title="Meta Data">
        {metaChecks.map((item) => (
          <CheckItem key={item.id} item={item} />
        ))}
      </AccordionSection>

      <AccordionSection icon={Heading} title="Headings">
        {headingChecks.map((item) => (
          <CheckItem key={item.id} item={item} />
        ))}
      </AccordionSection>

      <AccordionSection icon={ImageIcon} title="Images">
        {imageChecks.length ? (
          imageChecks.map((item) => <CheckItem key={item.id} item={item} />)
        ) : (
          <p className="py-3 text-xs text-text-secondary dark:text-text-darkSecondary">
            No images found on this page.
          </p>
        )}
      </AccordionSection>

      <AccordionSection icon={Sparkles} title="Schema">
        {schemaChecks.map((item) => (
          <CheckItem key={item.id} item={item} />
        ))}
      </AccordionSection>

      <AccordionSection icon={BarChart3} title="Content Statistics">
        <div className="grid grid-cols-2 gap-3 py-3">
          <StatPill icon={FileText} value={contentOverview.wordCount} label="Word Count" />
          <StatPill icon={Clock} value={`${contentOverview.readingTimeMinutes} min`} label="Reading Time" />
        </div>
      </AccordionSection>

      <AccordionSection icon={CheckCircle2} title="Recommendations">
        {recommendations.length === 0 ? (
          <p className="py-3 text-xs text-text-secondary dark:text-text-darkSecondary">
            No open recommendations — this page is in great shape.
          </p>
        ) : (
          <div className="space-y-3 py-3">
            {recommendations.map((item) => (
              <RecommendationCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </AccordionSection>
    </div>
  );
}
