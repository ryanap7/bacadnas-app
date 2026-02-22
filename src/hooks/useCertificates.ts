import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { certificateService } from '~/services/certificate.service';
import type { Certificate } from '~/types/certificate';

interface UseCertificatesReturn {
    certificates: Certificate[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
    isRefetching: boolean;
}

/**
 * useCertificates Hook
 * Fetches and manages user certificates with caching
 */
export function useCertificates(): UseCertificatesReturn {
    const queryClient = useQueryClient();

    const {
        data: certificates,
        isLoading,
        isError,
        error,
        refetch,
        isRefetching,
    } = useQuery<Certificate[], Error>({
        queryKey: ['certificates'],
        queryFn: async () => {
            return await certificateService.getMyCertificates();
        },
        // Cache for 10 minutes
        staleTime: 10 * 60 * 1000,
        // Keep data in cache for 30 minutes
        gcTime: 30 * 60 * 1000,
        // Retry once on error
        retry: 1,
        // Refetch on window focus
        refetchOnWindowFocus: true,
        // Don't refetch on mount if we have fresh data
        refetchOnMount: false,
    });

    const handleRefetch = useCallback(() => {
        refetch();
    }, [refetch]);

    return {
        certificates,
        isLoading,
        isError,
        error,
        refetch: handleRefetch,
        isRefetching,
    };
}

/**
 * useCertificateDetail Hook
 * Fetch single certificate detail
 */
export function useCertificateDetail(certificateId: string) {
    return useQuery<Certificate, Error>({
        queryKey: ['certificate', certificateId],
        queryFn: async () => {
            return await certificateService.getCertificateDetail(certificateId);
        },
        // Cache for 10 minutes
        staleTime: 10 * 60 * 1000,
        retry: 1,
        enabled: !!certificateId, // Only fetch if certificateId is provided
    });
}

/**
 * Invalidate certificates cache
 * Useful after certificate updates
 */
export function useInvalidateCertificates() {
    const queryClient = useQueryClient();

    return useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['certificates'] });
    }, [queryClient]);
}