import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { memo, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import { colors } from '~/constants/colors';
import { spacing } from '~/constants/spacing';
import { Text } from './Text';

// ─── Types ──────────────────────────────────────────────────
interface DatePickerProps {
    /** Label di atas picker */
    label?: string;
    /** Pesan error */
    error?: string;
    /** Pesan info di bawah picker */
    info?: string;
    /** Icon info */
    infoIcon?: keyof typeof Ionicons.glyphMap;
    /** Placeholder saat belum ada value */
    placeholder?: string;
    /** Value tanggal yang dipilih */
    value?: Date;
    /** Callback saat tanggal berubah */
    onChange?: (date: Date) => void;
    /** Tanggal maksimal yang bisa dipilih */
    maximumDate?: Date;
    /** Tanggal minimal yang bisa dipilih */
    minimumDate?: Date;
    /** Disable state */
    disabled?: boolean;
}

// ─── Helper Functions ──────────────────────────────────────
const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

// ─── Component ──────────────────────────────────────────────
const DatePickerComponent = ({
    label,
    error,
    info,
    infoIcon = 'alert-circle',
    placeholder = 'Pilih Tanggal',
    value,
    onChange,
    maximumDate,
    minimumDate,
    disabled = false,
}: DatePickerProps) => {
    const [showPicker, setShowPicker] = useState(false);
    const [tempDate, setTempDate] = useState<Date>(value || new Date());

    const hasError = !!error;
    const displayValue = value ? formatDate(value) : '';

    // ─── Handle Date Change (Android/iOS) ──────────────────
    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowPicker(false);
            if (event.type === 'set' && selectedDate) {
                onChange?.(selectedDate);
            }
        } else {
            // iOS: update temp date
            if (selectedDate) {
                setTempDate(selectedDate);
            }
        }
    };

    // ─── Handle iOS Confirm ────────────────────────────────
    const handleConfirm = () => {
        onChange?.(tempDate);
        setShowPicker(false);
    };

    // ─── Handle iOS Cancel ─────────────────────────────────
    const handleCancel = () => {
        setTempDate(value || new Date());
        setShowPicker(false);
    };

    return (
        <View>
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

            {/* Picker Button */}
            <Pressable
                style={[
                    styles.pickerButton,
                    hasError && styles.pickerButtonError,
                    disabled && styles.pickerButtonDisabled,
                ]}
                onPress={() => !disabled && setShowPicker(true)}
                disabled={disabled}
            >
                <Text
                    weight="regular"
                    size="md"
                    color={displayValue ? colors.text.primary : colors.text.disabled}
                    style={{ flex: 1 }}
                >
                    {displayValue || placeholder}
                </Text>
                <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={disabled ? colors.text.disabled : colors.text.secondary}
                />
            </Pressable>

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
                        <Text weight="regular" size="sm" color={colors.info.dark} style={{ lineHeight: 24 }}>
                            {info}
                        </Text>
                    </View>
                </View>
            )}

            {/* Date Picker Modal (iOS) */}
            {Platform.OS === 'ios' && showPicker && (
                <Modal
                    transparent
                    animationType="fade"
                    visible={showPicker}
                    onRequestClose={handleCancel}
                >
                    <View style={styles.modalOverlay}>
                        <Pressable style={styles.modalBackdrop} onPress={handleCancel} />
                        <View style={styles.modalContent}>
                            {/* Header */}
                            <View style={styles.modalHeader}>
                                <Pressable onPress={handleCancel} hitSlop={10}>
                                    <Text weight="semibold" size="md" color={colors.primary.main}>
                                        Batal
                                    </Text>
                                </Pressable>
                                <Text weight="bold" size="md" color={colors.text.primary}>
                                    Pilih Tanggal
                                </Text>
                                <Pressable onPress={handleConfirm} hitSlop={10}>
                                    <Text weight="semibold" size="md" color={colors.primary.main}>
                                        Selesai
                                    </Text>
                                </Pressable>
                            </View>

                            {/* Picker */}
                            {/* <View style={styles.pickerWrapper}>
                            </View> */}
                            <DateTimePicker
                                value={tempDate}
                                mode="date"
                                display="spinner"
                                onChange={handleDateChange}
                                maximumDate={maximumDate}
                                minimumDate={minimumDate}
                                style={styles.iosDatePicker}
                                textColor={colors.primary.main}
                            />
                        </View>
                    </View>
                </Modal>
            )}

            {/* Date Picker (Android) */}
            {Platform.OS === 'android' && showPicker && (
                <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    maximumDate={maximumDate}
                    minimumDate={minimumDate}
                />
            )}
        </View>
    );
};

// ─── Styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 52,
        paddingHorizontal: spacing.md,
        borderWidth: 1.5,
        borderColor: colors.border.light,
        borderRadius: 12,
        backgroundColor: colors.background.light,
        gap: spacing.sm,
    },
    pickerButtonError: {
        borderColor: colors.error.dark,
    },
    pickerButtonDisabled: {
        backgroundColor: colors.background.dark,
        borderColor: colors.border.light,
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

    // Modal (iOS)
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalBackdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: colors.background.light,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: spacing.xl,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
        backgroundColor: colors.background.light,
    },
    pickerWrapper: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
    },
    iosDatePicker: {
        height: 220,
        width: '100%',
    },
});

// ─── Export with Memo ──────────────────────────────────────
export const DatePicker = memo(DatePickerComponent);