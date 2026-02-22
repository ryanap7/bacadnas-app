import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, spacing } from '~/constants';
import { Text } from './Text';

interface HeaderProps {
    title: string;
    withBackButton?: boolean;
}

const Header = ({ title, withBackButton = true }: HeaderProps) => {
    const router = useRouter();

    const onBack = useCallback(() => {
        router.back();
    }, [router]);

    return (
        <View style={styles.container}>
            {withBackButton && (
                <Pressable onPress={onBack} hitSlop={8}>
                    <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
                </Pressable>
            )}
            <Text weight="bold" size="lg" color="primary">
                {title}
            </Text>
        </View>
    )
}

export { Header };

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background.light,
        padding: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        borderBottomWidth: 0.4,
        borderBottomColor: colors.border.light,
    },
})