import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { PageAuditData } from '@/shared/types/page-data';
import type { AuditResult, CheckCategory, CheckItem } from '@/shared/types/audit-result';

const BRAND_GREEN = '#3BAE5D';
const BRAND_DARK = '#2D8A49';
const TEXT_PRIMARY = '#111827';
const TEXT_SECONDARY = '#6B7280';

const STATUS_COLORS: Record<string, string> = {
  pass: '#22C55E',
  warning: '#F59E0B',
  critical: '#EF4444',
  recommendation: '#3BAE5D',
};

const CATEGORY_LABELS: Record<CheckCategory, string> = {
  meta: 'Meta Data',
  headings: 'Headings',
  images: 'Images',
  links: 'Links',
  schema: 'Schema',
  social: 'Social Metadata',
  ai: 'AI Readiness',
};

const CATEGORY_ORDER: CheckCategory[] = [
  'meta',
  'headings',
  'images',
  'links',
  'schema',
  'ai',
  'social',
];

const MARGIN = 40;
const PAGE_BREAK_Y = 700;

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function byCategory(checks: CheckItem[], category: CheckCategory): CheckItem[] {
  return checks.filter((c) => c.category === category);
}

/** Returns the y position autoTable's last table finished at, on whichever page it ended up on. */
function lastTableFinalY(doc: jsPDF): number {
  const withTable = doc as jsPDF & { lastAutoTable?: { finalY: number } };
  return withTable.lastAutoTable?.finalY ?? MARGIN;
}

function ensureSpace(doc: jsPDF, y: number, minRequired = 60): number {
  if (y > PAGE_BREAK_Y - minRequired) {
    doc.addPage();
    return MARGIN + 20;
  }
  return y;
}

function drawSectionHeading(doc: jsPDF, title: string, y: number): number {
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRgb(TEXT_PRIMARY));
  doc.text(title, MARGIN, y);
  return y + 10;
}

function drawChecksTable(doc: jsPDF, title: string, checks: CheckItem[], y: number): number {
  if (checks.length === 0) return y;

  y = ensureSpace(doc, y, 80);
  y = drawSectionHeading(doc, title, y);

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [['Status', 'Check', 'Details']],
    body: checks.map((c) => [(c.statusLabel ?? c.severity).toUpperCase(), c.title, c.description]),
    styles: { fontSize: 9, cellPadding: 6, textColor: hexToRgb(TEXT_PRIMARY) },
    headStyles: { fillColor: hexToRgb(BRAND_DARK), textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: { 0: { cellWidth: 70 }, 1: { cellWidth: 140 } },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 0) {
        const severity = checks[data.row.index]?.severity;
        data.cell.styles.textColor = hexToRgb(STATUS_COLORS[severity] ?? TEXT_SECONDARY);
        data.cell.styles.fontStyle = 'bold';
      }
    },
  });

  return lastTableFinalY(doc) + 24;
}

function drawRecommendations(doc: jsPDF, checks: CheckItem[], y: number): number {
  const actionable = checks.filter((c) => c.severity !== 'pass');
  if (actionable.length === 0) return y;

  y = ensureSpace(doc, y, 100);
  y = drawSectionHeading(doc, 'Detailed Recommendations', y);

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    head: [['Priority', 'Recommendation', 'Why It Matters', 'Suggested Fix', 'Impact']],
    body: actionable.map((c) => [
      (c.statusLabel ?? c.severity).toUpperCase(),
      c.title,
      c.whyItMatters ?? '—',
      c.suggestedFix ?? '—',
      c.estimatedImpact ?? '—',
    ]),
    styles: { fontSize: 8, cellPadding: 6, textColor: hexToRgb(TEXT_PRIMARY) },
    headStyles: { fillColor: hexToRgb(BRAND_DARK), textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: { 0: { cellWidth: 55 }, 1: { cellWidth: 85 }, 4: { cellWidth: 45 } },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 0) {
        const severity = actionable[data.row.index]?.severity;
        data.cell.styles.textColor = hexToRgb(STATUS_COLORS[severity] ?? TEXT_SECONDARY);
        data.cell.styles.fontStyle = 'bold';
      }
    },
  });

  return lastTableFinalY(doc) + 24;
}

function drawFooters(doc: jsPDF): void {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRgb(TEXT_SECONDARY));
    doc.text('Powered by Modern Chameleon Digital · modernchameleon.com', MARGIN, pageHeight - 24);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - MARGIN - 60, pageHeight - 24);
  }
}

/** Builds a full multi-page PDF covering every audit section and triggers a browser download. */
export function generateReportPdf(pageData: PageAuditData, auditResult: AuditResult): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  // --- Header band ---
  doc.setFillColor(...hexToRgb(BRAND_GREEN));
  doc.rect(0, 0, pageWidth, 90, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Modern Chameleon Digital', MARGIN, 40);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('SEO & AI Visibility Report', MARGIN, 60);

  let y = 120;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...hexToRgb(TEXT_PRIMARY));
  doc.text(pageData.domain, MARGIN, y);

  y += 18;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...hexToRgb(TEXT_SECONDARY));
  doc.text(pageData.url, MARGIN, y);

  y += 14;
  doc.text(`Generated: ${new Date(auditResult.auditedAt).toLocaleString()}`, MARGIN, y);

  y += 30;

  // --- Score summary ---
  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN },
    theme: 'plain',
    body: [
      [
        'SEO Score',
        `${auditResult.seoScore} / 100`,
        'AI Visibility Score',
        `${auditResult.aiVisibilityScore} / 100`,
      ],
      [
        'Website Health',
        auditResult.healthLabel,
        'Word Count',
        String(auditResult.contentOverview.wordCount),
      ],
      [
        'Critical Issues',
        String(auditResult.counts.critical),
        'Warnings',
        String(auditResult.counts.warning),
      ],
      [
        'Passed Checks',
        String(auditResult.counts.passed),
        'Reading Time',
        `${auditResult.contentOverview.readingTimeMinutes} min`,
      ],
    ],
    styles: { fontSize: 10, cellPadding: 6, textColor: hexToRgb(TEXT_PRIMARY) },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: hexToRgb(TEXT_SECONDARY) },
      2: { fontStyle: 'bold', textColor: hexToRgb(TEXT_SECONDARY) },
    },
  });

  y = lastTableFinalY(doc) + 24;

  // --- Quick wins, then every category section, then full recommendation detail ---
  y = drawChecksTable(doc, 'Quick Wins', auditResult.quickWins, y);

  for (const category of CATEGORY_ORDER) {
    y = drawChecksTable(doc, CATEGORY_LABELS[category], byCategory(auditResult.checks, category), y);
  }

  drawRecommendations(doc, auditResult.checks, y);

  drawFooters(doc);

  const safeDomain = pageData.domain.replace(/[^a-z0-9.-]/gi, '_') || 'report';
  doc.save(`${safeDomain}-seo-ai-visibility-report.pdf`);
}
