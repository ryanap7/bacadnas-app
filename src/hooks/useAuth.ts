import { useEffect, useState } from 'react';
import { appStorage } from '~/utils/storage';

/**
 * User Type sesuai API Response
 */
interface User {
    id: string;
    nik: string;
    fullName: string;
    selectedProgram?: 'KOMCAD' | 'BELA_NEGARA';
    programSelectedAt?: string;
}

/**
 * useAuth Hook
 * Manages authentication state dengan MMKV storage
 */
export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        try {
            const token = appStorage.getAuthToken();
            const userData = appStorage.getUserData<User>();

            if (token && userData) {
                setUser(userData);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Error checking auth:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = (userData: User, token: string) => {
        try {
            appStorage.setAuthToken(token);
            appStorage.setUserData(userData);
            appStorage.setIsAuthenticated(true);
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        try {
            appStorage.clearAuthData();
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Error clearing auth:', error);
        }
    };

    return {
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
    };
}