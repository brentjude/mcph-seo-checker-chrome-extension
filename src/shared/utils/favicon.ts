/** Falls back to Google's favicon service when the tab/page didn't expose one directly. */
export function resolveFaviconUrl(favicon: string | null, domain: string): string {
  if (favicon) return favicon;
  return `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(domain)}`;
}
