import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Image, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text } from '~/components';
import { colors, spacing } from '~/constants';
import { useRegistration } from '~/context/Registrationcontext';
import { formatNIK } from '~/utils/validators';

export default function SuccessScreen() {
    const router = useRouter();
    const { registrationData, resetRegistrationData } = useRegistration();

    const scaleIcon = useRef(new Animated.Value(0)).current;
    const opacityTitle = useRef(new Animated.Value(0)).current;
    const scaleImage = useRef(new Animated.Value(0.9)).current;
    const opacityImage = useRef(new Animated.Value(0)).current;
    const translateYCard = useRef(new Animated.Value(30)).current;
    const opacityCard = useRef(new Animated.Value(0)).current;
    const translateYInfo = useRef(new Animated.Value(30)).current;
    const opacityInfo = useRef(new Animated.Value(0)).current;
    const opacityFooter = useRef(new Animated.Value(0)).current;

    // ─── Entry Animation ──────────────────────────────────
    useEffect(() => {
        Animated.sequence([
            Animated.spring(scaleIcon, {
                toValue: 1,
                tension: 80,
                friction: 6,
                useNativeDriver: true,
            }),

            Animated.timing(opacityTitle, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),

            Animated.parallel([
                Animated.spring(scaleImage, {
                    toValue: 1,
                    tension: 60,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityImage, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),

            Animated.parallel([
                Animated.timing(translateYCard, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityCard, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),

            Animated.parallel([
                Animated.timing(translateYInfo, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityInfo, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),

            Animated.timing(opacityFooter, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    // ─── Format Date ──────────────────────────────────────
    const formatDate = (dateString?: string) => {
        if (!dateString) return new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });

        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    // ─── Get Program Label ────────────────────────────────
    const getProgramLabel = (program?: string) => {
        if (program === 'KOMCAD') return 'Komponen Cadangan';
        if (program === 'BELA_NEGARA') return 'Bela Negara';
        return 'Program Pendaftaran';
    };

    // ─── Summary Data from Registration Context ───────────
    const summary = {
        namaLengkap: registrationData.fullName || '-',
        nik: formatNIK(registrationData.nik || ''),
        program: getProgramLabel(registrationData.selectedProgram),
        tanggalDaftar: formatDate(),
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Success Icon */}
                    <Animated.View
                        style={[
                            styles.iconWrapper,
                            {
                                transform: [{ scale: scaleIcon }],
                                marginBottom: 24,
                            },
                        ]}
                    >
                        <View style={styles.iconCircle}>
                            <Ionicons name="checkmark" size={24} color="#FFFFFF" />
                        </View>
                    </Animated.View>

                    {/* Title */}
                    <Animated.View style={{ opacity: opacityTitle }}>
                        <Text weight="bold" size="xl" color="primary" center>
                            Pendaftaran Berhasil!
                        </Text>
                    </Animated.View>

                    {/* Illustration Image */}
                    <Animated.View
                        style={[
                            styles.imageWrapper,
                            {
                                opacity: opacityImage,
                                transform: [{ scale: scaleImage }],
                            },
                        ]}
                    >
                        <View style={styles.imagePlaceholder}>
                            <Image
                                source={{
                                    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7I5lXanrKLJSah95Pchv8-kyLTYVmqLUotlmC07lNSDM6MUtSKGS2_4LFk8pmEdncui78R14jB1zoWOPNkgOOUH8m3Fb3e9LzMRwmLy2S86L1ApqfALE4NREzuARpGOjciZ85xO7FHFq8_ChQIVwAGdL7qpKvj3JuQs9T8gncRt4rpyrI6KaCROpby7fQDkkHA2hNe7mwPP9XrmoMQJtZPyp1hJAuga5kJ0Tczfxe8RF2jlzep5OV-08eN9AwASYgMijBojON7dI',
                                }}
                                style={styles.illustration}
                                resizeMode="cover"
                            />
                        </View>
                    </Animated.View>

                    {/* Ringkasan Card */}
                    <Animated.View
                        style={[
                            styles.summaryCard,
                            {
                                opacity: opacityCard,
                                transform: [{ translateY: translateYCard }],
                            },
                        ]}
                    >
                        {/* Header */}
                        <View style={styles.summaryHeader}>
                            <View style={styles.summaryHeaderLeft}>
                                <Ionicons name="shield-checkmark" size={20} color={colors.primary.main} />
                                <Text weight="bold" size="sm" color="primary">
                                    RINGKASAN PENDAFTARAN
                                </Text>
                            </View>
                            <View style={styles.statusBadge}>
                                <Text weight="bold" size="xs" color="white">
                                    AKTIF
                                </Text>
                            </View>
                        </View>

                        {/* Rows */}
                        <View style={styles.summaryRow}>
                            <Text weight="regular" size="xs" color="secondary" style={styles.label}>
                                NAMA LENGKAP
                            </Text>
                            <Text weight="bold" size="md" color="primary">
                                {summary.namaLengkap}
                            </Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text weight="regular" size="xs" color="secondary" style={styles.label}>
                                NIK
                            </Text>
                            <Text weight="bold" size="md" color="primary">
                                {summary.nik}
                            </Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.summaryRowInline}>
                            <View style={styles.summaryCol}>
                                <Text weight="regular" size="xs" color="secondary" style={styles.label}>
                                    PROGRAM
                                </Text>
                                <Text weight="bold" size="sm" color="primary">
                                    {summary.program}
                                </Text>
                            </View>
                            <View style={styles.summaryCol}>
                                <Text weight="regular" size="xs" color="secondary" style={styles.label}>
                                    TANGGAL DAFTAR
                                </Text>
                                <Text weight="bold" size="sm" color="primary">
                                    {summary.tanggalDaftar}
                                </Text>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Info Boxes */}
                    <Animated.View
                        style={[
                            styles.infoBoxes,
                            {
                                opacity: opacityInfo,
                                transform: [{ translateY: translateYInfo }],
                            },
                        ]}
                    >
                        <View style={styles.infoBox}>
                            <View style={styles.infoIconWrapper}>
                                <Ionicons name="checkmark-circle" size={20} color={colors.success.dark} />
                            </View>
                            <View style={styles.infoContent}>
                                <Text weight="bold" size="sm" color={colors.success.dark}>
                                    Data Terenkripsi
                                </Text>
                                <Text weight="regular" size="xs" color="secondary">
                                    Data pendaftaran Anda telah berhasil disimpan dengan aman di sistem pusat.
                                </Text>
                            </View>
                        </View>

                        <View style={[styles.infoBox, styles.infoBoxBlue]}>
                            <View style={styles.infoIconWrapperBlue}>
                                <Ionicons name="information-circle" size={20} color={colors.info.dark} />
                            </View>
                            <View style={styles.infoContent}>
                                <Text weight="bold" size="sm" color={colors.info.dark}>
                                    Tahap Selanjutnya
                                </Text>
                                <Text weight="regular" size="xs" color="secondary">
                                    Pantau jadwal seleksi administrasi melalui dashboard secara berkala.
                                </Text>
                            </View>
                        </View>
                    </Animated.View>
                </View>

                {/* Footer */}
                <Animated.View style={[styles.footer, { opacity: opacityFooter }]}>
                    <Button
                        title="Masuk ke Dashboard →"
                        onPress={() => {
                            resetRegistrationData()
                            router.replace('/(app)/(tabs)/home')
                        }}
                    />
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.light,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        padding: spacing.lg,
        paddingVertical: spacing.xxl,
    },

    // Icon
    iconWrapper: {
        marginBottom: spacing.sm,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.success.dark,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.success.dark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },

    // Image
    imageWrapper: {
        marginVertical: spacing.lg,
    },
    imagePlaceholder: {
        width: 380,
        height: 160,
        borderRadius: 16,
        backgroundColor: '#4A7C7E',
        overflow: 'hidden',
    },
    illustration: {
        width: '100%',
        height: '100%',
    },

    // Summary Card
    summaryCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border.light,
        padding: spacing.md,
        marginBottom: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
        paddingBottom: spacing.sm,
    },
    summaryHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    statusBadge: {
        backgroundColor: colors.success.dark,
        paddingVertical: 4,
        paddingHorizontal: spacing.sm,
        borderRadius: 6,
    },
    label: {
        marginBottom: 2,
        letterSpacing: 0.5,
    },
    summaryRow: {
        gap: 4,
        paddingVertical: spacing.sm,
    },
    summaryRowInline: {
        flexDirection: 'row',
        gap: spacing.md,
        paddingTop: spacing.sm,
    },
    summaryCol: {
        flex: 1,
        gap: 4,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border.light,
        marginVertical: spacing.sm,
    },

    // Info Boxes
    infoBoxes: {
        width: '100%',
        gap: spacing.sm,
    },
    infoBox: {
        flexDirection: 'row',
        gap: spacing.sm,
        padding: spacing.md,
        backgroundColor: colors.success.dark + '08',
        borderRadius: 12,
        borderLeftWidth: 3,
        borderLeftColor: colors.success.dark,
    },
    infoBoxBlue: {
        backgroundColor: colors.info.dark + '08',
        borderLeftColor: colors.info.dark,
    },
    infoIconWrapper: {
        marginTop: 2,
    },
    infoIconWrapperBlue: {
        marginTop: 2,
    },
    infoContent: {
        flex: 1,
        gap: 4,
    },

    // Footer
    footer: {
        padding: spacing.lg,
    },
});