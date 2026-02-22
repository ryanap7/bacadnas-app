import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Text } from '~/components';
import { colors, spacing } from '~/constants';

// ─── Types ──────────────────────────────────────────────────
type TabKey = 'upcoming' | 'ongoing' | 'completed';

interface Event {
    id: string;
    title: string;
    date: string;
    day: string;
    month: string;
    time: string;
    location: string;
    registeredCount: number;
    totalSlots: number;
    participants: string[];
}

// ─── Mock Data ──────────────────────────────────────────────
const UPCOMING_EVENTS: Event[] = [
    {
        id: '1',
        title: 'Pelatihan Dasar Komcad',
        date: '15',
        day: '15',
        month: 'FEB',
        time: '08:00 - 12:00 WIB',
        location: 'Rindam Jaya, Jakarta',
        registeredCount: 25,
        totalSlots: 30,
        participants: ['https://i.pravatar.cc/40?img=1', 'https://i.pravatar.cc/40?img=2', 'https://i.pravatar.cc/40?img=3'],
    },
    {
        id: '2',
        title: 'Sosialisasi Bela Negara',
        date: '20',
        day: '20',
        month: 'FEB',
        time: '09:00 - 15:00 WIB',
        location: 'Kodam Jaya, Jakarta',
        registeredCount: 12,
        totalSlots: 50,
        participants: ['https://i.pravatar.cc/40?img=4', 'https://i.pravatar.cc/40?img=5'],
    },
    {
        id: '3',
        title: 'Latihan Kepemimpinan',
        date: '22',
        day: '22',
        month: 'FEB',
        time: '07:00 - 17:00 WIB',
        location: 'Monas, Jakarta',
        registeredCount: 8,
        totalSlots: 40,
        participants: ['https://i.pravatar.cc/40?img=6'],
    },
];

const TABS = [
    { key: 'upcoming', label: 'Mendatang' },
    { key: 'ongoing', label: 'Berlangsung' },
    { key: 'completed', label: 'Selesai' },
] as const;

