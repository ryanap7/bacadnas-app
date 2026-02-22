import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { colors } from '~/constants/colors';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary.main,
                tabBarInactiveTintColor: colors.text.secondary,
                tabBarStyle: {
                    height: Platform.OS === 'ios' ? 85 : 65,
                    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
                    paddingTop: 8,
                    paddingHorizontal: 8,
                    borderTopWidth: 1,
                    borderTopColor: colors.border.light,
                    backgroundColor: '#FFFFFF',
                    elevation: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: 2,
                    letterSpacing: 0.2,
                },
                tabBarIconStyle: {
                    marginTop: 0,
                },
                tabBarItemStyle: {
                    paddingVertical: 4,
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Beranda',
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            name={focused ? 'home' : 'home-outline'}
                            size={22}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="certificate"
                options={{
                    title: 'Sertifikat',
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            name={focused ? 'medal' : 'medal-outline'}
                            size={22}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="activity"
                options={{
                    title: 'Kegiatan',
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            name={focused ? 'calendar' : 'calendar-outline'}
                            size={22}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profil',
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            name={focused ? 'person' : 'person-outline'}
                            size={22}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}