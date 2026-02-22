import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { authService } from '~/services/auth.service';
import type { LoginRequest, LoginResponse } from '~/types/api';

interface UseLoginReturn {
  mutate: (request: LoginRequest) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  isOffline: boolean;
}

/**
 * useLogin Hook
 * Handles login dengan navigation based on requiresAction
 */
export function useLogin(): UseLoginReturn {
  const router = useRouter();
  const [isOffline, setIsOffline] = useState(false);

  const mutation = useMutation<LoginResponse, Error, LoginRequest>({
    mutationKey: ['login'],
    mutationFn: async (request: LoginRequest) => {
      setIsOffline(false);
      return await authService.login(request);
    },
    onSuccess: (data) => {
      // Navigate based on requiresAction
      switch (data.requiresAction) {
        case 'register':
          // New user - redirect to program selection
          router.push({
            pathname: '/(app)/(registration)',
            params: { nik: data.data.nik },
          });
          break;

        case 'dashboard':
          // Success login - redirect to dashboard
          router.replace('/(app)/(tabs)/home');
          break;

        default:
          // Fallback
          Alert.alert('Error', 'Terjadi kesalahan saat login');
      }
    },
    onError: (error) => {
      // Handle offline error
      if (error.message.includes('koneksi internet')) {
        setIsOffline(true);
        Alert.alert(
          'Mode Offline',
          'Anda sedang offline. Data akan disimpan dan dikirim saat koneksi tersedia.',
          [{ text: 'OK' }]
        );
      } else {
        // Show error alert
        Alert.alert(
          'Login Gagal',
          error.message || 'Terjadi kesalahan saat login. Silakan coba lagi.',
          [{ text: 'OK' }]
        );
      }
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isOffline,
  };
}