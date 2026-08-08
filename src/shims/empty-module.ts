/**
 * Stub for jsPDF's optional `.html()` plugin dependencies (html2canvas, dompurify).
 * We only use jsPDF's core drawing API + autoTable and never call `.html()`, but
 * jsPDF's ESM bundle still dynamically imports these libraries by name. Chrome Web
 * Store's static reviewer flags html2canvas's DOM-cloning/remote-proxy code as
 * "remotely hosted code" even when it's never invoked, so this stub keeps it out
 * of the packaged build entirely.
 */
export default {};
