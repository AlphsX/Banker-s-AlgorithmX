import {LOGO_THEMES, LOGO_PATHS, LOGO_VIEWBOX} from '@/constants/logo-config';

export function generateFaviconSvg(): string {
  // SVG markup for the LogoIcon with vibrant gradients and original shape
  // Note: Using absolute coordinates for gradients to improve browser compatibility in favicons
  const svg = `
    <svg width="32" height="32" viewBox="${LOGO_VIEWBOX}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="favicon-grad-top" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="${LOGO_THEMES.vibrant.top.start}" />
          <stop offset="100%" stop-color="${LOGO_THEMES.vibrant.top.end}" />
        </linearGradient>
        <linearGradient id="favicon-grad-left" x1="16" y1="0" x2="0" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="${LOGO_THEMES.vibrant.left.start}" />
          <stop offset="100%" stop-color="${LOGO_THEMES.vibrant.left.end}" />
        </linearGradient>
        <linearGradient id="favicon-grad-right" x1="0" y1="16" x2="16" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="${LOGO_THEMES.vibrant.right.start}" />
          <stop offset="100%" stop-color="${LOGO_THEMES.vibrant.right.end}" />
        </linearGradient>
      </defs>
      <path fill="url(#favicon-grad-top)" d="${LOGO_PATHS[0].d}" />
      <path fill="url(#favicon-grad-left)" d="${LOGO_PATHS[1].d}" />
      <path fill="url(#favicon-grad-right)" d="${LOGO_PATHS[2].d}" />
    </svg>
  `.trim();

  // Convert SVG to data URI
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');

  return `data:image/svg+xml,${encoded}`;
}
