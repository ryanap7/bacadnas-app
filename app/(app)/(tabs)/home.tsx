import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components';
import { colors, spacing } from '~/constants';
import { useDashboard, useMarkNotificationRead } from '~/hooks/useDashboard';
import {
    formatEventDate,
    formatNIK,
    formatNotificationTime,
    getEventTimeRange,
    getNotificationIcon,
    getNotificationTypeColor,
    getProgramDisplayName,
    getProgramSubtitle,
    sortEvents,
    sortNotifications,
} from '~/utils/dashboard.utils';

// ─── Component ──────────────────────────────────────────────
export default function HomeScreen() {
    const router = useRouter();
    const { dashboard, isLoading, isError, error, refetch, isRefetching } = useDashboard();
    const { mutate: markAsRead } = useMarkNotificationRead();

    // ─── Animated Values ──────────────────────────────────
    const animations = useRef(
        Array.from({ length: 6 }, () => ({
            opacity: new Animated.Value(0),
            translateY: new Animated.Value(30),
        })),
    ).current;

    // ─── Staggered Entering Animation ─────────────────────
    useEffect(() => {
        if (!isLoading && dashboard) {
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
                    ]),
                ),
            ).start();
        }
    }, [isLoading, dashboard]);

    // ─── Handlers ──────────────────────────────────────────
    const handleNotificationPress = (notificationId: string) => {
        // Mark as read
        markAsRead(notificationId);
    };

    const handleNotificationBellPress = () => {
        router.push('/(app)/notifications' as any);
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
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Ionicons name="shield-checkmark" size={28} color={colors.primary.main} />
                        <Text weight="bold" size="xl" color="primary">
                            BACADNAS
                        </Text>
                    </View>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary.main} />
                    <Text
                        weight="regular"
                        size="sm"
                        color="secondary"
                        style={{ marginTop: spacing.md }}
                    >
                        Memuat dashboard...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    // ─── Error State ───────────────────────────────────────
    if (isError || !dashboard) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Ionicons name="shield-checkmark" size={28} color={colors.primary.main} />
                        <Text weight="bold" size="xl" color="primary">
                            BACADNAS
                        </Text>
                    </View>
                </View>
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={64} color={colors.error.main} />
                    <Text
                        weight="bold"
                        size="lg"
                        color="primary"
                        center
                        style={{ marginTop: spacing.md }}
                    >
                        Gagal Memuat Dashboard
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
                    <Pressable style={styles.retryButton} onPress={() => refetch()}>
                        <Ionicons name="refresh" size={20} color="#FFFFFF" />
                        <Text weight="semibold" size="md" color="white">
                            Coba Lagi
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    // ─── Process Data ──────────────────────────────────────
    const { user, notifications, unreadNotifications, upcomingEvents, certificateCount } =
        dashboard;
    const sortedNotifications = sortNotifications(notifications).slice(0, 3); // Show top 3
    const sortedEvents = sortEvents(upcomingEvents);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Animated.View style={[styles.header, animatedStyle(0)]}>
                <View style={styles.headerLeft}>
                    <Ionicons name="shield-checkmark" size={28} color={colors.primary.main} />
                    <Text weight="bold" size="xl" color="primary">
                        BACADNAS
                    </Text>
                </View>
                <Pressable style={styles.notificationButton} onPress={handleNotificationBellPress}>
                    <Ionicons name="notifications" size={24} color={colors.text.primary} />
                    {unreadNotifications > 0 && (
                        <View style={styles.notificationBadge}>
                            {unreadNotifications > 9 ? (
                                <Text
                                    weight="bold"
                                    size="xs"
                                    style={{ color: '#FFF', fontSize: 8 }}
                                >
                                    9+
                                </Text>
                            ) : (
                                <Text
                                    weight="bold"
                                    size="xs"
                                    style={{ color: '#FFF', fontSize: 9 }}
                                >
                                    {unreadNotifications}
                                </Text>
                            )}
                        </View>
                    )}
                </Pressable>
            </Animated.View>

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
                {/* User Profile Card */}
                <Animated.View style={[styles.profileCard, animatedStyle(1)]}>
                    <View style={styles.profileLeft}>
                        <View style={styles.avatarWrapper}>
                            <View style={styles.avatarPlaceholder}>
                                <Text weight="bold" size="xl" color="white">
                                    {user.fullName.substring(0, 2).toUpperCase()}
                                </Text>
                            </View>
                            <View style={styles.verifiedBadge}>
                                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                            </View>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text weight="bold" size="lg" color="primary">
                                {user.fullName}
                            </Text>
                            <Text weight="regular" size="sm" color="secondary">
                                NIK: {formatNIK(user.nik)}
                            </Text>
                            <View style={styles.statusBadge}>
                                <View style={styles.statusDot} />
                                <Text weight="semibold" size="xs" color={colors.success.dark}>
                                    AKTIF
                                </Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* Registration Progress Card */}
                <Animated.View style={[styles.progressCard, animatedStyle(2)]}>
                    <View style={styles.progressHeader}>
                        <Ionicons name="medal" size={28} color={colors.primary.main} />
                        <View style={styles.progressHeaderText}>
                            <Text weight="bold" size="md" color="primary">
                                {getProgramDisplayName(user.selectedProgram)}
                            </Text>
                            <Text weight="regular" size="sm" color="secondary">
                                {getProgramSubtitle(user.selectedProgram)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.progressSection}>
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Ionicons
                                    name="document-text"
                                    size={24}
                                    color={colors.primary.main}
                                />
                                <View style={styles.statInfo}>
                                    <Text weight="bold" size="xl" color="primary">
                                        {certificateCount}
                                    </Text>
                                    <Text weight="regular" size="xs" color="secondary">
                                        Sertifikat
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Ionicons name="calendar" size={24} color={colors.primary.main} />
                                <View style={styles.statInfo}>
                                    <Text weight="bold" size="xl" color="primary">
                                        {upcomingEvents.length}
                                    </Text>
                                    <Text weight="regular" size="xs" color="secondary">
                                        Event
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* Notifications Section */}
                {sortedNotifications.length > 0 && (
                    <Animated.View style={animatedStyle(3)}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="notifications" size={20} color={colors.primary.main} />
                            <Text weight="bold" size="md" color="primary">
                                NOTIFIKASI TERBARU
                            </Text>
                            {notifications.length > 3 && (
                                <Pressable
                                    onPress={handleNotificationBellPress}
                                    style={styles.seeAllButton}
                                >
                                    <Text weight="semibold" size="sm" color="primary">
                                        Lihat Semua
                                    </Text>
                                </Pressable>
                            )}
                        </View>

                        {sortedNotifications.map((notif) => {
                            const typeColor = getNotificationTypeColor(notif.type);
                            const iconName = getNotificationIcon(notif.type);

                            return (
                                <Pressable
                                    key={notif.id}
                                    style={[
                                        styles.notificationCard,
                                        {
                                            borderLeftColor: typeColor.border,
                                            backgroundColor: notif.isRead
                                                ? '#FFFFFF'
                                                : typeColor.background + '08',
                                        },
                                    ]}
                                    onPress={() => handleNotificationPress(notif.id)}
                                >
                                    <View
                                        style={[
                                            styles.notificationIcon,
                                            { backgroundColor: typeColor.background },
                                        ]}
                                    >
                                        <Ionicons
                                            name={iconName as any}
                                            size={20}
                                            color={typeColor.icon}
                                        />
                                    </View>
                                    <View style={styles.notificationContent}>
                                        <View style={styles.notificationHeader}>
                                            <Text
                                                weight="bold"
                                                size="sm"
                                                color="primary"
                                                style={{ flex: 1 }}
                                            >
                                                {notif.title}
                                            </Text>
                                            {!notif.isRead && <View style={styles.unreadDot} />}
                                        </View>
                                        <Text
                                            weight="regular"
                                            size="sm"
                                            color="secondary"
                                            numberOfLines={2}
                                            style={{ marginTop: 2, lineHeight: 18 }}
                                        >
                                            {notif.message}
                                        </Text>
                                        <Text
                                            weight="regular"
                                            size="xs"
                                            color="secondary"
                                            style={{ marginTop: spacing.xs, opacity: 0.6 }}
                                        >
                                            {formatNotificationTime(notif.createdAt)}
                                        </Text>
                                    </View>
                                </Pressable>
                            );
                        })}
                    </Animated.View>
                )}

                {/* Upcoming Events Section */}
                {sortedEvents.length > 0 && (
                    <Animated.View style={animatedStyle(4)}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="calendar" size={20} color={colors.primary.main} />
                            <Text weight="bold" size="md" color="primary">
                                AGENDA MENDATANG
                            </Text>
                        </View>

                        {sortedEvents.map((event) => {
                            const eventDate = formatEventDate(event.startDate);
                            const timeRange = getEventTimeRange(event.startDate, event.endDate);

                            return (
                                <Pressable
                                    key={event.id}
                                    style={styles.eventCard}
                                    onPress={() => {
                                        // Navigate to event detail
                                        // router.push(`/events/${event.id}`);
                                    }}
                                >
                                    <View style={styles.eventDate}>
                                        <Text weight="bold" size="xxl" color="primary">
                                            {eventDate.date}
                                        </Text>
                                        <Text weight="semibold" size="xs" color="secondary">
                                            {eventDate.month}
                                        </Text>
                                    </View>
                                    <View style={styles.eventDetails}>
                                        <Text weight="bold" size="md" color="primary">
                                            {event.title}
                                        </Text>
                                        <View style={styles.eventMeta}>
                                            <Ionicons
                                                name="time-outline"
                                                size={14}
                                                color={colors.text.secondary}
                                            />
                                            <Text weight="regular" size="sm" color="secondary">
                                                {timeRange}
                                            </Text>
                                        </View>
                                        <View style={styles.eventMeta}>
                                            <Ionicons
                                                name="location-outline"
                                                size={14}
                                                color={colors.text.secondary}
                                            />
                                            <Text
                                                weight="regular"
                                                size="sm"
                                                color="secondary"
                                                numberOfLines={1}
                                            >
                                                {event.location}
                                            </Text>
                                        </View>
                                    </View>
                                </Pressable>
                            );
                        })}
                    </Animated.View>
                )}

                {/* Empty State for Events */}
                {sortedEvents.length === 0 && (
                    <Animated.View style={[styles.emptyState, animatedStyle(4)]}>
                        <Ionicons name="calendar-outline" size={48} color={colors.text.secondary} />
                        <Text
                            weight="semibold"
                            size="md"
                            color="secondary"
                            center
                            style={{ marginTop: spacing.sm }}
                        >
                            Tidak Ada Agenda
                        </Text>
                        <Text
                            weight="regular"
                            size="sm"
                            color="secondary"
                            center
                            style={{ marginTop: spacing.xs }}
                        >
                            Belum ada agenda yang dijadwalkan
                        </Text>
                    </Animated.View>
                )}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    notificationButton: {
        position: 'relative',
        padding: spacing.xs,
    },
    notificationBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: colors.error.main,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
        borderWidth: 2,
        borderColor: '#FFFFFF',
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

    // Profile Card
    profileCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border.light,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    profileLeft: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatarPlaceholder: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: colors.primary.main,
        alignItems: 'center',
        justifyContent: 'center',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.primary.main,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    profileInfo: {
        flex: 1,
        gap: 2,
        justifyContent: 'center',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.success.dark,
    },

    // Progress Card
    progressCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border.light,
        gap: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    progressHeader: {
        flexDirection: 'row',
        gap: spacing.sm,
        alignItems: 'flex-start',
    },
    progressHeaderText: {
        flex: 1,
        gap: 2,
    },
    progressSection: {
        gap: spacing.xs,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    statInfo: {
        gap: 2,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: colors.border.light,
        marginHorizontal: spacing.md,
    },

    // Section Header
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginBottom: spacing.md,
    },
    seeAllButton: {
        marginLeft: 'auto',
    },

    // Notification Card
    notificationCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: spacing.md,
        borderLeftWidth: 4,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.sm,
        marginBottom: spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    notificationIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationContent: {
        flex: 1,
    },
    notificationHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.xs,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary.main,
        marginTop: 4,
    },

    // Event Card
    eventCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: spacing.md,
        flexDirection: 'row',
        gap: spacing.md,
        borderWidth: 1,
        borderColor: colors.border.light,
        marginBottom: spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    eventDate: {
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background.light,
        borderRadius: 8,
        paddingVertical: spacing.sm,
    },
    eventDetails: {
        flex: 1,
        gap: 4,
    },
    eventMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },

    // Empty State
    emptyState: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: spacing.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border.light,
    },
});
