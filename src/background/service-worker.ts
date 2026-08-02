// Minimal MV3 background worker. The core scan flow runs entirely in the
// popup (see src/popup/state/useScan.ts) via on-demand chrome.scripting
// injection, so this worker has nothing to do on that path. It's the
// natural home for future premium features (e.g. a toolbar badge showing
// the critical-issue count, or scheduled re-audits).
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.info('[Modern Chameleon Digital] SEO & AI Visibility Checker installed.');
  }
});
