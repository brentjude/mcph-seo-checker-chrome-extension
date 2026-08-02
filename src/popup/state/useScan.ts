import { useCallback, useEffect, useState } from 'react';
import { extractPageData } from '@/content/content-script';
import { runAudit } from '@/shared/analyzer';
import type { PageAuditData } from '@/shared/types/page-data';
import type { AuditResult } from '@/shared/types/audit-result';

export type ScanStatus = 'idle' | 'scanning' | 'ready' | 'error' | 'unsupported';

export interface TabInfo {
  url: string;
  domain: string;
  favicon: string | null;
}

function safeHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function isUnsupportedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return true;
    if (parsed.hostname === 'chrome.google.com') return true;
    return false;
  } catch {
    return true;
  }
}

export interface ScanState {
  status: ScanStatus;
  tabInfo: TabInfo | null;
  pageData: PageAuditData | null;
  auditResult: AuditResult | null;
  errorMessage: string | null;
  refresh: () => void;
}

export function useScan(): ScanState {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [tabInfo, setTabInfo] = useState<TabInfo | null>(null);
  const [pageData, setPageData] = useState<PageAuditData | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const runScan = useCallback(async () => {
    setStatus('scanning');
    setErrorMessage(null);

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab?.id || !tab.url) {
        setStatus('unsupported');
        return;
      }

      setTabInfo({
        url: tab.url,
        domain: safeHostname(tab.url),
        favicon: tab.favIconUrl ?? null,
      });

      if (isUnsupportedUrl(tab.url)) {
        setStatus('unsupported');
        return;
      }

      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractPageData,
      });

      const data = results[0]?.result;
      if (!data) {
        throw new Error('No data was returned from the page scan.');
      }

      setPageData(data);
      setAuditResult(runAudit(data));
      setStatus('ready');
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong while scanning this page.',
      );
    }
  }, []);

  useEffect(() => {
    runScan();
  }, [runScan]);

  return { status, tabInfo, pageData, auditResult, errorMessage, refresh: runScan };
}