// ─── Component ──────────────────────────────────────────────
export default function ActivityScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabKey>('upcoming');

    // ─── Animated Values ──────────────────────────────────
    const headerOpacity = useRef(new Animated.Value(0)).current;
    const headerTranslateY = useRef(new Animated.Value(-20)).current;
    const tabsOpacity = useRef(new Animated.Value(0)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const contentTranslateY = useRef(new Animated.Value(30)).current;

    // ─── Entering Animation ───────────────────────────────
    useEffect(() => {
        Animated.sequence([
            // Header
            Animated.parallel([
                Animated.timing(headerOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(headerTranslateY, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
            // Tabs
            Animated.timing(tabsOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            // Content
            Animated.parallel([
                Animated.timing(contentOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(contentTranslateY, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    // ─── Get Events by Tab ────────────────────────────────
    const getEvents = () => {
        switch (activeTab) {
            case 'upcoming':
                return UPCOMING_EVENTS;
            case 'ongoing':
                return [];
            case 'completed':
                return [];
            default:
                return [];
        }
    };

    const events = getEvents();
    const isEmpty = events.length === 0;

    // ─── Render Event Card ────────────────────────────────
    const renderEventCard = ({ item }: { item: Event }) => {
        const progress = (item.registeredCount / item.totalSlots) * 100;

        return (
            <View style={styles.eventCard}>
                {/* Date Box */}
                <View style={styles.dateBox}>
                    <Text weight="bold" size="xs" color={colors.primary.main}>
                        {item.month}
                    </Text>
                    <Text weight="bold" size="xxl" color={colors.primary.main}>
                        {item.day}
                    </Text>
                </View>

                {/* Event Info */}
                <View style={styles.eventInfo}>
                    <Text weight="bold" size="md" color="primary">
                        {item.title}
                    </Text>

                    <View style={styles.eventMeta}>
                        <Ionicons name="time-outline" size={14} color={colors.text.secondary} />
                        <Text weight="regular" size="sm" color="secondary">
                            {item.time}
                        </Text>
                    </View>

                    <View style={styles.eventMeta}>
                        <Ionicons name="location-outline" size={14} color={colors.text.secondary} />
                        <Text weight="regular" size="sm" color="secondary">
                            {item.location}
                        </Text>
                    </View>

                    {/* Participants */}
                    <View style={styles.participantsRow}>
                        <View style={styles.avatarGroup}>
                            {item.participants.slice(0, 3).map((avatar, index) => (
                                <Image
                                    key={index}
                                    source={{ uri: avatar }}
                                    style={[styles.avatar, { marginLeft: index > 0 ? -8 : 0 }]}
                                />
                            ))}
                        </View>
                        <Text weight="regular" size="xs" color="secondary">
                            {item.registeredCount}/{item.totalSlots} Peserta terdaftar
                        </Text>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                    </View>
                </View>

                {/* Detail Button */}
                <Pressable
                    style={styles.detailButton}
                    onPress={() => {
                        router.push(`/(app)/event/${item.id}`);
                    }}
                >
                    <Text weight="semibold" size="sm" color="primary">
                        Detail
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color={colors.primary.main} />
                </Pressable>
            </View>
        );
    };

    // ─── Render Empty State ───────────────────────────────
    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <View style={styles.emptyIconWrapper}>
                <Ionicons name="calendar-outline" size={80} color={colors.text.disabled} />
            </View>
            <Text weight="bold" size="lg" color="primary" center style={{ marginTop: spacing.md }}>
                Belum Ada Kegiatan
            </Text>
            <Text weight="regular" size="sm" color="secondary" center style={{ marginTop: spacing.xs }}>
                Kegiatan akan muncul di sini ketika admin menambahkan jadwal
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Header title='KEGIATAN' withBackButton={false} />

            {/* Tabs */}
            <Animated.View style={[styles.tabsContainer, { opacity: tabsOpacity }]}>
                {TABS.map((tab) => (
                    <Pressable
                        key={tab.key}
                        style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                        onPress={() => setActiveTab(tab.key)}
                    >
                        <Text
                            weight={activeTab === tab.key ? 'bold' : 'regular'}
                            size="sm"
                            color={activeTab === tab.key ? colors.primary.main : colors.text.secondary}
                        >
                            {tab.label}
                        </Text>
                    </Pressable>
                ))}
            </Animated.View>

            {/* Content */}
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: contentOpacity,
                        transform: [{ translateY: contentTranslateY }],
                    },
                ]}
            >
                {isEmpty ? (
                    renderEmptyState()
                ) : (
                    <FlatList
                        data={events}
                        renderItem={renderEventCard}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </Animated.View>
        </SafeAreaView>
    );
}

// ─── Styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.light,
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },

    // Tabs
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    tab: {
        flex: 1,
        paddingVertical: spacing.sm,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: colors.primary.main,
    },

    // Content
    content: {
        flex: 1,
    },
    listContent: {
        padding: spacing.lg,
        gap: spacing.md,
        paddingBottom: spacing.xxl,
    },

    // Event Card
    eventCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: spacing.md,
        flexDirection: 'row',
        gap: spacing.md,
        borderWidth: 1,
        borderColor: colors.border.light,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    dateBox: {
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background.light,
        borderRadius: 12,
        paddingVertical: spacing.sm,
        gap: 2,
    },
    eventInfo: {
        flex: 1,
        gap: spacing.xs,
    },
    eventMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    participantsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginTop: spacing.xs,
    },
    avatarGroup: {
        flexDirection: 'row',
    },
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    progressBarBackground: {
        height: 6,
        backgroundColor: colors.border.light,
        borderRadius: 3,
        overflow: 'hidden',
        marginTop: spacing.xs,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.primary.main,
        borderRadius: 3,
    },
    detailButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.primary.main,
        alignSelf: 'flex-start',
    },

    // Empty State
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    emptyIconWrapper: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: colors.background.light,
        alignItems: 'center',
        justifyContent: 'center',
    },
});