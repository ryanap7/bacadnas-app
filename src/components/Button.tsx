import { memo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableStateCallbackType,
  type StyleProp,
  type TextStyle,
  type ViewStyle
} from 'react-native';
import { colors } from '~/constants/colors';
import { spacing } from '~/constants/spacing';
import { typography } from '~/constants/typography';

// ─── Types ──────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
  accessibilityLabel?: string;
}

// ─── Size Configurations ───────────────────────────────────
const SIZE_CONFIG = {
  sm: {
    height: 44,
    paddingHorizontal: spacing.md,
    fontSize: typography.sizes.sm,
    borderRadius: 10,
  },
  md: {
    height: 56,
    paddingHorizontal: spacing.lg,
    fontSize: typography.sizes.md,
    borderRadius: 12,
  },
  lg: {
    height: 64,
    paddingHorizontal: spacing.xl,
    fontSize: typography.sizes.lg,
    borderRadius: 16,
  },
} as const;

// ─── Variant Configurations ────────────────────────────────
const getVariantStyle = (variant: ButtonVariant, disabled: boolean) => {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: disabled ? colors.primary.light : colors.primary.main,
        borderColor: 'transparent',
        textColor: colors.background.light,
        shadowEnabled: true,
      };

    case 'secondary':
      return {
        backgroundColor: disabled ? colors.border.light : colors.secondary.main,
        borderColor: 'transparent',
        textColor: colors.text.primary,
        shadowEnabled: true,
      };

    case 'outline':
      return {
        backgroundColor: 'transparent',
        borderColor: disabled ? colors.border.light : colors.primary.main,
        textColor: disabled ? colors.text.disabled : colors.primary.main,
        shadowEnabled: false,
      };

    case 'ghost':
      return {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        textColor: disabled ? colors.text.disabled : colors.primary.main,
        shadowEnabled: false,
      };

    case 'text':
      return {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        textColor: disabled ? colors.text.disabled : colors.primary.main,
        shadowEnabled: false,
      };
  }
};

// ─── Component ──────────────────────────────────────────────
function ButtonComponent({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = true,
  accessibilityLabel,
}: ButtonProps) {
  const sizeConfig = SIZE_CONFIG[size];
  const isDisabled = disabled || loading;
  const variantStyle = getVariantStyle(variant, isDisabled);

  const getButtonStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => {
    return [
      styles.button,
      {
        height: sizeConfig.height,
        paddingHorizontal: sizeConfig.paddingHorizontal,
        borderRadius: sizeConfig.borderRadius,
        backgroundColor: variantStyle.backgroundColor,
        borderColor: variantStyle.borderColor,
        borderWidth: variant === 'outline' ? 1.5 : 0,
        width: fullWidth ? '100%' : 'auto',
        transform: [{ scale: pressed && !isDisabled ? 0.98 : 1 }],
        opacity: isDisabled ? 0.5 : pressed ? 0.9 : 1,
      },
      variantStyle.shadowEnabled && !isDisabled && styles.shadow,
      style,
    ];
  };

  const getTextStyle = (): StyleProp<TextStyle> => {
    return [
      styles.text,
      {
        fontSize: sizeConfig.fontSize,
        color: variantStyle.textColor,
        fontFamily: typography.fonts.bold,
      },
      textStyle,
    ];
  };

  const spinnerColor =
    variant === 'primary' || variant === 'secondary'
      ? colors.background.light
      : colors.primary.main;

  return (
    <Pressable
      style={getButtonStyle}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      android_ripple={{
        color: 'rgba(255, 255, 255, 0.2)',
        borderless: false,
      }}
    >
      {({ pressed }) => (
        <>
          {loading ? (
            <ActivityIndicator size="small" color={spinnerColor} />
          ) : (
            <Text style={getTextStyle()} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </Text>
          )}
        </>
      )}
    </Pressable>
  );
}

// ─── Styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    minWidth: 84,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});

// ─── Export with Memo ──────────────────────────────────────
export const Button = memo(ButtonComponent);