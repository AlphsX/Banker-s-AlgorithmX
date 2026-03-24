/**
 * Shared configuration for the Banker's Algorithm Logo
 * Ensures consistency between the UI components and the dynamic favicon generator.
 */

export const LOGO_VIEWBOX = '0 0 16 16';

export const LOGO_THEMES = {
  vibrant: {
    top: {start: '#FF1E76', end: '#FFB800'},
    left: {start: '#00E5FF', end: '#007AFF'},
    right: {start: '#DFFF00', end: '#34C759'},
  },
  green: {
    top: {start: '#34C759', end: '#00FF00'},
    left: {start: '#34C759', end: '#00FF00'},
    right: {start: '#34C759', end: '#00FF00'},
  },
  red: {
    top: {start: '#FF0000', end: '#800000'},
    left: {start: '#FF0000', end: '#800000'},
    right: {start: '#FF0000', end: '#800000'},
  },
};

export const LOGO_PATHS = [
  // Top Boomerang
  {
    id: 'top',
    d: 'M8.5 0C8.5 0 4.58642 3.74805 3.94122 4.39717C3.86128 4.4776 3.84989 4.60224 3.91398 4.69539C3.97806 4.78854 4.09993 4.82451 4.20557 4.78145L7.90537 3.27345L11.7747 9.36041C11.8406 9.46403 11.9758 9.50133 12.0869 9.44651C12.1979 9.39169 12.2483 9.26276 12.2032 9.1489C11.7103 7.90508 8.5 0 8.5 0Z',
    gradientId: 'logo-grad-top',
    colorKey: 'top' as const,
  },
  // Left Boomerang
  {
    id: 'left',
    d: 'M6.29304 6.03867C6.35522 5.93334 6.32602 5.79881 6.22554 5.72763C6.12505 5.65645 5.98605 5.67185 5.90418 5.76322C5.12486 6.633 0 12.5 0 12.5C0 12.5 5.18613 13.803 6.03089 13.9939C6.14204 14.0191 6.25587 13.964 6.30355 13.8621C6.35122 13.7603 6.31967 13.6394 6.22796 13.5728L3.1616 11.3431L6.29304 6.03867Z',
    gradientId: 'logo-grad-left',
    colorKey: 'left' as const,
  },
  // Right Boomerang
  {
    id: 'right',
    d: 'M14.054 7.5893C14.016 7.47964 13.9029 7.4131 13.7867 7.43203C13.6705 7.45096 13.5853 7.5498 13.5853 7.66564V11.3824L6.45275 11.5197C6.32824 11.5221 6.22613 11.6175 6.2173 11.7396C6.20846 11.8618 6.2958 11.9704 6.41871 11.9901C7.68171 12.1927 16 13.5728 16 13.5728C16 13.5728 14.3311 8.38966 14.054 7.5893Z',
    gradientId: 'logo-grad-right',
    colorKey: 'right' as const,
  },
];
