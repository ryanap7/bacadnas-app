import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, DatePicker, Header, Input, Stepper, Text } from '~/components';
import { colors, spacing } from '~/constants';
import { useRegistration } from '~/context/Registrationcontext';

// ─── Types ──────────────────────────────────────────────────
interface FormData {
    fullName: string;
    nik: string;
    birthPlace: string;
    birthDate: Date | undefined;
    gender: 'MALE' | 'FEMALE' | '';
}

const GENDER_OPTIONS = [
    { value: 'MALE', label: 'Laki-Laki', icon: '♂' },
    { value: 'FEMALE', label: 'Perempuan', icon: '♀' },
] as const;

const STEPS = [
    { key: 'personal', label: 'DATA PRIBADI' },
    { key: 'address', label: 'ALAMAT' },
    { key: 'contact', label: 'KONTAK' },
];

// ─── Component ──────────────────────────────────────────────
export default function PersonalDataScreen() {
    const router = useRouter();
    const { registrationData, updateRegistrationData } = useRegistration();

    const [form, setForm] = useState<FormData>({
        fullName: registrationData.fullName || '',
        nik: registrationData.nik || '',
        birthPlace: registrationData.birthPlace || '',
        birthDate: registrationData.birthDate ? new Date(registrationData.birthDate) : undefined,
        gender: registrationData.gender || '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

    // ─── Animated Values ──────────────────────────────────
    const animations = useRef(
        Array.from({ length: 6 }, () => ({
            opacity: new Animated.Value(0),
            translateY: new Animated.Value(24),
        }))
    ).current;

    // ─── Staggered Entering ───────────────────────────────
    useEffect(() => {
        Animated.stagger(
            120,
            animations.map((anim) =>
                Animated.parallel([
                    Animated.timing(anim.opacity, { toValue: 1, duration: 450, useNativeDriver: true }),
                    Animated.timing(anim.translateY, { toValue: 0, duration: 450, useNativeDriver: true }),
                ])
            )
        ).start();
    }, []);

    // ─── Calculate Age ──────────────────
    const age = useMemo(() => {
        if (!form.birthDate) return null;

        const birth = form.birthDate;
        const today = new Date();
        let result = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            result--;
        }
        return result > 0 ? result : null;
    }, [form.birthDate]);

    // ─── Handlers ──────────────────────────────────────────
    const updateField = useCallback(
        (field: keyof FormData, value: string | Date) => {
            setForm((prev) => ({ ...prev, [field]: value }));
            if (errors[field]) {
                setErrors((prev) => ({ ...prev, [field]: undefined }));
            }
        },
        [errors]
    );

    const validate = useCallback((): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        if (!form.fullName.trim()) {
            newErrors.fullName = 'Nama lengkap wajib diisi';
        }
        if (!form.birthPlace.trim()) {
            newErrors.birthPlace = 'Tempat lahir wajib diisi';
        }
        if (!form.birthDate) {
            newErrors.birthDate = 'Tanggal lahir wajib diisi';
        }
        if (!form.gender) {
            newErrors.gender = 'Silakan pilih jenis kelamin';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [form]);

    const handleNext = useCallback(() => {
        if (!validate()) return;

        // Format birthDate to YYYY-MM-DD for API
        const formattedBirthDate = form.birthDate
            ? `${form.birthDate.getFullYear()}-${String(form.birthDate.getMonth() + 1).padStart(2, '0')}-${String(form.birthDate.getDate()).padStart(2, '0')}`
            : '';

        // Update registration context
        updateRegistrationData({
            fullName: form.fullName,
            birthPlace: form.birthPlace,
            birthDate: formattedBirthDate,
            gender: form.gender as 'MALE' | 'FEMALE',
        });

        // Navigate to address screen
        router.push('/(app)/(registration)/address' as any);
    }, [form, updateRegistrationData, validate, router]);

    // ─── Animated Style Helper ────────────────────────────
    const animatedStyle = (index: number) => ({
        opacity: animations[index].opacity,
        transform: [{ translateY: animations[index].translateY }],
    });

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <Header
                title={`Pendaftaran ${registrationData.selectedProgram === 'KOMCAD' ? 'KOMCAD' : 'Bela Negara'}`}
            />

            {/* Stepper */}
            <Stepper steps={STEPS} currentStep={0} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Section Header */}
                    <Animated.View style={[styles.sectionHeader, animatedStyle(0)]}>
                        <Text weight="bold" size="md" color="primary">
                            Data Pribadi
                        </Text>
                        <Text weight="regular" size="sm" color="secondary" style={{ marginTop: 2 }}>
                            Silahkan lengkapi data diri Anda dengan{'\n'}identitas resmi (KTP).
                        </Text>
                    </Animated.View>

                    {/* Full Name */}
                    <Animated.View style={animatedStyle(1)}>
                        <Input
                            label="Nama Lengkap*"
                            placeholder="Sesuai KTP"
                            value={form.fullName}
                            onChangeText={(text) => updateField('fullName', text)}
                            error={errors.fullName}
                            autoCapitalize="words"
                        />
                    </Animated.View>

                    {/* NIK (read-only) */}
                    <Animated.View style={animatedStyle(2)}>
                        <Input
                            label="Nomor Induk Kependudukan (NIK)*"
                            value={form.nik}
                            disabled
                            info="NIK Anda akan diverifikasi secara otomatis melalui sistem dukcapil."
                            infoIcon="information-circle"
                        />
                    </Animated.View>

                    {/* Birth Place & Birth Date */}
                    <Animated.View style={[styles.row, animatedStyle(3)]}>
                        <Input
                            label="Tempat Lahir*"
                            placeholder="Tempat Lahir"
                            value={form.birthPlace}
                            onChangeText={(text) => updateField('birthPlace', text)}
                            error={errors.birthPlace}
                            style={{ flex: 1 }}
                        />
                        <View style={{ flex: 1 }}>
                            <DatePicker
                                label="Tanggal Lahir*"
                                placeholder="Pilih Tanggal"
                                value={form.birthDate}
                                onChange={(date) => updateField('birthDate', date)}
                                error={errors.birthDate}
                                maximumDate={new Date()}
                                minimumDate={new Date(1940, 0, 1)}
                            />
                        </View>
                    </Animated.View>

                    {/* Age (auto-calculated) */}
                    <Animated.View style={animatedStyle(4)}>
                        <Input
                            label="Umur (Otomatis)"
                            value={age ? `${age} tahun` : ''}
                            placeholder="Akan terisi otomatis"
                            disabled
                        />
                    </Animated.View>

                    {/* Gender */}
                    <Animated.View style={animatedStyle(5)}>
                        <Text
                            weight="medium"
                            size="sm"
                            color={errors.gender ? colors.error.dark : colors.text.primary}
                            style={{ marginBottom: spacing.xs }}
                        >
                            Jenis Kelamin*
                        </Text>
                        <View style={styles.genderRow}>
                            {GENDER_OPTIONS.map((option) => {
                                const isSelected = form.gender === option.value;
                                return (
                                    <Pressable
                                        key={option.value}
                                        style={[styles.genderButton, isSelected && styles.genderButtonActive]}
                                        onPress={() => updateField('gender', option.value)}
                                    >
                                        <Text
                                            weight={isSelected ? 'semibold' : 'regular'}
                                            size="sm"
                                            color={isSelected ? colors.primary.main : colors.text.secondary}
                                        >
                                            {option.icon} {option.label}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                        {errors.gender && (
                            <Text
                                weight="regular"
                                size="xs"
                                color={colors.error.dark}
                                style={{ marginTop: spacing.xs }}
                            >
                                {errors.gender}
                            </Text>
                        )}
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Footer */}
            <View style={styles.footer}>
                <Button title="Continue →" onPress={handleNext} />
            </View>
        </SafeAreaView>
    );
}

// ─── Styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.light,
    },
    scroll: {
        flex: 1,
        paddingVertical: spacing.lg,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        gap: spacing.md,
        paddingBottom: spacing.lg,
    },
    sectionHeader: {
        marginBottom: spacing.xs,
    },
    row: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    genderRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    genderButton: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: colors.border.light,
        alignItems: 'center',
        backgroundColor: colors.background.light,
    },
    genderButtonActive: {
        borderColor: colors.primary.main,
        backgroundColor: colors.primary.main + '10',
    },
    footer: {
        paddingHorizontal: spacing.lg,
    },
});