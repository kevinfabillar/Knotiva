// The address couples' invitations live at: https://www.knotiva.my/<handle> (VITE_SITE_URL),
// or this dev server when running locally.
const isLocal = () => /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);

export const siteUrl = () => (isLocal() ? window.location.origin : import.meta.env.VITE_SITE_URL || 'https://www.knotiva.my').replace(/\/+$/, '');

/** e.g. "www.knotiva.my" */
export const siteHost = () => siteUrl().replace(/^https?:\/\//, '');
