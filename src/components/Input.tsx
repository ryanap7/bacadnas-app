import { Ionicons } from '@expo/vector-icons';
import { forwardRef, memo } from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    type StyleProp,
    type TextInputProps,
    type ViewStyle,
} from 'react-native';
import { colors } from '~/constants/colors';
import { spacing } from '~/constants/spacing';
import { typography } from '~/constants/typography';
import { Text } from './Text';

// ─── Types ──────────────────────────────────────────────────
type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<TextInputProps, 'style'> {
    /** Label di atas input */
    label?: string;
    /** Pesan error */
    error?: string;
    /** Pesan info di bawah input */
    info?: string;
    /** Judul info (bold) */
    infoTitle?: string;
    /** Icon info — default 'alert-circle' */
    infoIcon?: keyof typeof Ionicons.glyphMap;
    /** Ukuran input */
    size?: InputSize;
    /** Style tambahan pada wrapper luar */
    style?: StyleProp<ViewStyle>;
    /** Disable state */
    disabled?: boolean;
}

// ─── Size Configurations ───────────────────────────────────
const SIZE_CONFIG = {
    sm: {
        height: 44,
        minHeight: 44,
        fontSize: typography.sizes.sm,
        borderRadius: 10,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.sm,
    },
    md: {
        height: 52,
        minHeight: 52,
        fontSize: typography.sizes.md,
        borderRadius: 12,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    lg: {
        height: 60,
        minHeight: 60,
        fontSize: typography.sizes.lg,
        borderRadius: 14,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
    },
} as const;

// ─── Component ──────────────────────────────────────────────
const InputComponent = forwardRef<TextInput, InputProps>(
    (
        {
            label,
            error,
            info,
            infoTitle,
            infoIcon = 'alert-circle',
            size = 'md',
            style,
            disabled = false,
            placeholderTextColor = colors.text.disabled,
            ...props
        },
        ref
    ) => {
        const sizeConfig = SIZE_CONFIG[size];
        const hasError = !!error;

        return (
            <View style={style}>
                {/* Label */}
                {label && (
                    <Text
                        weight="medium"
                        size="sm"
                        color={hasError ? colors.error.dark : colors.text.primary}
                        style={{ marginBottom: spacing.xs }}
                    >
                        {label}
                    </Text>
                )}

                {/* Input Wrapper */}
                <View
                    style={[
                        styles.inputWrapper,
                        {
                            minHeight: sizeConfig.minHeight,
                            height: props.multiline ? 120 : sizeConfig.height,
                            borderRadius: sizeConfig.borderRadius,
                            borderColor: hasError
                                ? colors.error.dark
                                : disabled
                                    ? colors.border.light
                                    : colors.border.light,
                            backgroundColor: disabled ? colors.background.dark : colors.background.light,
                            alignItems: props.multiline ? 'flex-start' : 'center',
                        },
                        hasError && styles.inputWrapperError,
                    ]}
                >
                    <TextInput
                        ref={ref}
                        style={[
                            styles.input,
                            {
                                fontSize: sizeConfig.fontSize,
                                paddingHorizontal: sizeConfig.paddingHorizontal,
                                paddingVertical: props.multiline ? sizeConfig.paddingVertical : 0,
                                color: disabled ? colors.text.disabled : colors.text.primary,
                                fontFamily: typography.fonts.regular,
                                textAlignVertical: props.multiline ? 'top' : 'center',
                            },
                        ]}
                        placeholderTextColor={placeholderTextColor}
                        editable={!disabled}
                        {...props}
                    />
                </View>

                {/* Error Message */}
                {hasError && (
                    <Text weight="regular" size="xs" color={colors.error.dark} style={{ marginTop: spacing.xs }}>
                        {error}
                    </Text>
                )}

                {/* Info Message */}
                {info && (
                    <View style={styles.infoContainer}>
                        <Ionicons name={infoIcon} size={20} color={colors.info.dark} />
                        <View style={styles.infoContent}>
                            {infoTitle && (
                                <Text weight="semibold" size="sm" color={colors.info.dark} style={{ marginBottom: spacing.xs }}>
                                    {infoTitle}
                                </Text>
                            )}
                            <Text weight="regular" size="sm" color={colors.info.dark} style={{ lineHeight: 24 }}>
                                {info}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        );
    }
);

// ─── Styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: colors.border.light,
        justifyContent: 'center',
    },
    inputWrapperError: {
        borderColor: colors.error.dark,
    },
    input: {
        flex: 1,
        minHeight: '100%',
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: spacing.sm,
        padding: spacing.sm,
        backgroundColor: colors.info.light ?? '#EFF6FF',
        borderRadius: 10,
        gap: spacing.sm,
    },
    infoContent: {
        flex: 1,
    },
});

// ─── Export with Memo ──────────────────────────────────────
export const Input = memo(InputComponent);