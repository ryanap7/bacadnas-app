import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text } from '~/components';
import { colors, spacing } from '~/constants';
import { useAppStore } from '~/store/useAppStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Onboarding Slide Interface
 */
interface OnboardingSlide {
    id: string;
    title: string;
    description: string;
    image: any;
}

/**
 * Onboarding Slides Data
 */
const slides: OnboardingSlide[] = [
    {
        id: '1',
        title: 'Selamat Datang di BACADNAS',
        description: 'Bergabunglah dalam program pertahanan\nnasional untuk kedaulatan NKRI',
        image: require('../../assets/images/onboarding-1.png'),
    },
    {
        id: '2',
        title: 'Pilih Program Anda',
        description: 'Kontrol atau Bela Negara sesuai minat Anda',
        image: require('../../assets/images/onboarding-2.png'),
    },
    {
        id: '3',
        title: 'Dapatkan Sertifikat Digital',
        description: 'Bukti berkontribusi yang dapat\ndiunduh kapan saja',
        image: require('../../assets/images/onboarding-3.png'),
    },
];


export default function OnboardingScreen() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    // Get setHasSeenOnboarding action dari store
    const setHasSeenOnboarding = useAppStore((state) => state.setHasSeenOnboarding);

    /**
     * Handle next button press
     * Navigate ke next slide atau complete onboarding
     */
    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            const nextIndex = currentIndex + 1;
            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true
            });
            setCurrentIndex(nextIndex);
        } else {
            handleCompleteOnboarding();
        }
    };

    /**
     * Handle skip button press
     * Skip onboarding dan navigate ke login
     */
    const handleSkip = () => {
        handleCompleteOnboarding();
    };

    /**
     * Complete onboarding
     * Set hasSeenOnboarding flag dan navigate ke login
     */
    const handleCompleteOnboarding = () => {
        // Mark onboarding as seen di storage
        setHasSeenOnboarding(true);

        // Navigate to login
        router.replace('/(auth)/login');
    };

    /**
     * Handle viewable items change
     * Update current index when user swipes
     */
    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index || 0);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    /**
     * Render single slide
     */
    const renderSlide = ({ item }: { item: OnboardingSlide }) => {
        return (
            <View style={styles.slide}>
                <View style={styles.imageContainer}>
                    <Image
                        source={item.image}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </View>

                <View style={styles.contentContainer}>
                    <Text
                        weight="bold"
                        size="xl"
                        color="primary"
                        center
                        style={styles.title}
                    >
                        {item.title}
                    </Text>
                    <Text
                        weight="regular"
                        size="md"
                        color="secondary"
                        center
                    >
                        {item.description}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Onboarding Slides */}
            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderSlide}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                scrollEventThrottle={16}
            />

            {/* Footer - Pagination dan Button */}
            <View style={styles.footer}>
                {/* Pagination Dots */}
                <View style={styles.pagination}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === currentIndex && styles.dotActive,
                            ]}
                        />
                    ))}
                </View>

                {/* Next/Start Button */}
                <Button
                    title={currentIndex === slides.length - 1 ? 'Mulai' : 'Lanjutkan'}
                    onPress={handleNext}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.light,
    },
    skipContainer: {
        position: 'absolute',
        top: spacing.lg,
        right: spacing.lg,
        zIndex: 10,
    },
    slide: {
        flex: 1,
        width: SCREEN_WIDTH,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xxl + spacing.xxl,
        paddingBottom: spacing.xxl,
    },
    image: {
        width: '100%',
        height: 400,
        borderRadius: spacing.md,
    },
    contentContainer: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xxl,
        alignItems: 'center',
    },
    title: {
        marginBottom: spacing.sm,
    },
    footer: {
        paddingHorizontal: spacing.xl,
        paddingBottom: 64,
        gap: spacing.xxl,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.xs,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.border.light,
    },
    dotActive: {
        width: 8,
        backgroundColor: colors.primary.main,
    },
});