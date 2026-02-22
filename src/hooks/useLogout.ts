import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { authService } from '~/services/auth.service';
import { storageService } from '~/services/storage.service';

interface UseLogoutReturn {
    mutate: () => void;
    isPending: boolean;
    isError: boolean;
    error: Error | null;
}

/**
 * useLogout Hook
 * Handles logout with token cleanup and navigation
 */
export function useLogout(): UseLogoutReturn {
    const router = useRouter();

    const mutation = useMutation<void, Error, void>({
        mutationKey: ['logout'],
        mutationFn: async () => {
            await authService.logout();
        },
        onSuccess: () => {
            // Navigate to login screen
            router.replace('/(auth)/login');
        },
        onError: (error) => {
            console.error('Logout error:', error);

            storageService.clearAuthData();

            Alert.alert(
                'Informasi',
                'Anda telah keluar dari aplikasi.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            router.replace('/(auth)/login');
                        },
                    },
                ]
            );
        },
    });

    return {
        mutate: mutation.mutate,
        isPending: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    };
}