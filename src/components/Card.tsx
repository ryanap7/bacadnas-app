import { memo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '~/constants/colors';
import { spacing } from '~/constants/spacing';
import { typography } from '~/constants/typography';

// ─── Types ──────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  pressable?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

// ─── Main Card Component ───────────────────────────────────
function CardBase({ children, pressable = false, onPress, style }: CardProps) {
  const getCardStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [
    styles.card,
    pressed && styles.pressed,
    style,
  ];

  if (pressable) {
    return (
      <Pressable
        style={getCardStyle}
        onPress={onPress}
        accessibilityRole="button"
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
}

// ─── Card Title ────────────────────────────────────────────
interface CardTitleProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

function CardTitle({ children, style }: CardTitleProps) {
  return <Text style={[styles.title, style as StyleProp<TextStyle>]}>{children}</Text>;
}

// ─── Card Description ──────────────────────────────────────
interface CardDescriptionProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

function CardDescription({ children, style }: CardDescriptionProps) {
  return <Text style={[styles.description, style as StyleProp<TextStyle>]}>{children}</Text>;
}

// ─── Card Loading ──────────────────────────────────────────
interface CardLoadingProps {
  message?: string;
}

function CardLoading({ message = 'Loading...' }: CardLoadingProps) {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={colors.primary.main} />
      <Text style={[styles.statusText, styles.loadingText]}>{message}</Text>
    </View>
  );
}

// ─── Card Error ────────────────────────────────────────────
interface CardErrorProps {
  message: string;
  onRetry?: () => void;
}

function CardError({ message, onRetry }: CardErrorProps) {
  return (
    <View style={styles.centered}>
      <Text style={[styles.statusText, styles.errorText]}>⚠️ {message}</Text>
      {onRetry && (
        <Pressable style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>Coba Lagi</Text>
        </Pressable>
      )}
    </View>
  );
}

// ─── Card Empty ────────────────────────────────────────────
interface CardEmptyProps {
  message: string;
  icon?: string;
}

function CardEmpty({ message, icon = '📭' }: CardEmptyProps) {
  return (
    <View style={styles.centered}>
      <Text style={styles.emptyIcon}>{icon}</Text>
      <Text style={[styles.statusText, styles.emptyText]}>{message}</Text>
    </View>
  );
}

// ─── Compound Export ────────────────────────────────────────
const Card = Object.assign(memo(CardBase), {
  Title: memo(CardTitle),
  Description: memo(CardDescription),
  Loading: memo(CardLoading),
  Error: memo(CardError),
  Empty: memo(CardEmpty),
});

export { Card };

// ─── Styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.light,
    borderRadius: 12,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  title: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  statusText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  loadingText: {
    color: colors.text.secondary,
  },
  errorText: {
    color: colors.error.dark,
  },
  emptyText: {
    color: colors.text.disabled,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  retryButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary.main,
    borderRadius: 8,
  },
  retryText: {
    color: colors.background.light,
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.semibold,
  },
});
