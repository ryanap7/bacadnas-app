import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Modal,
    Pressable,
    RefreshControl,
    ScrollView,
    Share,
    StyleSheet,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Text } from '~/components';
import { colors, spacing } from '~/constants';
import { useCertificates } from '~/hooks/useCertificates';
import { useProfile } from '~/hooks/useProfile';
import type { Certificate } from '~/types/certificate';
import {
    formatCertificateDate,
    formatCertificateNumber,
    generateShareMessage,
    getCertificateStatusColor,
    getCertificateStatusText,
    getProgramBadgeText,
    getProgramTypeName,
    getValidityPeriodText,
    isCertificateActive,
    sortCertificatesByDate
} from '~/utils/certificate.utils';

// ─── Component ──────────────────────────────────────────────
export default function CertificateScreen() {
    const { certificates, isLoading, isError, error, refetch, isRefetching } = useCertificates();
    const { profile } = useProfile();
    const [showPreview, setShowPreview] = useState(false);
    const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    // ─── Animated Values ──────────────────────────────────
    const animations = useRef(
        Array.from({ length: 5 }, () => ({
            opacity: new Animated.Value(0),
            translateY: new Animated.Value(30),
        }))
    ).current;

    const previewScale = useRef(new Animated.Value(0.9)).current;
    const previewOpacity = useRef(new Animated.Value(0)).current;

    // ─── Staggered Entering Animation ─────────────────────
    useEffect(() => {
        if (!isLoading && certificates) {
            Animated.stagger(
                80,
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
                    ])
                )
            ).start();
        }
    }, [isLoading, certificates]);

    // ─── Preview Modal Animations ─────────────────────────
    useEffect(() => {
        if (showPreview) {
            Animated.parallel([
                Animated.spring(previewScale, {
                    toValue: 1,
                    tension: 65,
                    friction: 9,
                    useNativeDriver: true,
                }),
                Animated.timing(previewOpacity, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(previewScale, {
                    toValue: 0.9,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(previewOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [showPreview]);

    // ─── Handlers ──────────────────────────────────────────
    const handleDownload = async (certificate: Certificate) => {
        console.log('Downloded')
        setIsDownloading(false);
    };

    const handleShare = async (certificate: Certificate) => {
        try {
            const message = generateShareMessage(certificate, profile?.fullName || 'User');

            await Share.share({
                message,
                title: certificate.title,
            });
        } catch (error) {
            console.error('Share error:', error);
        }
    };

    const handlePreview = (certificate: Certificate) => {
        setSelectedCertificate(certificate);
        setShowPreview(true);
    };

    const handleClosePreview = () => {
        setShowPreview(false);
        setTimeout(() => {
            setSelectedCertificate(null);
        }, 300);
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
                <Header title='SERTIFIKAT SAYA' withBackButton={false} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary.main} />
                    <Text
                        weight="regular"
                        size="sm"
                        color="secondary"
                        style={{ marginTop: spacing.md }}
                    >
                        Memuat sertifikat...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    // ─── Error State ───────────────────────────────────────
    if (isError || !certificates) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <Header title='SERTIFIKAT SAYA' withBackButton={false} />
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={64} color={colors.error.main} />
                    <Text
                        weight="bold"
                        size="lg"
                        color="primary"
                        center
                        style={{ marginTop: spacing.md }}
                    >
                        Gagal Memuat Sertifikat
                    </Text>
                    <Text
                        weight="regular"
                        size="sm"
                        color="secondary"
                        center
                        style={{ marginTop: spacing.xs }}
                    >
                        {error?.message || 'Terjadi kesalahan saat memuat data'}
                    </Text>
                    <Pressable
                        style={styles.retryButton}
                        onPress={() => refetch()}
                    >
                        <Ionicons name="refresh" size={20} color="#FFFFFF" />
                        <Text weight="semibold" size="md" color="white">
                            Coba Lagi
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    // ─── Empty State ───────────────────────────────────────
    if (certificates.length === 0) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <Header title='SERTIFIKAT SAYA' withBackButton={false} />
                <View style={styles.emptyContainer}>
                    <Ionicons name="document-text-outline" size={64} color={colors.text.secondary} />
                    <Text
                        weight="bold"
                        size="lg"
                        color="primary"
                        center
                        style={{ marginTop: spacing.md }}
                    >
                        Belum Ada Sertifikat
                    </Text>
                    <Text
                        weight="regular"
                        size="sm"
                        color="secondary"
                        center
                        style={{ marginTop: spacing.xs }}
                    >
                        Anda belum memiliki sertifikat yang diterbitkan
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    // ─── Process Data ──────────────────────────────────────
    const sortedCertificates = sortCertificatesByDate(certificates);
    const activeCertificate = sortedCertificates.find(cert => isCertificateActive(cert)) || sortedCertificates[0];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Header title='SERTIFIKAT SAYA' withBackButton={false} />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                        colors={[colors.primary.main]}
                        tintColor={colors.primary.main}
                    />
                }
            >
                {/* Info Box */}
                <Animated.View style={[styles.infoBox, animatedStyle(1)]}>
                    <Ionicons name="information-circle" size={20} color={colors.info.dark} />
                    <View style={{ flex: 1 }}>
                        <Text weight="semibold" size="sm" color={colors.info.dark}>
                            Informasi Sertifikat
                        </Text>
                        <Text weight="regular" size="xs" color={colors.info.dark} style={{ marginTop: 2, lineHeight: 20 }}>
                            Sertifikat ini merupakan dokumen resmi negara yang sah dan diakui secara hukum untuk Personel {getProgramTypeName(activeCertificate.programType)}.
                        </Text>
                    </View>
                </Animated.View>

                {/* Certificate Card */}
                <Animated.View style={[styles.certificateCard, animatedStyle(2)]}>
                    {/* Status Badge */}
                    <View style={[
                        styles.statusBadge,
                        { backgroundColor: getCertificateStatusColor(activeCertificate.status).background }
                    ]}>
                        <Text
                            weight="bold"
                            size="xs"
                            style={{ color: getCertificateStatusColor(activeCertificate.status).text }}
                        >
                            {getCertificateStatusText(activeCertificate.status)}
                        </Text>
                    </View>

                    {/* Certificate Header */}
                    <View style={styles.certHeader}>
                        <View style={styles.certIconWrapper}>
                            <Ionicons name="shield-checkmark" size={40} color="#FFFFFF" />
                        </View>
                        <View style={styles.certBadgeWrapper}>
                            <Text weight="bold" size="sm" color="white" center>
                                {getProgramBadgeText(activeCertificate)}
                            </Text>
                        </View>
                    </View>

                    {/* Certificate Body */}
                    <View style={styles.certBody}>
                        <Text weight="semibold" size="xs" color="secondary" style={{ letterSpacing: 1 }}>
                            {getProgramTypeName(activeCertificate.programType)}
                        </Text>
                        <Text weight="bold" size="xl" color="primary" style={{ marginTop: 4 }}>
                            {activeCertificate.title}
                        </Text>

                        {/* Details */}
                        <View style={styles.certDetails}>
                            <View>
                                <Text weight="regular" size="xs" color="secondary">
                                    NAMA LENGKAP
                                </Text>
                                <Text weight="bold" size="md" color="primary">
                                    {profile?.fullName || 'Loading...'}
                                </Text>
                            </View>

                            <View style={styles.certDetailRow}>
                                <View style={styles.certDetailCol}>
                                    <Text weight="regular" size="xs" color="secondary">
                                        NIK
                                    </Text>
                                    <Text weight="semibold" size="sm" color="primary">
                                        {profile?.nik || 'Loading...'}
                                    </Text>
                                </View>
                                <View style={styles.certDetailCol}>
                                    <Text weight="regular" size="xs" color="secondary">
                                        NO. SERTIFIKAT
                                    </Text>
                                    <Text weight="semibold" size="sm" color="primary">
                                        {formatCertificateNumber(activeCertificate.certificateNumber)}
                                    </Text>
                                </View>
                            </View>

                            <View>
                                <Text weight="regular" size="xs" color="secondary">
                                    TERBIT
                                </Text>
                                <Text weight="semibold" size="sm" color="primary">
                                    {formatCertificateDate(activeCertificate.issuedDate)}
                                </Text>
                            </View>

                            {activeCertificate.batchNumber && (
                                <View>
                                    <Text weight="regular" size="xs" color="secondary">
                                        BATCH
                                    </Text>
                                    <Text weight="semibold" size="sm" color="primary">
                                        {activeCertificate.batchNumber}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </Animated.View>

                {/* Action Buttons */}
                <Animated.View style={[styles.actionButtons, animatedStyle(3)]}>
                    <Pressable
                        style={styles.previewButton}
                        onPress={() => handlePreview(activeCertificate)}
                    >
                        <Ionicons name="eye" size={20} color={colors.text.primary} />
                        <Text weight="semibold" size="md" color="primary">
                            Lihat
                        </Text>
                    </Pressable>

                    <Pressable
                        style={[styles.downloadButton, isDownloading && styles.downloadButtonDisabled]}
                        onPress={() => handleDownload(activeCertificate)}
                        disabled={isDownloading}
                    >
                        {isDownloading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Ionicons name="download" size={20} color="#FFFFFF" />
                        )}
                        <Text weight="bold" size="md" color="white">
                            {isDownloading ? 'Downloading...' : 'Download PDF'}
                        </Text>
                    </Pressable>

                    <Pressable
                        style={styles.shareButton}
                        onPress={() => handleShare(activeCertificate)}
                    >
                        <Ionicons name="share-social" size={20} color={colors.text.primary} />
                    </Pressable>
                </Animated.View>

                {/* Authenticity Features */}
                <Animated.View style={animatedStyle(4)}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="shield-checkmark" size={20} color={colors.success.dark} />
                        <Text weight="bold" size="md" color="primary">
                            KEASLIAN SERTIFIKAT
                        </Text>
                    </View>

                    <View style={styles.securityList}>
                        {activeCertificate.authenticity.map((item, index) => (
                            <View key={index} style={styles.securityItem}>
                                <View style={styles.securityIconWrapper}>
                                    <Ionicons
                                        name={item.icon as any}
                                        size={18}
                                        color={colors.success.dark}
                                    />
                                </View>
                                <Text weight="medium" size="sm" color="primary" style={{ flex: 1 }}>
                                    {item.text}
                                </Text>
                            </View>
                        ))}
                    </View>
                </Animated.View>

                {/* Validity Period */}
                <Animated.View style={[styles.validityCard, animatedStyle(5)]}>
                    <View style={styles.validityHeader}>
                        <Ionicons name="time" size={20} color={colors.primary.main} />
                        <Text weight="bold" size="sm" color="primary">
                            MASA BERLAKU
                        </Text>
                    </View>
                    <Text weight="regular" size="sm" color="secondary" style={{ marginTop: spacing.xs }}>
                        {getValidityPeriodText(activeCertificate)}
                    </Text>
                </Animated.View>
            </ScrollView>

            {/* Preview Modal */}
            <Modal
                visible={showPreview}
                transparent
                animationType="none"
                onRequestClose={handleClosePreview}
            >
                <Animated.View
                    style={[
                        styles.previewOverlay,
                        { opacity: previewOpacity },
                    ]}
                >
                    <SafeAreaView style={styles.previewSafeArea} edges={['top']}>
                        {/* Header */}
                        <View style={styles.previewHeader}>
                            <Pressable
                                style={styles.previewBackButton}
                                onPress={handleClosePreview}
                            >
                                <Ionicons name="close" size={28} color="#FFFFFF" />
                            </Pressable>
                            <Pressable
                                style={styles.previewShareButton}
                                onPress={() => selectedCertificate && handleShare(selectedCertificate)}
                            >
                                <Ionicons name="share-social" size={24} color="#FFFFFF" />
                            </Pressable>
                        </View>

                        {/* Certificate Preview */}
                        <Animated.View
                            style={[
                                styles.previewContent,
                                { transform: [{ scale: previewScale }] },
                            ]}
                        >
                            {selectedCertificate && (
                                <View style={styles.certificatePreview}>
                                    {/* Garuda */}
                                    <View style={styles.garudaWrapper}>
                                        <View style={styles.garudaPlaceholder}>
                                            <Ionicons
                                                name="shield-checkmark"
                                                size={32}
                                                color={colors.primary.main}
                                            />
                                        </View>
                                    </View>

                                    <Text weight="bold" size="sm" color="primary" center style={{ marginTop: spacing.sm }}>
                                        REPUBLIK INDONESIA
                                    </Text>
                                    <Text weight="semibold" size="xs" color="secondary" center>
                                        {selectedCertificate.issuedBy}
                                    </Text>

                                    <View style={styles.dividerLine} />

                                    <Text weight="bold" size="lg" color="primary" center>
                                        {selectedCertificate.title}
                                    </Text>

                                    <Text weight="regular" size="sm" color="secondary" center style={{ marginTop: spacing.sm }}>
                                        Diberikan kepada:
                                    </Text>

                                    <Text weight="bold" size="xl" color="primary" center style={{ marginTop: spacing.xs }}>
                                        {profile?.fullName}
                                    </Text>

                                    <Text weight="regular" size="xs" color="secondary" center style={{ marginTop: spacing.md, lineHeight: 18 }}>
                                        {selectedCertificate.description}
                                    </Text>

                                    <View style={styles.stampsWrapper}>
                                        <View style={styles.stampBox}>
                                            <View style={styles.stampCircle}>
                                                <Ionicons name="create" size={24} color={colors.info.dark} />
                                            </View>
                                            <Text weight="semibold" size="xs" color="secondary" center style={{ marginTop: spacing.xs }}>
                                                Tanda Tangan
                                            </Text>
                                        </View>

                                        <View style={styles.stampBox}>
                                            <View style={styles.stampCircle}>
                                                <Ionicons name="shield" size={24} color={colors.info.dark} />
                                            </View>
                                            <Text weight="semibold" size="xs" color="secondary" center style={{ marginTop: spacing.xs }}>
                                                Stempel Resmi
                                            </Text>
                                        </View>
                                    </View>

                                    <Text weight="semibold" size="xs" color="secondary" center style={{ marginTop: spacing.lg }}>
                                        No: {selectedCertificate.certificateNumber}
                                    </Text>
                                    <Text weight="regular" size="xs" color="secondary" center>
                                        {formatCertificateDate(selectedCertificate.issuedDate)}
                                    </Text>
                                </View>
                            )}
                        </Animated.View>
                    </SafeAreaView>
                </Animated.View>
            </Modal>
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        backgroundColor: colors.primary.main,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: 8,
        marginTop: spacing.lg,
    },

    // Info Box
    infoBox: {
        flexDirection: 'row',
        gap: spacing.sm,
        backgroundColor: colors.info.light,
        borderWidth: 1,
        borderColor: colors.info.main,
        borderRadius: 12,
        padding: spacing.md,
    },

    // Certificate Card
    certificateCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border.light,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    statusBadge: {
        position: 'absolute',
        top: spacing.md,
        left: spacing.md,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: 4,
        zIndex: 10,
    },
    certHeader: {
        backgroundColor: colors.primary.main,
        padding: spacing.lg,
        alignItems: 'center',
        gap: spacing.sm,
    },
    certIconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    certBadgeWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xs,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    certBody: {
        padding: spacing.lg,
    },
    certDetails: {
        marginTop: spacing.md,
        gap: spacing.sm,
    },
    certDetailRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    certDetailCol: {
        flex: 1,
        gap: 4,
    },

    // Action Buttons
    actionButtons: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    previewButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: colors.border.light,
        borderRadius: 12,
        paddingVertical: spacing.sm,
    },
    downloadButton: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        backgroundColor: colors.primary.main,
        borderRadius: 12,
        paddingVertical: spacing.md,
    },
    downloadButtonDisabled: {
        opacity: 0.6,
    },
    shareButton: {
        width: 52,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: colors.border.light,
        borderRadius: 12,
    },

    // Section Header
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginBottom: spacing.md,
    },

    // Security Features
    securityList: {
        gap: spacing.sm,
    },
    securityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        backgroundColor: colors.success.dark + '08',
        padding: spacing.sm,
        borderRadius: 10,
        borderLeftWidth: 3,
        borderLeftColor: colors.success.dark,
    },
    securityIconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.success.dark + '15',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Validity Card
    validityCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border.light,
    },
    validityHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },

    // Preview Modal
    previewOverlay: {
        flex: 1,
        backgroundColor: '#1a1a2e',
    },
    previewSafeArea: {
        flex: 1,
        paddingTop: 12,
    },
    previewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    previewBackButton: {
        padding: spacing.xs,
    },
    previewShareButton: {
        padding: spacing.xs,
    },
    previewContent: {
        flex: 1,
        justifyContent: 'center',
        padding: spacing.lg,
    },
    certificatePreview: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: spacing.xl,
        borderWidth: 3,
        borderColor: colors.warning.main,
    },
    garudaWrapper: {
        alignItems: 'center',
    },
    garudaPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.background.light,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dividerLine: {
        height: 2,
        backgroundColor: colors.warning.main,
        marginVertical: spacing.sm,
        width: 100,
        alignSelf: 'center',
    },
    stampsWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: spacing.xl,
        paddingTop: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
    },
    stampBox: {
        alignItems: 'center',
    },
    stampCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.info.light,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.info.main,
    },
});