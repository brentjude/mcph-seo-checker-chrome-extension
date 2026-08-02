import { RefreshCw, Settings } from 'lucide-react';
import { useScanContext } from '@/popup/state/ScanContext';
import { resolveFaviconUrl } from '@/shared/utils/favicon';
import logoUrl from '@/assets/logo.svg';

export function Header() {
  const { tabInfo, refresh, status } = useScanContext();
  const isScanning = status === 'scanning';

  return (
    <header className="sticky top-0 z-10 border-b border-surface-border bg-white/95 px-4 py-3 backdrop-blur dark:border-surface-darkBorder dark:bg-surface-darkCard/95">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <img src={logoUrl} alt="Modern Chameleon Digital" className="h-8 w-8 shrink-0 rounded-lg" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary dark:text-text-darkPrimary">
              SEO &amp; AI Visibility Checker
            </p>
            {tabInfo && (
              <div className="flex items-center gap-1.5 text-xs text-text-secondary dark:text-text-darkSecondary">
                <img
                  src={resolveFaviconUrl(tabInfo.favicon, tabInfo.domain)}
                  alt=""
                  className="h-3.5 w-3.5 rounded-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.visibility = 'hidden';
                  }}
                />
                <span className="truncate">{tabInfo.domain}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label="Settings"
            className="rounded-lg p-2 text-text-secondary transition-colors duration-200 hover:bg-surface-light hover:text-text-primary dark:text-text-darkSecondary dark:hover:bg-surface-darkBase dark:hover:text-text-darkPrimary"
          >
            <Settings className="h-4 w-4" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            aria-label="Refresh scan"
            onClick={refresh}
            disabled={isScanning}
            className="rounded-lg p-2 text-text-secondary transition-colors duration-200 hover:bg-surface-light hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60 dark:text-text-darkSecondary dark:hover:bg-surface-darkBase dark:hover:text-text-darkPrimary"
          >
            <RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} strokeWidth={2.25} />
          </button>
        </div>
      </div>
    </header>
  );
}
