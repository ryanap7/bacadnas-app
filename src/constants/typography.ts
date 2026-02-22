// ─── Font Family Enum ──────────────────────────────────────
export enum Font {
  Regular = 'Montserrat-Regular',
  Medium = 'Montserrat-Medium',
  SemiBold = 'Montserrat-SemiBold',
  Bold = 'Montserrat-Bold',
  ExtraBold = 'Montserrat-ExtraBold',
}

// ─── Typography Constants ──────────────────────────────────
export const typography = {
  fonts: {
    regular: Font.Regular,
    medium: Font.Medium,
    semibold: Font.SemiBold,
    bold: Font.Bold,
    extrabold: Font.ExtraBold,
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// ─── Type Exports ──────────────────────────────────────────
export type Typography = typeof typography;
export type FontSize = keyof typeof typography.sizes;
export type FontWeight = keyof typeof typography.weights;
export type LineHeight = keyof typeof typography.lineHeights;
