import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components';
import { colors, spacing } from '~/constants';

export default function LoadingScreen() {
    const pulseOpacity = useRef(new Animated.Value(0.4)).current;
    const spinValue = useRef(new Animated.Value(0)).current;
    const progressValue = useRef(new Animated.Value(0)).current;

    // ─── Pulse Animation ──────────────────────────────────
    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseOpacity, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseOpacity, {
                    toValue: 0.4,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, [pulseOpacity]);

    // ─── Spinner Rotation ─────────────────────────────────
    useEffect(() => {
        const spin = Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        );
        spin.start();
        return () => spin.stop();
    }, [spinValue]);

    // ─── Progress Bar Animation ───────────────────────────
    useEffect(() => {
        const progress = Animated.loop(
            Animated.sequence([
                Animated.timing(progressValue, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(progressValue, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        );
        progress.start();
        return () => progress.stop();
    }, [progressValue]);

    const spinRotation = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={styles.content}>
                {/* Loader Icon */}
                <View style={styles.loaderWrapper}>
                    <View style={styles.iconCircle}>
                        <Text style={styles.iconText}>📋</Text>
                    </View>
                    {/* Circular Spinner */}
                    <Animated.View
                        style={[
                            styles.spinner,
                            {
                                transform: [{ rotate: spinRotation }],
                            },
                        ]}
                    >
                        <View style={styles.spinnerArc} />
                    </Animated.View>
                </View>

                {/* Animated Text */}
                <Animated.View style={{ opacity: pulseOpacity }}>
                    <Text weight="bold" size="xl" color="primary" center>
                        Memproses pendaftaran
                    </Text>
                    <Text weight="bold" size="xl" color="primary" center>
                        Anda...
                    </Text>
                </Animated.View>

                <Text weight="regular" size="md" color="secondary" center style={{ marginTop: spacing.md }}>
                    Mohon tunggu sebentar
                </Text>

                {/* Progress Bar */}
                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBackground}>
                        <Animated.View
                            style={[
                                styles.progressBarFill,
                                {
                                    transform: [{ scaleX: progressValue }],
                                },
                            ]}
                        />
                    </View>
                </View>
            </View>
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
        justifyContent: 'center',
        gap: spacing.lg,
        paddingHorizontal: spacing.lg,
    },
    loaderWrapper: {
        width: 140,
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        zIndex: 2,
    },
    iconText: {
        fontSize: 48,
    },
    spinner: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 4,
        borderColor: 'transparent',
        borderTopColor: colors.primary.main,
        borderRightColor: colors.primary.main,
        zIndex: 1,
    },
    spinnerArc: {
        width: '100%',
        height: '100%',
    },
    progressBarContainer: {
        width: '60%',
        marginTop: spacing.md,
    },
    progressBarBackground: {
        width: '100%',
        height: 6,
        backgroundColor: colors.border.light,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.primary.main,
        borderRadius: 3,
    },
});