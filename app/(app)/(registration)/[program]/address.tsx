import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Header, Input, Stepper, Text } from '~/components';
import { colors, spacing } from '~/constants';
import { useRegistration } from '~/context/Registrationcontext';

// ─── Types ──────────────────────────────────────────────────
interface AddressForm {
    province: string;
    city: string;
    district: string;
    subDistrict: string;
    address: string;
    postalCode: string;
}

const STEPS = [
    { key: 'personal', label: 'DATA PRIBADI' },
    { key: 'address', label: 'ALAMAT' },
    { key: 'contact', label: 'KONTAK' },
];

// ─── Component ──────────────────────────────────────────────
export default function AddressScreen() {
    const router = useRouter();
    const { registrationData, updateRegistrationData } = useRegistration();

    const [form, setForm] = useState<AddressForm>({
        province: registrationData.province || '',
        city: registrationData.city || '',
        district: registrationData.district || '',
        subDistrict: registrationData.subDistrict || '',
        address: registrationData.address || '',
        postalCode: registrationData.postalCode || '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof AddressForm, string>>>({});

    // ─── Animated Values ──────────────────────────────────
    const animations = useRef(
        Array.from({ length: 7 }, () => ({
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
        (field: keyof AddressForm, value: string) => {
            setForm((prev) => ({ ...prev, [field]: value }));
            if (errors[field]) {
                setErrors((prev) => ({ ...prev, [field]: undefined }));
            }

            // Reset dependent fields when parent changes
            if (field === 'province') {
                setForm((prev) => ({ ...prev, city: '', district: '', subDistrict: '' }));
            } else if (field === 'city') {
                setForm((prev) => ({ ...prev, district: '', subDistrict: '' }));
            } else if (field === 'district') {
                setForm((prev) => ({ ...prev, subDistrict: '' }));
            }
        },
        [errors]
    );

    const validate = useCallback((): boolean => {
        const newErrors: Partial<Record<keyof AddressForm, string>> = {};

        if (!form.province) newErrors.province = 'Provinsi wajib diisi';
        if (!form.city) newErrors.city = 'Kabupaten/Kota wajib diisi';
        if (!form.district) newErrors.district = 'Kecamatan wajib diisi';
        if (!form.subDistrict) newErrors.subDistrict = 'Kelurahan/Desa wajib diisi';
        if (!form.address.trim()) newErrors.address = 'Alamat Lengkap wajib diisi';
        if (!form.postalCode) newErrors.postalCode = 'Kode Pos wajib diisi';
        else if (form.postalCode.length !== 5) newErrors.postalCode = 'Kode Pos harus 5 digit';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [form]);

    const handleNext = useCallback(() => {
        if (!validate()) return;

        // Update registration context
        updateRegistrationData({
            province: form.province,
            city: form.city,
            district: form.district,
            subDistrict: form.subDistrict,
            address: form.address,
            postalCode: form.postalCode,
        });

        // Navigate to contact screen
        router.push('/(app)/(registration)/contact' as any);
    }, [form, updateRegistrationData, validate, router]);

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
            <Stepper steps={STEPS} currentStep={1} />
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
                            Alamat Domisili
                        </Text>
                        <Text weight="regular" size="sm" color="secondary" style={{ marginTop: 2 }}>
                            Silahkan lengkapi alamat tempat tinggal Anda saat ini.
                        </Text>
                    </Animated.View>

                    {/* Province */}
                    <Animated.View style={animatedStyle(1)}>
                        <Input
                            label="Provinsi*"
                            placeholder="Masukkan Provinsi"
                            value={form.province}
                            onChangeText={(text) => updateField('province', text)}
                            error={errors.province}
                        />
                    </Animated.View>

                    {/* City / Regency */}
                    <Animated.View style={animatedStyle(2)}>
                        <Input
                            label="Kabupaten/Kota*"
                            placeholder="Masukkan Kabupaten/Kota"
                            value={form.city}
                            onChangeText={(text) => updateField('city', text)}
                            error={errors.city}
                        />
                    </Animated.View>

                    {/* District */}
                    <Animated.View style={animatedStyle(3)}>
                        <Input
                            label="Kecamatan*"
                            placeholder="Masukkan Kecamatan"
                            value={form.district}
                            onChangeText={(text) => updateField('district', text)}
                            error={errors.district}
                        />
                    </Animated.View>

                    {/* Village / Sub-district */}
                    <Animated.View style={animatedStyle(4)}>
                        <Input
                            label="Kelurahan/Desa*"
                            placeholder="Masukkan Kelurahan/Desa"
                            value={form.subDistrict}
                            onChangeText={(text) => updateField('subDistrict', text)}
                            error={errors.subDistrict}
                        />
                    </Animated.View>

                    {/* Full Address */}
                    <Animated.View style={animatedStyle(5)}>
                        <Input
                            label="Alamat Lengkap*"
                            placeholder="Nama jalan, nomor rumah, RT/RW"
                            value={form.address}
                            onChangeText={(text) => updateField('address', text)}
                            error={errors.address}
                            multiline
                            numberOfLines={5}
                        />
                    </Animated.View>

                    {/* Postal Code */}
                    <Animated.View style={animatedStyle(6)}>
                        <Input
                            label="Kode Pos*"
                            placeholder="5 digit angka"
                            value={form.postalCode}
                            onChangeText={(text) => updateField('postalCode', text.replace(/\D/g, ''))}
                            error={errors.postalCode}
                            keyboardType="number-pad"
                            maxLength={5}
                        />
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Footer Buttons */}
            <View style={styles.footer}>
                <View style={styles.footerButtons}>
                    <Button
                        title="Kembali"
                        variant="outline"
                        onPress={() => router.back()}
                        fullWidth={false}
                        style={{ flex: 1 }}
                    />
                    <Button
                        title="Lanjutkan →"
                        onPress={handleNext}
                        fullWidth={false}
                        style={{ flex: 1 }}
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
    footer: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
        backgroundColor: colors.background.light,
    },
    footerButtons: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
});