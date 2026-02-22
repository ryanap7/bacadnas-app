import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Header, Input, Stepper, Text } from '~/components';
import { colors, spacing } from '~/constants';
import { useRegistration } from '~/context/Registrationcontext';
import { useRegister } from '~/hooks/useRegister';

// ─── Types ──────────────────────────────────────────────────
interface ContactForm {
    phone: string;
    expertise: string;
    agreedToTerms: boolean;
}

// ─── Agreement Items ───────────────────────────────────────
const AGREEMENT_ITEMS = [
    'Seluruh data yang saya lampirkan adalah benar dan valid secara hukum.',
    'Saya bersedia mengikuti seluruh tahapan seleksi Komponen Cadangan.',
    'Saya menyetujui Ketentuan Layanan dan Kebijakan Privasi yang berlaku.',
];

const STEPS = [
    { key: 'personal', label: 'DATA PRIBADI' },
    { key: 'address', label: 'ALAMAT' },
    { key: 'contact', label: 'KONTAK' },
];

// ─── Component ──────────────────────────────────────────────
export default function ContactScreen() {
    const router = useRouter();
    const { registrationData, updateRegistrationData } = useRegistration();
    const { mutate: register, isPending } = useRegister();

    const [form, setForm] = useState<ContactForm>({
        phone: registrationData.phone || '',
        expertise: registrationData.expertise || '',
        agreedToTerms: registrationData.agreedToTerms || false,
    });

    const [errors, setErrors] = useState<{
        phone?: string;
        expertise?: string;
        agreedToTerms?: string;
    }>({});

    // ─── Animated Values ──────────────────────────────────
    const animations = useRef(
        Array.from({ length: 5 }, () => ({
            opacity: new Animated.Value(0),
            translateY: new Animated.Value(24),
        }))
    ).current;

    // ─── Staggered Entering ───────────────────────────────
    useEffect(() => {
        Animated.stagger(
            100,
            animations.map((anim) =>
                Animated.parallel([
                    Animated.timing(anim.opacity, { toValue: 1, duration: 450, useNativeDriver: true }),
                    Animated.timing(anim.translateY, { toValue: 0, duration: 450, useNativeDriver: true }),
                ])
            )
        ).start();
    }, []);

    // ─── Handlers ──────────────────────────────────────────
    const updateField = useCallback(
        (field: keyof ContactForm, value: string) => {
            setForm((prev) => ({ ...prev, [field]: value }));
            if (errors[field as keyof typeof errors]) {
                setErrors((prev) => ({ ...prev, [field]: undefined }));
            }
        },
        [errors]
    );

    const validate = useCallback((): boolean => {
        const newErrors: { phone?: string; expertise?: string; agreedToTerms?: string } = {};

        if (!form.phone) {
            newErrors.phone = 'Nomor Hp wajib diisi';
        } else if (form.phone.length < 8) {
            newErrors.phone = 'Nomor Hp setidaknya 8 digit angka';
        }

        if (!form.expertise.trim()) {
            newErrors.expertise = 'Keahlian wajib diisi';
        }

        if (!form.agreedToTerms) {
            newErrors.agreedToTerms = 'Kamu harus menyetujui pernyataan terlebih dulu';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [form]);

    const handleSubmit = useCallback(() => {
        if (!validate()) return;

        // Update registration context with final data
        updateRegistrationData({
            phone: form.phone,
            expertise: form.expertise,
            agreedToTerms: form.agreedToTerms,
        });

        // Navigate to loading screen
        router.push('/(app)/(registration)/loading');

        // Submit registration after a short delay (simulating processing)
        setTimeout(() => {
            register({
                nik: registrationData.nik,
                fullName: registrationData.fullName,
                birthPlace: registrationData.birthPlace,
                birthDate: registrationData.birthDate,
                gender: registrationData.gender as 'MALE' | 'FEMALE',
                phone: form.phone,
                expertise: form.expertise,
                province: registrationData.province,
                city: registrationData.city,
                district: registrationData.district,
                subDistrict: registrationData.subDistrict,
                postalCode: registrationData.postalCode,
                address: registrationData.address,
                selectedProgram: registrationData.selectedProgram as 'KOMCAD' | 'BELA_NEGARA',
                agreedToTerms: form.agreedToTerms,
            });
        }, 2000);
    }, [validate, form, registrationData, updateRegistrationData, register, router]);

    // ─── Animated Style Helper ────────────────────────────
    const animatedStyle = (index: number) => ({
        opacity: animations[index].opacity,
        transform: [{ translateY: animations[index].translateY }],
    });

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header
                title={`Pendaftaran ${registrationData.selectedProgram === 'KOMCAD' ? 'KOMCAD' : 'Bela Negara'}`}
            />

            {/* Stepper */}
            <Stepper steps={STEPS} currentStep={2} />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Section Header */}
                <Animated.View style={[styles.sectionHeader, animatedStyle(0)]}>
                    <Text weight="bold" size="md" color="primary">
                        Informasi Kontak
                    </Text>
                    <Text weight="regular" size="sm" color="secondary" style={{ marginTop: 2 }}>
                        Mohon cantumkan kontak aktif Anda untuk keperluan{'\n'}koordinasi lebih lanjut.
                    </Text>
                </Animated.View>

                {/* Phone Number */}
                <Animated.View style={animatedStyle(1)}>
                    <Input
                        label="Nomor Hp*"
                        placeholder="ex: 081234567890"
                        value={form.phone}
                        onChangeText={(text) => updateField('phone', text.replace(/\D/g, ''))}
                        error={errors.phone}
                        keyboardType="number-pad"
                        maxLength={13}
                    />
                </Animated.View>

                {/* Skills */}
                <Animated.View style={animatedStyle(2)}>
                    <Input
                        label="Keahlian yang di miliki*"
                        placeholder="e.g. Programming, Communication, Leadership"
                        value={form.expertise}
                        onChangeText={(text) => updateField('expertise', text)}
                        error={errors.expertise}
                        multiline
                        numberOfLines={5}
                    />
                </Animated.View>

                {/* Statement & Agreement */}
                <Animated.View style={animatedStyle(3)}>
                    <Text weight="semibold" size="sm" color="primary" style={{ marginBottom: spacing.sm }}>
                        PERNYATAAN & PERSETUJUAN
                    </Text>

                    <View style={styles.agreementBox}>
                        {AGREEMENT_ITEMS.map((item, i) => (
                            <View key={i} style={styles.agreementItem}>
                                <View style={styles.agreementBullet} />
                                <Text weight="regular" size="sm" color="secondary">
                                    {item}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Checkbox */}
                    <Pressable
                        style={styles.checkboxRow}
                        onPress={() => {
                            setForm((prev) => ({ ...prev, agreedToTerms: !prev.agreedToTerms }));
                            if (errors.agreedToTerms) {
                                setErrors((prev) => ({ ...prev, agreedToTerms: undefined }));
                            }
                        }}
                    >
                        <View style={[styles.checkbox, form.agreedToTerms && styles.checkboxActive]}>
                            {form.agreedToTerms && (
                                <Text weight="bold" size="sm" color="white">
                                    ✓
                                </Text>
                            )}
                        </View>
                        <Text weight="regular" size="sm" color="secondary" style={{ flex: 1 }}>
                            Saya menyatakan dengan sadar bahwa semua informasi yang saya berikan adalah benar.
                        </Text>
                    </Pressable>

                    {errors.agreedToTerms && (
                        <Text weight="regular" size="xs" color={colors.error.dark} style={{ marginTop: spacing.xs }}>
                            {errors.agreedToTerms}
                        </Text>
                    )}
                </Animated.View>

                {/* Info Box */}
                <Animated.View style={[styles.infoBox, animatedStyle(4)]}>
                    <Ionicons name="shield-checkmark" color={colors.info.dark} />
                    <Text weight="regular" size="xs" color={colors.info.dark}>
                        Data Anda dilindungi oleh sistem keamanan negara dan hanya digunakan untuk keperluan
                        verifikasi pendaftaran KOMCAD sesuai dengan regulasi perlindungan data pribadi.
                    </Text>
                </Animated.View>
            </ScrollView>

            {/* Footer Buttons */}
            <View style={styles.footer}>
                <View style={styles.footerButtons}>
                    <Button
                        title="Kembali"
                        variant="outline"
                        onPress={() => router.back()}
                        fullWidth={false}
                        style={{ flex: 1 }}
                        disabled={isPending}
                    />
                    <Button
                        title="DAFTAR SEKARANG"
                        onPress={handleSubmit}
                        fullWidth={false}
                        style={{ flex: 3 }}
                        loading={isPending}
                        disabled={isPending}
                    />
                </View>
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
    scrollContent: {
        paddingHorizontal: spacing.lg,
        gap: spacing.md,
        paddingBottom: spacing.lg,
    },
    sectionHeader: {
        marginBottom: spacing.xs,
    },

    // Agreement
    agreementBox: {
        backgroundColor: colors.background.light,
        borderWidth: 1,
        borderColor: colors.border.light,
        borderRadius: 10,
        padding: spacing.sm,
        gap: spacing.sm,
    },
    agreementItem: {
        flexDirection: 'row',
        gap: spacing.xs,
    },
    agreementBullet: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: colors.text.secondary,
        marginTop: 7,
        flexShrink: 0,
    },

    // Checkbox
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.sm,
        marginTop: spacing.sm,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: colors.border.light,
        backgroundColor: colors.background.light,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    checkboxActive: {
        backgroundColor: colors.primary.main,
        borderColor: colors.primary.main,
    },

    // Info
    infoBox: {
        backgroundColor: colors.info.light,
        borderWidth: 1,
        borderColor: colors.info.main,
        borderRadius: 10,
        padding: spacing.sm,
        flexDirection: 'row',
        gap: spacing.sm,
    },

    // Footer
    footer: {
        padding: spacing.lg,
    },
    footerButtons: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
});