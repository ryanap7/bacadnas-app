import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
    Animated,
    Image,
    Linking,
    Platform,
    Pressable,
    StyleSheet,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Text } from '~/components';
import { colors, spacing } from '~/constants';

// ─── Types ──────────────────────────────────────────────────
interface RundownItem {
    time: string;
    title: string;
    description?: string;
}

interface Requirement {
    text: string;
    icon: 'checkmark-circle' | 'close-circle' | 'alert-circle';
}

// ─── Mock Data ──────────────────────────────────────────────
const EVENT_DETAIL = {
    id: '1',
    title: 'Pelatihan Dasar Komcad Batch 5',
    category: 'MENDATANG',
    categoryColor: '#FFA500',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsEl3c9HV3oVqNbAG64DdwNSBYFOUQWyppi7mf9fgBfyhf-Etk1SrDYr3wzXd7fIVhfMyBDyyTZdtWo15PJXatyrw95oMk-WnbMavAxQcyMBqvQMCM9VZ7Uavir5zpNOCtRgM-YBkf8JMyFQ_Br4mUoWrxlgzvXq-JR5bVDKzLzVf4V9fjqxm-8p62umInGYiY9swbAXcOVVrUDAMp7XrTBYtbRZu6lIoXcz_hkkgwKOdrf8mVzAsq-XBHnRHHQwfJ-jYqEC0u-6w',
    description:
        'Pelatihan ini bertujuan untuk meningkatkan kesiapan bela negara dan mempersiapkan komponen cadangan pertahanan negara yang tangguh, disiplin, dan memiliki semangat patriotisme tinggi.',
    date: {
        day: '5',
        month: 'Okt',
        year: '2024',
    },
    time: '08:00 WIB - Selesai',
    location: 'Pindiklat, Jakarta',
    quota: '300 Peserta',
    rundown: [
        {
            time: '07:00 - 08:00',
            title: 'Registrasi & Pendataan',
            description: 'Peserta melakukan registrasi dan pendataan data peserta',
        },
        {
            time: '08:00 - 09:30',
            title: 'Upacara Pembukaan',
            description: 'Pembukaan acara dipimpin oleh pejabat terkait',
        },
        {
            time: '10:00 - Selesai',
            title: 'Materi Dasar Kepemimpinan',
            description: 'Materi diberikan oleh instruktur berpengalaman',
        },
    ] as RundownItem[],
    requirements: [
        {
            text: 'Warga Negara Indonesia (WNI) usia 18-35 tahun',
            icon: 'checkmark-circle',
        },
        {
            text: 'Sehat jasmani dan rohani (Surat Keterangan Dokter)',
            icon: 'checkmark-circle',
        },
        {
            text: 'Tidak memiliki catatan kriminal (SKCK)',
            icon: 'close-circle',
        },
        {
            text: 'Minimal pendidikan SMA/SMK sederajat',
            icon: 'checkmark-circle',
        },
    ] as Requirement[],
    mapImage: 'https://via.placeholder.com/600x200/E8F5E9/4CAF50?text=Map+Location',
    locationDetail: 'Kec. Jeruvih, Kecamatan Bmpla, Rawa Idian',
    contactPerson: {
        name: 'Customer Service Komcad',
        phone: '6281 234 567 890',
        available: 'Setiap hari (08:00 - 17:00)',
    },
};

