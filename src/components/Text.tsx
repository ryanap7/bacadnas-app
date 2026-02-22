import { memo } from 'react';
import { Text as RNText, type TextProps as RNTextProps, StyleSheet } from 'react-native';
import { colors } from '~/constants/colors';
import { Font, typography } from '~/constants/typography';

// ─── Types ─────────────────────────────────────────────────
type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';
type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type TextColor = 'primary' | 'secondary' | 'disabled' | 'white' | 'error' | 'success' | 'warning' | 'info';
type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';

interface TextProps extends RNTextProps {
  /** Font weight: regular, medium, semibold, bold */
  weight?: FontWeight;
  /** Font size: xs, sm, md, lg, xl, xxl or custom number */
  size?: FontSize | number;
  /** Text color: primary, secondary, disabled, white, error, success, warning, info or custom color */
  color?: TextColor | string;
  /** Text variant for quick styling */
  variant?: TextVariant;
  /** Center align text */
  center?: boolean;
  /** Right align text */
  right?: boolean;
  /** Bold text (shorthand for weight="bold") */
  bold?: boolean;
  /** Italic text */
  italic?: boolean;
  /** Underline text */
  underline?: boolean;
  /** Line through text */
  lineThrough?: boolean;
}

// ─── Weight to Font Mapping ────────────────────────────────
const WEIGHT_TO_FONT: Record<string, Font> = {
  '400': Font.Regular,
  '500': Font.Medium,
  '600': Font.SemiBold,
  '700': Font.Bold,
  '800': Font.Bold,
  'regular': Font.Regular,
  'medium': Font.Medium,
  'semibold': Font.SemiBold,
  'bold': Font.Bold,
  'extrabold': Font.ExtraBold,
};

// ─── Size Mapping ──────────────────────────────────────────
const SIZE_MAP: Record<FontSize, number> = {
  xs: typography.sizes.xs,     // 12
  sm: typography.sizes.sm,     // 14
  md: typography.sizes.md,     // 16
  lg: typography.sizes.lg,     // 18
  xl: typography.sizes.xl,     // 24
  xxl: typography.sizes.xxl,   // 32
};

// ─── Color Mapping ─────────────────────────────────────────
const COLOR_MAP: Record<TextColor, string> = {
  primary: colors.text.primary,
  secondary: colors.text.secondary,
  disabled: colors.text.disabled,
  white: colors.background.light,
  error: colors.error.dark,
  success: colors.success.dark,
  warning: colors.warning.dark,
  info: colors.info.dark,
};

// ─── Variant Presets ───────────────────────────────────────
const VARIANT_STYLES: Record<TextVariant, {
  fontSize: number;
  fontWeight: FontWeight;
  lineHeight?: number;
}> = {
  h1: {
    fontSize: typography.sizes.xxl,    // 32
    fontWeight: 'bold',
    lineHeight: 40,
  },
  h2: {
    fontSize: typography.sizes.xl,     // 24
    fontWeight: 'bold',
    lineHeight: 32,
  },
  h3: {
    fontSize: typography.sizes.lg,     // 18
    fontWeight: 'semibold',
    lineHeight: 24,
  },
  body: {
    fontSize: typography.sizes.md,     // 16
    fontWeight: 'regular',
    lineHeight: 24,
  },
  caption: {
    fontSize: typography.sizes.sm,     // 14
    fontWeight: 'regular',
    lineHeight: 20,
  },
  label: {
    fontSize: typography.sizes.sm,     // 14
    fontWeight: 'medium',
    lineHeight: 20,
  },
};

// ─── Component ──────────────────────────────────────────────
function TextComponent({
  style,
  weight,
  size,
  color,
  variant,
  center = false,
  right = false,
  bold = false,
  italic = false,
  underline = false,
  lineThrough = false,
  ...props
}: TextProps) {
  // Flatten style to extract properties
  const flatStyle = StyleSheet.flatten(style);

  // Determine variant styles first
  let variantStyle = variant ? VARIANT_STYLES[variant] : null;

  // Determine font weight
  let finalWeight: FontWeight = 'regular';
  if (bold) {
    finalWeight = 'bold';
  } else if (weight) {
    finalWeight = weight;
  } else if (variantStyle) {
    finalWeight = variantStyle.fontWeight;
  } else if (flatStyle?.fontWeight) {
    const styleWeight = flatStyle.fontWeight as string;
    finalWeight = (WEIGHT_TO_FONT[styleWeight] ? styleWeight : 'regular') as FontWeight;
  }

  // Determine font family from weight
  const fontFamily = WEIGHT_TO_FONT[finalWeight] || Font.Regular;

  // Determine font size
  let fontSize: number | undefined;
  if (typeof size === 'number') {
    fontSize = size;
  } else if (size) {
    fontSize = SIZE_MAP[size];
  } else if (variantStyle) {
    fontSize = variantStyle.fontSize;
  }

  // Determine color
  let textColor: string | undefined;
  if (color) {
    // Check if it's a preset color or custom color
    textColor = COLOR_MAP[color as TextColor] || color;
  }

  // Determine text align
  let textAlign: 'left' | 'center' | 'right' | undefined;
  if (center) {
    textAlign = 'center';
  } else if (right) {
    textAlign = 'right';
  }

  // Determine text decoration
  let textDecorationLine: 'none' | 'underline' | 'line-through' | 'underline line-through' = 'none';
  if (underline && lineThrough) {
    textDecorationLine = 'underline line-through';
  } else if (underline) {
    textDecorationLine = 'underline';
  } else if (lineThrough) {
    textDecorationLine = 'line-through';
  }

  // Build dynamic style
  const dynamicStyle: any = {
    fontFamily,
  };

  if (fontSize) {
    dynamicStyle.fontSize = fontSize;
  }

  if (textColor) {
    dynamicStyle.color = textColor;
  }

  if (textAlign) {
    dynamicStyle.textAlign = textAlign;
  }

  if (italic) {
    dynamicStyle.fontStyle = 'italic';
  }

  if (textDecorationLine !== 'none') {
    dynamicStyle.textDecorationLine = textDecorationLine;
  }

  if (variantStyle?.lineHeight) {
    dynamicStyle.lineHeight = variantStyle.lineHeight;
  }

  return (
    <RNText
      {...props}
      style={[dynamicStyle, style]}
    />
  );
}

// ─── Export with Memo ──────────────────────────────────────
export const Text = memo(TextComponent);