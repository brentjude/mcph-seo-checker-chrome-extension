import { useState } from 'react';
import { FileDown } from 'lucide-react';
import logoUrl from '@/assets/logo.svg';
import { useScanContext } from '@/popup/state/ScanContext';

const CONSULTATION_URL = 'https://modernchameleon.com/contact';

export function Footer() {
  const { pageData, auditResult } = useScanContext();
  const [isGenerating, setIsGenerating] = useState(false);

  const canGenerate = !!pageData && !!auditResult;

  const handleGenerateReport = async () => {
    if (!canGenerate || isGenerating) return;
    setIsGenerating(true);
    try {
      // Lazy-loaded: jsPDF (and its html2canvas/dompurify deps) are only needed
      // for this one-off export, so keep them out of the popup's initial bundle.
      const { generateReportPdf } = await import('@/shared/report/reportPdf');
      generateReportPdf(pageData!, auditResult!);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <footer className="space-y-3 border-t border-surface-border bg-surface-light px-4 py-4 dark:border-surface-darkBorder dark:bg-surface-darkBase">
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleGenerateReport}
          disabled={!canGenerate || isGenerating}
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-primary py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FileDown className={`h-4 w-4 ${isGenerating ? 'animate-pulse' : ''}`} strokeWidth={2.25} />
          {isGenerating ? 'Generating PDF…' : 'Generate Full Report'}
        </button>
        <button
          type="button"
          onClick={() => chrome.tabs.create({ url: CONSULTATION_URL })}
          className="rounded-xl border border-brand-primary py-2.5 text-sm font-semibold text-brand-primary transition-colors duration-200 hover:bg-brand-primary/5"
        >
          Book Free SEO Consultation
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 pt-1">
        <img src={logoUrl} alt="" className="h-4 w-4 rounded" />
        <p className="text-xs font-semibold text-text-primary dark:text-text-darkPrimary">
          Powered by <span className="text-brand-primary">Modern Chameleon Digital</span>
        </p>
      </div>
      <p className="text-center text-[11px] text-text-secondary dark:text-text-darkSecondary">
        Helping businesses improve SEO and AI Visibility.
      </p>
    </footer>
  );
}