// ─── Component ──────────────────────────────────────────────
export default function DetailKegiatanScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // ─── Animated Values ──────────────────────────────────
    const scrollY = useRef(new Animated.Value(0)).current;
    const headerOpacity = useRef(new Animated.Value(0)).current;
    const imageScale = useRef(new Animated.Value(0.9)).current;
    const imageOpacity = useRef(new Animated.Value(0)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const contentTranslateY = useRef(new Animated.Value(40)).current;

    // ─── Entering Animation ───────────────────────────────
    useEffect(() => {
        Animated.sequence([
            // Header fade in
            Animated.timing(headerOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            // Image scale & fade
            Animated.parallel([
                Animated.spring(imageScale, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(imageOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
            // Content slide up & fade
            Animated.parallel([
                Animated.timing(contentOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.spring(contentTranslateY, {
                    toValue: 0,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    // ─── Handle WhatsApp ──────────────────────────────────
    const handleWhatsApp = () => {
        const phone = EVENT_DETAIL.contactPerson.phone.replace(/\s/g, '');
        const message = `Halo, saya ingin bertanya tentang ${EVENT_DETAIL.title}`;
        const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
        Linking.openURL(url).catch(() => {
            alert('Pastikan WhatsApp terinstall di perangkat Anda');
        });
    };

    // ─── Handle Maps ──────────────────────────────────────
    const handleOpenMaps = () => {
        const url = Platform.select({
            ios: `maps:0,0?q=${encodeURIComponent(EVENT_DETAIL.location)}`,
            android: `geo:0,0?q=${encodeURIComponent(EVENT_DETAIL.location)}`,
        });
        if (url) {
            Linking.openURL(url);
        }
    };

    // ─── Render Badge ─────────────────────────────────────
    const renderBadge = () => (
        <View style={[styles.badge, { backgroundColor: EVENT_DETAIL.categoryColor }]}>
            <Text weight="bold" size="xs" style={{ color: '#FFFFFF' }}>
                {EVENT_DETAIL.category}
            </Text>
        </View>
    );

    // ─── Render Info Card ─────────────────────────────────
    const renderInfoCard = (icon: string, label: string, value: string) => (
        <View style={styles.infoCard}>
            <View style={styles.infoIconWrapper}>
                <Ionicons name={icon as any} size={20} color={colors.primary.main} />
            </View>
            <View style={styles.infoTextWrapper}>
                <Text weight="semibold" size="xs" color="secondary">
                    {label}
                </Text>
                <Text weight="bold" size="sm" color="primary" style={{ marginTop: 2 }}>
                    {value}
                </Text>
            </View>
        </View>
    );

    // ─── Render Rundown Item ──────────────────────────────
    const renderRundownItem = (item: RundownItem, index: number) => (
        <View key={index} style={styles.rundownItem}>
            <View style={styles.rundownDot} />
            <View style={styles.rundownContent}>
                <Text weight="bold" size="sm" color="primary">
                    {item.time}
                </Text>
                <Text weight="bold" size="md" color="primary" style={{ marginTop: 4 }}>
                    {item.title}
                </Text>
                {item.description && (
                    <Text weight="regular" size="sm" color="secondary" style={{ marginTop: 4 }}>
                        {item.description}
                    </Text>
                )}
            </View>
        </View>
    );

    // ─── Render Requirement Item ──────────────────────────
    const renderRequirementItem = (item: Requirement, index: number) => {
        const iconColor =
            item.icon === 'checkmark-circle'
                ? '#4CAF50'
                : item.icon === 'close-circle'
                    ? '#F44336'
                    : '#FF9800';

        return (
            <View key={index} style={styles.requirementItem}>
                <Ionicons name={item.icon} size={20} color={iconColor} />
                <Text weight="regular" size="sm" color="primary" style={{ flex: 1, marginLeft: 8 }}>
                    {item.text}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <Header title='Detail Kegiatan' />

            {/* Scrollable Content */}
            <Animated.ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
                    useNativeDriver: false,
                })}
                scrollEventThrottle={16}
            >
                {/* Hero Image */}
                <Animated.View
                    style={[
                        styles.imageContainer,
                        {
                            opacity: imageOpacity,
                            transform: [{ scale: imageScale }],
                        },
                    ]}
                >
                    <Image source={{ uri: EVENT_DETAIL.image }} style={styles.heroImage} />
                    {renderBadge()}
                </Animated.View>

                {/* Content Container */}
                <Animated.View
                    style={[
                        styles.contentContainer,
                        {
                            opacity: contentOpacity,
                            transform: [{ translateY: contentTranslateY }],
                        },
                    ]}
                >
                    {/* Title */}
                    <Text weight="bold" size="xxl" color="primary" style={styles.title}>
                        {EVENT_DETAIL.title}
                    </Text>

                    {/* Description */}
                    <Text
                        weight="regular"
                        size="sm"
                        color="secondary"
                        style={styles.description}
                    >
                        {EVENT_DETAIL.description}
                    </Text>

                    {/* Info Cards Grid */}
                    <View style={styles.infoGrid}>
                        {renderInfoCard(
                            'calendar',
                            'Tanggal',
                            `${EVENT_DETAIL.date.day} ${EVENT_DETAIL.date.month} ${EVENT_DETAIL.date.year}`
                        )}
                        {renderInfoCard('time', 'Waktu', EVENT_DETAIL.time)}
                        {renderInfoCard('location', 'Lokasi', EVENT_DETAIL.location)}
                        {renderInfoCard('people', 'Kuota', EVENT_DETAIL.quota)}
                    </View>

                    {/* Deskripsi Section */}
                    <View style={styles.section}>
                        <Text weight="bold" size="lg" color="primary" style={styles.sectionTitle}>
                            Deskripsi
                        </Text>
                        <Text weight="regular" size="sm" color="secondary">
                            {EVENT_DETAIL.description}
                        </Text>
                    </View>

                    {/* Rundown Section */}
                    <View style={styles.section}>
                        <Text weight="bold" size="lg" color="primary" style={styles.sectionTitle}>
                            Rundown
                        </Text>
                        <View style={styles.rundownList}>
                            {EVENT_DETAIL.rundown.map((item, index) =>
                                renderRundownItem(item, index)
                            )}
                        </View>
                    </View>

                    {/* Persyaratan Section */}
                    <View style={styles.section}>
                        <Text weight="bold" size="lg" color="primary" style={styles.sectionTitle}>
                            Persyaratan
                        </Text>
                        <View style={styles.requirementList}>
                            {EVENT_DETAIL.requirements.map((item, index) =>
                                renderRequirementItem(item, index)
                            )}
                        </View>
                    </View>

                    {/* Lokasi Section */}
                    <View style={styles.section}>
                        <Text weight="bold" size="lg" color="primary" style={styles.sectionTitle}>
                            Lokasi
                        </Text>

                        {/* Map Preview */}
                        <Pressable style={styles.mapContainer} onPress={handleOpenMaps}>
                            <Image
                                source={{ uri: EVENT_DETAIL.mapImage }}
                                style={styles.mapImage}
                            />
                            <View style={styles.mapMarker}>
                                <Ionicons name="location" size={32} color="#C62828" />
                            </View>
                        </Pressable>

                        {/* Location Detail */}
                        <View style={styles.locationDetail}>
                            <Text weight="bold" size="md" color="primary">
                                {EVENT_DETAIL.location}
                            </Text>
                            <Text
                                weight="regular"
                                size="sm"
                                color="secondary"
                                style={{ marginTop: 4 }}
                            >
                                {EVENT_DETAIL.locationDetail}
                            </Text>
                            <Pressable style={styles.mapsButton} onPress={handleOpenMaps}>
                                <Text weight="semibold" size="sm" color="primary">
                                    Buka Maps
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Kontak Panitia Section */}
                    <View style={styles.section}>
                        <Text weight="bold" size="lg" color="primary" style={styles.sectionTitle}>
                            Kontak Panitia
                        </Text>

                        <View style={styles.contactCard}>
                            <View style={styles.contactInfo}>
                                <View style={styles.contactAvatar}>
                                    <Ionicons
                                        name="headset-outline"
                                        size={24}
                                        color={colors.primary.main}
                                    />
                                </View>
                                <View style={styles.contactText}>
                                    <Text weight="bold" size="md" color="primary">
                                        {EVENT_DETAIL.contactPerson.name}
                                    </Text>
                                    <Text weight="regular" size="sm" color="secondary">
                                        {EVENT_DETAIL.contactPerson.phone}
                                    </Text>
                                    <Text
                                        weight="regular"
                                        size="xs"
                                        color="secondary"
                                        style={{ marginTop: 2 }}
                                    >
                                        {EVENT_DETAIL.contactPerson.available}
                                    </Text>
                                </View>
                            </View>

                            <Pressable style={styles.whatsappButton} onPress={handleWhatsApp}>
                                <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
                                <Text weight="bold" size="sm" style={{ color: '#FFFFFF' }}>
                                    WhatsApp
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Bottom Spacing */}
                    <View style={{ height: 120 }} />
                </Animated.View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
}

// ─── Styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.light,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingTop: Platform.OS === 'ios' ? 60 : spacing.lg,
        paddingBottom: spacing.md,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
        zIndex: 10,
    },
    headerButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },

    // Scroll View
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.xxl,
    },

    // Hero Image
    imageContainer: {
        width: '100%',
        height: 240,
        backgroundColor: '#F5F5F5',
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    badge: {
        position: 'absolute',
        top: spacing.md,
        left: spacing.md,
        paddingHorizontal: spacing.sm,
        paddingVertical: 6,
        borderRadius: 6,
    },

    // Content
    contentContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -20,
        paddingTop: spacing.lg,
        paddingHorizontal: spacing.lg,
    },
    title: {
        lineHeight: 32,
    },
    description: {
        marginTop: spacing.sm,
        lineHeight: 22,
    },

    // Info Grid
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginTop: spacing.lg,
    },
    infoCard: {
        width: '48%',
        flexDirection: 'row',
        backgroundColor: colors.background.light,
        borderRadius: 12,
        padding: spacing.sm,
        gap: spacing.xs,
        borderWidth: 1,
        borderColor: colors.border.light,
    },
    infoIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoTextWrapper: {
        flex: 1,
        justifyContent: 'center',
    },

    // Section
    section: {
        marginTop: spacing.xl,
    },
    sectionTitle: {
        marginBottom: spacing.md,
    },

    // Rundown
    rundownList: {
        gap: spacing.md,
    },
    rundownItem: {
        flexDirection: 'row',
        gap: spacing.sm,
        paddingLeft: spacing.xs,
    },
    rundownDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary.main,
        marginTop: 6,
    },
    rundownContent: {
        flex: 1,
        paddingBottom: spacing.sm,
        borderLeftWidth: 2,
        borderLeftColor: colors.border.light,
        paddingLeft: spacing.md,
        marginLeft: -4,
    },

    // Requirements
    requirementList: {
        gap: spacing.sm,
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.xs,
    },

    // Map
    mapContainer: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#F5F5F5',
        position: 'relative',
    },
    mapImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    mapMarker: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -16 }, { translateY: -32 }],
    },

    // Location Detail
    locationDetail: {
        marginTop: spacing.md,
        padding: spacing.md,
        backgroundColor: colors.background.light,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border.light,
    },
    mapsButton: {
        marginTop: spacing.sm,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.primary.main,
        alignSelf: 'flex-start',
    },

    // Contact
    contactCard: {
        backgroundColor: colors.background.light,
        borderRadius: 12,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border.light,
    },
    contactInfo: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    contactAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    contactText: {
        flex: 1,
    },
    whatsappButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        backgroundColor: '#25D366',
        paddingVertical: spacing.sm,
        borderRadius: 8,
    },
});