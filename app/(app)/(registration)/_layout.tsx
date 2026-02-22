import { Stack } from 'expo-router';
import { RegistrationProvider } from '~/context/Registrationcontext';

export default function RegistrationLayout() {
    return (
        <RegistrationProvider>
            <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="[program]/personal-data" />
                <Stack.Screen name="[program]/address" />
                <Stack.Screen name="[program]/contact" />
                <Stack.Screen name="loading" options={{ gestureEnabled: false }} />
                <Stack.Screen name="success" options={{ gestureEnabled: false }} />
            </Stack>
        </RegistrationProvider>
    );
}