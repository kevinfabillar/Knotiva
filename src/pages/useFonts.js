import { useEffect } from 'react';
import { fontsHref } from '../templates/catalog.js';

/** Loads a template's Google Fonts once. */
export function useFonts(families) {
  useEffect(() => {
    if (!families?.length) return;
    const href = fontsHref(families);
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }, [families]);
}
