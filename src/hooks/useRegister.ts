import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { authService } from '~/services/auth.service';
import type { RegistrationRequest, RegistrationResponse } from '~/types/api';

interface UseRegisterReturn {
    mutate: (request: RegistrationRequest) => void;
    isPending: boolean;
    isError: boolean;
    error: Error | null;
    isSuccess: boolean;
}

/**
 * useRegister Hook
 * Handles registration submission to /api/v1/auth/register
 */
export function useRegister(): UseRegisterReturn {
    const router = useRouter();

    const mutation = useMutation<RegistrationResponse, Error, RegistrationRequest>({
        mutationKey: ['register'],
        mutationFn: async (request: RegistrationRequest) => {
            return await authService.register(request);
        },
        onSuccess: (data) => {
            // Navigate to success screen
            router.push('/(app)/(registration)/success');
        },
        onError: (error) => {
            // Show error alert
            Alert.alert(
                'Pendaftaran Gagal',
                error.message || 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Navigate back to contact screen to retry
                            router.back();
                        }
                    }
                ]
            );
        },
    });

    return {
        mutate: mutation.mutate,
        isPending: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
    };
}