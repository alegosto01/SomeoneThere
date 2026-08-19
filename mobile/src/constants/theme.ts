/**
 * Visual direction (spec §49): light backgrounds, generous whitespace, rounded
 * cards, restrained colour. Deliberately no fear-based red-heavy palette —
 * "concern" is amber, not alarm-red.
 */

export const colors = {
  background: '#FBFAF8',
  surface: '#FFFFFF',
  surfaceMuted: '#F4F2EE',
  border: '#E6E2DA',
  borderStrong: '#D3CEC2',

  text: '#1B1A17',
  textSecondary: '#5C574E',
  textMuted: '#8A8479',
  textInverse: '#FFFFFF',

  primary: '#0F5132',
  primaryPressed: '#0B3D26',
  primarySoft: '#E7F1EB',

  positive: '#1F7A4D',
  positiveSoft: '#E7F1EB',
  attention: '#9A6212',
  attentionSoft: '#FBF1DF',
  negative: '#9B2C2C',
  negativeSoft: '#F8EAEA',
  neutral: '#5C574E',
  neutralSoft: '#F0EEE9',

  focus: '#0F5132',
  overlay: 'rgba(27, 26, 23, 0.45)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 30, lineHeight: 38, fontWeight: '700' },
  title: { fontSize: 24, lineHeight: 31, fontWeight: '700' },
  heading: { fontSize: 19, lineHeight: 26, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  bodyStrong: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
  small: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '600', letterSpacing: 0.8 },
} as const;

export const shadow = {
  card: {
    shadowColor: '#1B1A17',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
} as const;

/** Minimum touch target (spec §50). */
export const MIN_TOUCH_TARGET = 48;
