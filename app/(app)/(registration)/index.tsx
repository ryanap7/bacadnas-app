import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Image, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Header, Text } from '~/components';
import { colors, spacing } from '~/constants';
import { useRegistration } from '~/context/Registrationcontext';

// ─── Types ──────────────────────────────────────────────────
interface Program {
    id: 'komcad' | 'bela-negara' | 'veteran';
    title: string;
    subtitle: string;
    tag?: string;
    requirements: string[];
    buttonLabel: string;
    color: string;
    gradientColors: string[];
    icon: any;
}

// ─── Data ───────────────────────────────────────────────────
const PROGRAMS: Program[] = [
    {
        id: 'komcad',
        title: 'KOMCAD',
        subtitle: 'KOMPONEN CADANGAN',
        tag: 'POPULER',
        requirements: [
            'Usia minimal 18 s.d 35 tahun',
            'Sehat jasmani dan rohani',
            'Lulus seleksi administrasi & kompetensi',
        ],
        buttonLabel: 'Daftar KOMCAD',
        color: colors.primary.dark,
        gradientColors: ['#1a1a2e', '#16213e'],
        icon: require('../../../assets/images/logo-komcad.png'),
    },
    {
        id: 'bela-negara',
        title: 'BELA NEGARA',
        subtitle: 'PENDIDIKAN KESADARAN NASIONAL',
        requirements: [
            'Terbuka untuk semua kalangan (WNI)',
            'Sertifikat resmi dari negara',
            'Pelatihan intensif selama 5 hari',
        ],
        buttonLabel: 'Ikuti Bela Negara',
        color: colors.primary.main,
        gradientColors: ['#dc2626', '#991b1b'],
        icon: require('../../../assets/images/logo-bela-negara.png'),
    },
    {
        id: 'veteran',
        title: 'VETERAN INDONESIA',
        subtitle: 'PROGRAM KESEJAHTERAAN VETERAN',
        requirements: [
            'Purnawirawan TNI/POLRI',
            'Mantan pejuang kemerdekaan',
            'Memiliki SK Penetapan Veteran',
        ],
        buttonLabel: 'Daftar Veteran',
        color: '#D4AF37',
        gradientColors: ['#B8860B', '#D4AF37'],
        icon: require('../../../assets/images/logo-veteran.png'),
    },
];

