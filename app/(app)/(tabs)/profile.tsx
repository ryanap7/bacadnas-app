import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Modal,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Header, Text } from '~/components';
import { colors, spacing } from '~/constants';
import { useLogout } from '~/hooks/useLogout';
import { useProfile } from '~/hooks/useProfile';
import {
    formatDate,
    formatGender,
    formatNIK,
    formatPhone,
    formatProgramName,
    getFullAddress,
    getVerificationBadgeColor,
    getYear,
} from '~/utils/profile.utils';

// ─── Component ──────────────────────────────────────────────
export default function ProfileScreen() {
    const router = useRouter();
    const { mutate: logout, isPending: isLoggingOut } = useLogout();
    const { profile, isLoading, isError, error, refetch, isRefetching } = useProfile();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // ─── Animated Values ──────────────────────────────────
    const animations = useRef(
        Array.from({ length: 7 }, () => ({
            opacity: new Animated.Value(0),
            translateY: new Animated.Value(30),
        })),
    ).current;

    const modalScale = useRef(new Animated.Value(0.8)).current;
    const modalOpacity = useRef(new Animated.Value(0)).current;

    // ─── Staggered Entering Animation ─────────────────────
    useEffect(() => {
        if (!isLoading && profile) {
            Animated.stagger(
                70,
                animations.map((anim) =>
                    Animated.parallel([
                        Animated.timing(anim.opacity, {
                            toValue: 1,
                            duration: 400,
                            useNativeDriver: true,
                        }),
                        Animated.timing(anim.translateY, {
                            toValue: 0,
                            duration: 400,
                            useNativeDriver: true,
                        }),
                    ]),
                ),
            ).start();
        }
    }, [isLoading, profile]);

    // ─── Modal Animations ─────────────────────────────────
    useEffect(() => {
        if (showLogoutModal) {
            Animated.parallel([
                Animated.spring(modalScale, {
                    toValue: 1,
                    tension: 80,
                    friction: 10,
                    useNativeDriver: true,
                }),
                Animated.timing(modalOpacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(modalScale, {
                    toValue: 0.8,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(modalOpacity, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [showLogoutModal]);

    // ─── Handlers ──────────────────────────────────────────
    const handleLogout = () => {
        setShowLogoutModal(false);
        setTimeout(() => {
            logout();
        }, 200);
    };

    const handleRefresh = () => {
        refetch();
    };

    // ─── Animated Style Helper ────────────────────────────
    const animatedStyle = (index: number) => ({
        opacity: animations[index]?.opacity || 1,
        transform: [{ translateY: animations[index]?.translateY || 0 }],
    });

    // ─── Loading State ─────────────────────────────────────
    if (isLoading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <Header title="PROFIL SAYA" withBackButton={false} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary.main} />
                    <Text
                        weight="regular"
                        size="sm"
                        color="secondary"
                        style={{ marginTop: spacing.md }}
                    >
                        Memuat profil...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    // ─── Error State ───────────────────────────────────────
    if (isError || !profile) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <Header title="PROFIL SAYA" withBackButton={false} />
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={64} color={colors.error.main} />
                    <Text
                        weight="bold"
                        size="lg"
                        color="primary"
                        center
                        style={{ marginTop: spacing.md }}
                    >
                        Gagal Memuat Profil
                    </Text>
                    <Text
                        weight="regular"
                        size="sm"
                        color="secondary"
                        center
                        style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}
                    >
                        {error?.message || 'Terjadi kesalahan saat memuat profil'}
                    </Text>
                    <Button title="Coba Lagi" onPress={handleRefresh} variant="primary" size="md" />
                </View>
            </SafeAreaView>
        );
    }

    // ─── Format Data ───────────────────────────────────────
    const verificationBadge = getVerificationBadgeColor(profile.isVerified);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Header title="PROFIL SAYA" withBackButton={false} />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={handleRefresh}
                        colors={[colors.primary.main]}
                        tintColor={colors.primary.main}
                    />
                }
            >
                {/* Profile Header Card */}
                <Animated.View style={[styles.profileHeaderCard, animatedStyle(1)]}>
                    <View style={styles.avatarWrapper}>
                        <View style={styles.avatarPlaceholder}>
                            <Text weight="bold" size="xxl" color="white">
                                {profile.fullName.substring(0, 2).toUpperCase()}
                            </Text>
                        </View>
                        <Pressable style={styles.cameraButton}>
                            <Ionicons name="camera" size={16} color="#FFFFFF" />
                        </Pressable>
                    </View>

                    <Text
                        weight="bold"
                        size="xl"
                        color="primary"
                        center
                        style={{ marginTop: spacing.sm }}
                    >
                        {profile.fullName}
                    </Text>
                    <Text weight="regular" size="sm" color="secondary" center>
                        NIK: {formatNIK(profile.nik)}
                    </Text>
                </Animated.View>

                {/* Data Diri Section */}
                <Animated.View style={animatedStyle(2)}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="person" size={18} color={colors.primary.main} />
                        <Text weight="bold" size="sm" color="primary">
                            Data Diri
                        </Text>
                    </View>

                    <View style={styles.infoCard}>
                        <InfoRow label="Tempat Lahir" value={profile.birthPlace} />
                        <InfoRow label="Tanggal Lahir" value={formatDate(profile.birthDate)} />
                        <InfoRow
                            label="Jenis Kelamin"
                            value={formatGender(profile.gender)}
                            noBorder
                        />
                    </View>
                </Animated.View>

                {/* Alamat Section */}
                <Animated.View style={animatedStyle(3)}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="location" size={18} color={colors.primary.main} />
                        <Text weight="bold" size="sm" color="primary">
                            Alamat
                        </Text>
                    </View>

                    <View style={styles.infoCard}>
                        <View style={styles.fullAddressRow}>
                            <Text weight="regular" size="sm" color="secondary">
                                Alamat Lengkap
                            </Text>
                            <Text
                                weight="semibold"
                                size="sm"
                                color="primary"
                                style={{ marginTop: 4 }}
                            >
                                {getFullAddress(profile)}
                            </Text>
                        </View>
                        <InfoRow label="Kota/Kabupaten" value={profile.city} />
                        <InfoRow label="Provinsi" value={profile.province} />
                        <InfoRow label="Kode Pos" value={profile.postalCode} noBorder />
                    </View>
                </Animated.View>

                {/* Kontak Section */}
                <Animated.View style={animatedStyle(4)}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="call" size={18} color={colors.primary.main} />
                        <Text weight="bold" size="sm" color="primary">
                            Kontak
                        </Text>
                    </View>

                    <View style={styles.infoCard}>
                        <InfoRow label="Nomor Telepon" value={formatPhone(profile.phone)} />
                        <View style={styles.phoneRow}>
                            <View style={styles.infoRowContent}>
                                <Text weight="regular" size="sm" color="secondary">
                                    WhatsApp
                                </Text>
                                <Text weight="semibold" size="sm" color="primary">
                                    {formatPhone(profile.whatsapp)}
                                </Text>
                            </View>
                            <View style={styles.whatsappBadge}>
                                <Ionicons
                                    name="logo-whatsapp"
                                    size={14}
                                    color={colors.success.dark}
                                />
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* Keahlian Section */}
                <Animated.View style={animatedStyle(5)}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="bulb" size={18} color={colors.primary.main} />
                        <Text weight="bold" size="sm" color="primary">
                            Keahlian
                        </Text>
                    </View>

                    <View style={styles.infoCard}>
                        <View style={styles.expertiseContainer}>
                            {profile.expertise.map((skill, index) => (
                                <View key={index} style={styles.expertiseTag}>
                                    <Text weight="medium" size="xs" color="primary">
                                        {skill}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </Animated.View>

                {/* Program Section */}
                <Animated.View style={animatedStyle(6)}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="shield-checkmark" size={18} color={colors.primary.main} />
                        <Text weight="bold" size="sm" color="primary">
                            Program
                        </Text>
                    </View>

                    <View style={styles.infoCard}>
                        <InfoRow label="Instansi" value="KEMENTERIAN PERTAHANAN RI" />
                        <InfoRow
                            label="Jenis Layanan"
                            value={formatProgramName(profile.selectedProgram)}
                        />
                        <InfoRow
                            label="Tahun Bergabung"
                            value={getYear(profile.programSelectedAt)}
                            noBorder
                        />
                    </View>
                </Animated.View>

                {/* Logout Button */}
                <Animated.View style={[animatedStyle(7), { marginTop: spacing.md }]}>
                    <Button
                        title="Keluar"
                        onPress={() => setShowLogoutModal(true)}
                        variant="outline"
                        size="md"
                        style={{ borderColor: colors.error.dark }}
                        textStyle={{ color: colors.error.dark }}
                    />
                </Animated.View>
            </ScrollView>

            {/* Logout Modal */}
            <Modal
                visible={showLogoutModal}
                transparent
                animationType="none"
                onRequestClose={() => setShowLogoutModal(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setShowLogoutModal(false)}>
                    <Animated.View
                        style={[
                            styles.modalContent,
                            {
                                opacity: modalOpacity,
                                transform: [{ scale: modalScale }],
                            },
                        ]}
                        onStartShouldSetResponder={() => true}
                    >
                        <View style={styles.modalTopBar} />

                        {/* Icon */}
                        <View style={styles.logoutIconWrapper}>
                            <View style={styles.logoutIconCircle}>
                                <Ionicons
                                    name="log-out-outline"
                                    size={40}
                                    color={colors.error.dark}
                                />
                            </View>
                        </View>

                        {/* Text Content */}
                        <View style={styles.modalTextContent}>
                            <Text weight="bold" size="xl" color="primary" center>
                                Konfirmasi Keluar
                            </Text>
                            <Text
                                weight="regular"
                                size="sm"
                                color="secondary"
                                center
                                style={{ marginTop: spacing.xs }}
                            >
                                Apakah Anda yakin ingin keluar dari aplikasi?
                            </Text>
                        </View>

                        {/* Buttons */}
                        <View style={styles.modalButtons}>
                            <Pressable
                                style={styles.modalCancelButton}
                                onPress={() => setShowLogoutModal(false)}
                            >
                                <Text weight="semibold" size="md" color="primary">
                                    Batal
                                </Text>
                            </Pressable>

                            <Pressable
                                style={styles.modalLogoutButton}
                                onPress={handleLogout}
                                disabled={isLoggingOut}
                            >
                                <Text weight="bold" size="md" color="white">
                                    {isLoggingOut ? 'Memproses...' : 'Keluar'}
                                </Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

// ─── Info Row Component ─────────────────────────────────────
function InfoRow({ label, value, noBorder }: { label: string; value: string; noBorder?: boolean }) {
    return (
        <View style={[styles.infoRow, !noBorder && styles.infoRowBorder]}>
            <Text weight="regular" size="sm" color="secondary">
                {label}
            </Text>
            <Text weight="semibold" size="sm" color="primary">
                {value}
            </Text>
        </View>
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
    scrollContent: {
        padding: spacing.lg,
        gap: spacing.lg,
        paddingBottom: spacing.xxl,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },

    // Profile Header
    profileHeaderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: spacing.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border.light,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primary.main,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: colors.primary.light,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primary.main,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: spacing.md,
        borderRadius: 6,
        marginTop: spacing.sm,
    },

    // Section
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginBottom: spacing.sm,
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border.light,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    infoRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    infoRowContent: {
        flex: 1,
        gap: 2,
    },
    fullAddressRow: {
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    phoneRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    whatsappBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.success.dark + '15',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Expertise
    expertiseContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
        paddingVertical: spacing.xs,
    },
    expertiseTag: {
        backgroundColor: colors.primary.main + '10',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.primary.main + '20',
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        width: '100%',
        maxWidth: 380,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.3,
        shadowRadius: 30,
        elevation: 24,
    },
    modalTopBar: {
        height: 4,
        backgroundColor: colors.error.dark,
        width: '100%',
    },
    logoutIconWrapper: {
        alignItems: 'center',
        paddingTop: spacing.xl,
        paddingBottom: spacing.md,
    },
    logoutIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.error.dark + '12',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.error.dark + '20',
    },
    modalTextContent: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.lg,
    },
    modalButtons: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
    },
    modalCancelButton: {
        flex: 1,
        paddingVertical: spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderRightColor: colors.border.light,
        backgroundColor: '#FFFFFF',
    },
    modalLogoutButton: {
        flex: 1,
        paddingVertical: spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.error.dark,
    },
});
