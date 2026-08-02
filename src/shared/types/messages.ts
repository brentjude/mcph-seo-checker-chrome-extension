import type { PageAuditData } from './page-data';

/**
 * Reserved seam for a future persistent-content-script / sendMessage flow
 * (e.g. live re-audit on SPA navigation). v1 uses chrome.scripting.executeScript's
 * return value directly and does not send these over chrome.runtime messaging.
 */
export type ScanMessage =
  | { type: 'SCAN_REQUEST' }
  | { type: 'SCAN_RESULT'; payload: PageAuditData }
  | { type: 'SCAN_ERROR'; error: string };