// ─── Component ──────────────────────────────────────────────
export default function PilihProgramScreen() {
    const router = useRouter();
    const { nik: nikFromLogin } = useLocalSearchParams<{
        nik?: string;
    }>();

    const { updateRegistrationData } = useRegistration();

    // Animation refs
    const headerOpacity = useRef(new Animated.Value(0)).current;
    const headerTranslateY = useRef(new Animated.Value(20)).current;
    const cardAnimations = useRef(
        PROGRAMS.map(() => ({
            opacity: new Animated.Value(0),
            translateY: new Animated.Value(40),
            scale: new Animated.Value(0.95),
        })),
    ).current;

    useEffect(() => {
        // Store NIK in registration context
        if (nikFromLogin) {
            updateRegistrationData({ nik: nikFromLogin });
        }

        // Animations
        Animated.stagger(160, [
            Animated.parallel([
                Animated.timing(headerOpacity, {
                    toValue: 1,
                    duration: 450,
                    useNativeDriver: true,
                }),
                Animated.timing(headerTranslateY, {
                    toValue: 0,
                    duration: 450,
                    useNativeDriver: true,
                }),
            ]),
            ...cardAnimations.map((anim) =>
                Animated.parallel([
                    Animated.timing(anim.opacity, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim.translateY, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim.scale, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]),
            ),
        ]).start();
    }, [nikFromLogin]);

    const handleSelectProgram = (programId: 'komcad' | 'bela-negara' | 'veteran') => {
        // Store selected program in context
        let selectedProgram: 'KOMCAD' | 'BELA_NEGARA' | 'VETERAN';

        if (programId === 'komcad') {
            selectedProgram = 'KOMCAD';
        } else if (programId === 'bela-negara') {
            selectedProgram = 'BELA_NEGARA';
        } else {
            selectedProgram = 'VETERAN';
        }

        updateRegistrationData({ selectedProgram });

        // Navigate to personal data
        router.push(`/(app)/(registration)/${programId}/personal-data` as any);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header title="Pilih Program Anda" />
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <Animated.View
                    style={[
                        styles.header,
                        {
                            opacity: headerOpacity,
                            transform: [{ translateY: headerTranslateY }],
                        },
                    ]}
                >
                    <Text weight="extrabold" size="xl" color="primary">
                        Program Pendaftaran
                    </Text>
                    <Text weight="regular" size="sm" style={{ marginTop: spacing.sm }}>
                        Pilih jalur pengabdian yang sesuai dengan profil dan minat Anda.
                    </Text>
                </Animated.View>

                {/* Program Cards */}
                {PROGRAMS.map((program, index) => (
                    <Animated.View
                        key={program.id}
                        style={[
                            styles.card,
                            {
                                opacity: cardAnimations[index].opacity,
                                transform: [
                                    { translateY: cardAnimations[index].translateY },
                                    { scale: cardAnimations[index].scale },
                                ],
                            },
                        ]}
                    >
                        {/* Card Header with Icon */}
                        <View style={[styles.cardHeader, { backgroundColor: program.color }]}>
                            {/* Decorative Background Pattern */}
                            <View style={styles.patternContainer}>
                                <View style={[styles.pattern, styles.pattern1]} />
                                <View style={[styles.pattern, styles.pattern2]} />
                            </View>

                            {/* Tag */}
                            {program.tag && (
                                <View style={styles.tag}>
                                    <Text weight="bold" size="xs" color="primary">
                                        ★ {program.tag}
                                    </Text>
                                </View>
                            )}

                            {/* Icon */}
                            <View style={styles.iconContainer}>
                                <Image
                                    source={program.icon}
                                    style={styles.icon}
                                    resizeMode="contain"
                                />
                            </View>
                        </View>

                        {/* Card Body */}
                        <View style={styles.cardBody}>
                            <View style={styles.titleContainer}>
                                <Text weight="bold" size="lg" color="primary">
                                    {program.title}
                                </Text>
                                <Text
                                    weight="semibold"
                                    size="xs"
                                    color="secondary"
                                    style={{ marginTop: 4 }}
                                >
                                    {program.subtitle}
                                </Text>
                            </View>

                            <Text
                                weight="regular"
                                size="sm"
                                color="secondary"
                                style={{ marginTop: spacing.sm, lineHeight: 20 }}
                            >
                                {program.id === 'komcad'
                                    ? 'Pendaftaran militer sukarela bagi warga sipil untuk memperkuat pertahanan negara di bawah naungan KEMHAN.'
                                    : 'Pelatihan bela negara dan penanaman nilai cinta tanah air bagi seluruh lapisan masyarakat sipil.'}
                            </Text>

                            {/* Requirements */}
                            <View style={styles.requirementList}>
                                <Text
                                    weight="semibold"
                                    size="sm"
                                    color="primary"
                                    style={{ marginBottom: spacing.xs }}
                                >
                                    Persyaratan:
                                </Text>
                                {program.requirements.map((req, i) => (
                                    <View key={i} style={styles.requirementItem}>
                                        <View
                                            style={[
                                                styles.requirementDot,
                                                { backgroundColor: program.color },
                                            ]}
                                        />
                                        <Text
                                            weight="regular"
                                            size="sm"
                                            color="secondary"
                                            style={{ flex: 1, lineHeight: 20 }}
                                        >
                                            {req}
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            {/* Button */}
                            <Button
                                title={program.buttonLabel}
                                style={[styles.button, { backgroundColor: program.color }]}
                                onPress={() => handleSelectProgram(program.id)}
                            />
                        </View>
                    </Animated.View>
                ))}

                {/* Bottom Spacing */}
                <View style={{ height: spacing.xl }} />
            </ScrollView>
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
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
    },
    card: {
        backgroundColor: colors.background.light,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        overflow: 'hidden',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border.light,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    cardHeader: {
        height: 200,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    patternContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
    },
    pattern: {
        position: 'absolute',
        backgroundColor: '#ffffff',
        borderRadius: 100,
    },
    pattern1: {
        width: 200,
        height: 200,
        top: -100,
        right: -50,
    },
    pattern2: {
        width: 150,
        height: 150,
        bottom: -75,
        left: -30,
    },
    tag: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        backgroundColor: colors.secondary.main,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderRadius: 6,
        zIndex: 10,
    },
    iconContainer: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 60,
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    icon: {
        width: 90,
        height: 90,
    },
    cardBody: {
        padding: spacing.lg,
    },
    titleContainer: {
        borderLeftWidth: 4,
        borderLeftColor: colors.primary.main,
        paddingLeft: spacing.sm,
    },
    requirementList: {
        marginTop: spacing.lg,
        marginBottom: spacing.md,
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.sm,
        marginTop: spacing.sm,
    },
    requirementDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginTop: 7,
    },
    button: {
        marginTop: spacing.sm,
    },
});
