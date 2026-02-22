import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, Text } from '~/components';
import { colors, spacing } from '~/constants';
import { useLogin } from '~/hooks/useLogin';
import { useNetworkStatus } from '~/hooks/useNetworkStatus';
import { isValidNIK } from '~/utils/validators';
import Logo from '../../assets/images/Logo.png';

export default function LoginScreen() {
    const [nik, setNik] = useState('');
    const [nikError, setNikError] = useState('');
    const { mutate: login, isPending, isOffline } = useLogin();
    const { isOnline } = useNetworkStatus();

    // ─── Animated Values ──────────────────────────────────
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const logoScale = useRef(new Animated.Value(0.8)).current;

    const titleOpacity = useRef(new Animated.Value(0)).current;
    const titleTranslateY = useRef(new Animated.Value(20)).current;

    const subtitleOpacity = useRef(new Animated.Value(0)).current;
    const subtitleTranslateY = useRef(new Animated.Value(16)).current;

    const formOpacity = useRef(new Animated.Value(0)).current;
    const formTranslateY = useRef(new Animated.Value(24)).current;

    const footerOpacity = useRef(new Animated.Value(0)).current;
    const footerTranslateY = useRef(new Animated.Value(20)).current;

    const offlineBannerHeight = useRef(new Animated.Value(0)).current;

    // ─── Staggered Entering ───────────────────────────────
    useEffect(() => {
        Animated.stagger(150, [
            // Logo — scale + fade
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    tension: 60,
                    friction: 6,
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            ]),
            // Title
            Animated.parallel([
                Animated.timing(titleOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
                Animated.timing(titleTranslateY, {
                    toValue: 0,
                    duration: 450,
                    useNativeDriver: true,
                }),
            ]),
            // Subtitle
            Animated.parallel([
                Animated.timing(subtitleOpacity, {
                    toValue: 1,
                    duration: 450,
                    useNativeDriver: true,
                }),
                Animated.timing(subtitleTranslateY, {
                    toValue: 0,
                    duration: 450,
                    useNativeDriver: true,
                }),
            ]),
            // Form
            Animated.parallel([
                Animated.timing(formOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.timing(formTranslateY, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
            // Footer
            Animated.parallel([
                Animated.timing(footerOpacity, {
                    toValue: 1,
                    duration: 450,
                    useNativeDriver: true,
                }),
                Animated.timing(footerTranslateY, {
                    toValue: 0,
                    duration: 450,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    // ─── Offline Banner Animation ─────────────────────────
    useEffect(() => {
        Animated.spring(offlineBannerHeight, {
            toValue: !isOnline ? 1 : 0,
            tension: 80,
            friction: 10,
            useNativeDriver: false,
        }).start();
    }, [isOnline]);

    // ─── Handlers ─────────────────────────────────────────
    const handleNikChange = useCallback(
        (text: string) => {
            const numericText = text.replace(/\D/g, '');
            setNik(numericText);

            if (nikError) {
                setNikError('');
            }

            if (numericText.length === 16 && !isValidNIK(numericText)) {
                setNikError('NIK tidak valid. Periksa kembali NIK Anda.');
            }
        },
        [nikError],
    );

    const handleLogin = useCallback(() => {
        if (nik.length !== 16) {
            setNikError('NIK harus 16 digit');
            return;
        }

        if (!isValidNIK(nik)) {
            setNikError('Format NIK tidak valid');
            return;
        }

        // Call login mutation
        login({ nik });
    }, [nik, login]);

    const isValidInput = nik.length === 16 && !nikError;

    const bannerHeight = offlineBannerHeight.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 50],
    });

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Offline Banner */}
            <Animated.View
                style={[
                    styles.offlineBanner,
                    {
                        height: bannerHeight,
                        opacity: offlineBannerHeight,
                    },
                ]}
            >
                <Ionicons name="cloud-offline-outline" size={20} color="#FFFFFF" />
                <Text weight="semibold" size="sm" style={{ color: '#FFFFFF' }}>
                    Mode Offline
                </Text>
            </Animated.View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Logo & Title */}
                    <View style={styles.header}>
                        {/* Logo */}
                        <Animated.View
                            style={{
                                opacity: logoOpacity,
                                transform: [{ scale: logoScale }],
                            }}
                        >
                            <Image source={Logo} style={styles.logo} resizeMode="cover" />
                        </Animated.View>

                        {/* Title */}
                        <Animated.View
                            style={{
                                opacity: titleOpacity,
                                transform: [{ translateY: titleTranslateY }],
                                marginTop: spacing.md,
                                marginBottom: spacing.sm,
                            }}
                        >
                            <Text weight="bold" size="xl" color={colors.text.primary} center>
                                Masuk ke BACADNAS
                            </Text>
                        </Animated.View>

                        {/* Subtitle */}
                        <Animated.View
                            style={{
                                opacity: subtitleOpacity,
                                transform: [{ translateY: subtitleTranslateY }],
                            }}
                        >
                            <Text weight="regular" size="sm" color="secondary" center>
                                Masukkan NIK Anda untuk melanjutkan
                            </Text>
                        </Animated.View>
                    </View>

                    {/* Form */}
                    <Animated.View
                        style={[
                            styles.form,
                            {
                                opacity: formOpacity,
                                transform: [{ translateY: formTranslateY }],
                            },
                        ]}
                    >
                        <Input
                            label="Nomor Induk Kependudukan (NIK)"
                            placeholder="Masukkan 16 digit NIK"
                            value={nik}
                            onChangeText={handleNikChange}
                            keyboardType="number-pad"
                            maxLength={16}
                            disabled={isPending}
                            autoFocus
                            error={nikError}
                            infoTitle="Informasi Penting"
                            info="Gunakan NIK yang sama dengan KTP Anda untuk melanjutkan sertifikat digital dan data kepesertaan"
                        />

                        {/* Offline Info */}
                        {isOffline && (
                            <View style={styles.offlineInfo}>
                                <Ionicons
                                    name="information-circle"
                                    size={16}
                                    color={colors.info.main}
                                />
                                <Text weight="regular" size="xs" color={colors.info.main}>
                                    Data akan dikirim saat koneksi tersedia
                                </Text>
                            </View>
                        )}
                    </Animated.View>

                    {/* Footer */}
                    <Animated.View
                        style={[
                            styles.footer,
                            {
                                opacity: footerOpacity,
                                transform: [{ translateY: footerTranslateY }],
                            },
                        ]}
                    >
                        <Button
                            title="MASUK"
                            onPress={handleLogin}
                            disabled={!isValidInput || isPending}
                            loading={isPending}
                        />
                        <Text weight="semibold" size="xs" center color="secondary">
                            KEMENTERIAN PERTAHANAN RI
                        </Text>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.light,
    },
    logo: {
        width: 120,
        height: 120,
    },
    offlineBanner: {
        backgroundColor: colors.warning.dark,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        overflow: 'hidden',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: spacing.lg,
        gap: spacing.xxl,
        paddingTop: spacing.xxl + spacing.xxl,
        paddingBottom: spacing.xxl,
    },
    header: {
        alignItems: 'center',
    },
    form: {
        flex: 1,
    },
    offlineInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginTop: spacing.sm,
        padding: spacing.sm,
        backgroundColor: colors.info.main + '10',
        borderRadius: 8,
    },
    footer: {
        gap: spacing.xxl,
    },
});
