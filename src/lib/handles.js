// A couple's invitation link: knotiva.my/<handle>. Shared by the site and the /api functions,
// so the rules can't drift apart. Plain JS, no imports.

/**
 * Words that can never be a handle: every top-level route and folder the site uses today,
 * plus names we may want later. Keep in sync with src/App.jsx and public/.
 */
export const RESERVED = new Set([
  // routes in src/App.jsx
  'templates', 'template', 'hero', 'animation', 'character',
  // folders in public/ and the build output
  'shots', 'uploads', 'assets', 'static', 'public', 'src', 'dist', 'node_modules',
  // files a browser or crawler asks for
  'favicon.ico', 'robots.txt', 'sitemap.xml', 'manifest.json', 'index.html', 'apple-touch-icon',
  // server and future pages
  'api', 'admin', 'administrator', 'dashboard', 'account', 'accounts', 'login', 'logout', 'signin',
  'signup', 'register', 'auth', 'settings', 'profile', 'me', 'my', 'new', 'edit', 'preview',
  'checkout', 'pay', 'payment', 'payments', 'order', 'orders', 'billing', 'invoice', 'cart',
  'site', 'sites', 'handle', 'handles', 'rsvp', 'rsvps', 'invite', 'invites', 'invitation',
  'invitations', 'wedding', 'weddings', 'print', 'customize', 'customise', 'gallery',
  'help', 'support', 'contact', 'about', 'pricing', 'faq', 'blog', 'news', 'press', 'careers',
  'terms', 'privacy', 'legal', 'policy', 'policies', 'refund', 'refunds', 'docs',
  'knotiva', 'www', 'app', 'mail', 'email', 'cdn', 'media', 'images', 'img', 'fonts', 'music',
  'audio', 'video', 'files', 'download', 'downloads', 'status', 'health', 'webhook', 'webhooks',
  'test', 'demo', 'example', 'null', 'undefined', '404', '500',
]);

export const HANDLE_MIN = 3;
export const HANDLE_MAX = 40;

/** Lowercases and strips anything a handle can't hold, e.g. "Mon & Karlla!" → "monkarlla". */
export function normalizeHandle(raw) {
  return String(raw || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, HANDLE_MAX);
}

/** Returns '' when the handle is valid, or a short reason a person can read. */
export function handleProblem(handle) {
  if (typeof handle !== 'string' || !handle) return 'Choose a link for your invitation.';
  if (handle.length < HANDLE_MIN) return `Use at least ${HANDLE_MIN} characters.`;
  if (handle.length > HANDLE_MAX) return `Use at most ${HANDLE_MAX} characters.`;
  if (!/^[a-z0-9-]+$/.test(handle)) return 'Use only lowercase letters, numbers and hyphens.';
  if (handle.startsWith('-') || handle.endsWith('-')) return 'Start and end with a letter or number.';
  if (RESERVED.has(handle)) return 'That link is reserved. Please choose another.';
  return '';
}

export const isValidHandle = (handle) => handleProblem(handle) === '';

/** "₱3,800" → 380000 (centavos). */
export function priceToCentavos(price) {
  const n = Number(String(price || '').replace(/[^\d.]/g, ''));
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : 0;
}
