import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Image, StyleSheet, View } from 'react-native';
import { Text } from '~/components';
import { spacing } from '~/constants';
import { colors } from '~/constants/colors';
import { useIsAuthenticated } from '~/context/AuthContext';
import { appSelectors, useAppStore } from '~/store/useAppStore';
import Logo from '../assets/images/Logo.png';

export default function SplashScreen() {
    const router = useRouter();

    // Use optimized selectors untuk avoid unnecessary re-renders
    const isAuthenticated = useIsAuthenticated();
    const hasSeenOnboarding = useAppStore(appSelectors.hasSeenOnboarding);

    // Animation refs
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const logoTranslateY = useRef(new Animated.Value(30)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const titleTranslateY = useRef(new Animated.Value(24)).current;
    const subtitleOpacity = useRef(new Animated.Value(0)).current;
    const subtitleTranslateY = useRef(new Animated.Value(18)).current;
    const footerOpacity = useRef(new Animated.Value(0)).current;
    const footerTranslateY = useRef(new Animated.Value(16)).current;

    // Splash animation
    useEffect(() => {
        Animated.stagger(200, [
            Animated.parallel([
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(logoTranslateY, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(titleOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(titleTranslateY, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(subtitleOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(subtitleTranslateY, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(footerOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(footerTranslateY, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    // Navigation logic setelah splash screen
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!hasSeenOnboarding) {
                router.replace('/(onboarding)');
            } else if (isAuthenticated) {
                router.replace('/(app)/(tabs)/home');
            } else {
                router.replace('/(auth)/login');
            }
        }, 2500);

        return () => clearTimeout(timer);
    }, [isAuthenticated, hasSeenOnboarding, router]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Logo Animation */}
                <Animated.View
                    style={{
                        opacity: logoOpacity,
                        transform: [{ translateY: logoTranslateY }],
                    }}
                >
                    <Image source={Logo} style={styles.logo} resizeMode="cover" />
                </Animated.View>

                {/* Title Animation */}
                <Animated.View
                    style={{
                        opacity: titleOpacity,
                        transform: [{ translateY: titleTranslateY }],
                    }}
                >
                    <Text weight="bold" size="xxl" style={styles.title}>
                        BACADNAS
                    </Text>
                </Animated.View>

                {/* Subtitle Animation */}
                <Animated.View
                    style={{
                        opacity: subtitleOpacity,
                        transform: [{ translateY: subtitleTranslateY }],
                    }}
                >
                    <Text weight="regular" size="sm" center style={styles.subtitle}>
                        Pembinaan Komponen Cadangan dan Bela{'\n'}Negara
                    </Text>
                </Animated.View>
            </View>

            {/* Footer Animation */}
            <Animated.View
                style={[
                    styles.footer,
                    {
                        opacity: footerOpacity,
                        transform: [{ translateY: footerTranslateY }],
                    },
                ]}
            >
                <ActivityIndicator size="small" color={colors.primary.main} />
                <Text weight="semibold" size="xs" center style={styles.footerText}>
                    KEMENTERIAN PERTAHANAN RI
                </Text>
            </Animated.View>
        </View>
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
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        paddingVertical: spacing.sm,
    },
    subtitle: {
        paddingHorizontal: spacing.lg,
    },
    footer: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: spacing.xxl + spacing.xxl,
    },
    footerText: {
        paddingTop: spacing.md,
    },
});
