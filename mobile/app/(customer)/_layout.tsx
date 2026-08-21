import { Redirect, Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, type ColorValue } from 'react-native';

import { colors } from '@/constants/theme';
import { useAuth } from '@/features/auth/AuthProvider';

/** Four tabs, no more (spec §6). */
function TabGlyph({ glyph, color }: { glyph: string; color: ColorValue }) {
  return <Text style={{ color, fontSize: 18 }}>{glyph}</Text>;
}

export default function CustomerLayout() {
  const { t } = useTranslation();
  const { session, role, initializing } = useAuth();

  if (initializing) return null;
  if (!session) return <Redirect href="/(auth)/login" />;
  if (role === 'verifier') return <Redirect href="/(verifier)/jobs" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('home.tab'),
          tabBarIcon: ({ color }) => <TabGlyph glyph="⌂" color={color} />,
        }}
      />
      <Tabs.Screen
        name="visits"
        options={{
          title: t('visits.title'),
          tabBarIcon: ({ color }) => <TabGlyph glyph="◷" color={color} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: t('reports.title'),
          tabBarIcon: ({ color }) => <TabGlyph glyph="▤" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile.title'),
          tabBarIcon: ({ color }) => <TabGlyph glyph="☺" color={color} />,
        }}
      />

      {/*
        Routes inside the customer area that are not tabs. The name must be the
        full route as Expo Router registers it: a folder with no _layout.tsx is
        not a navigator, so `visit/[id].tsx` is the route "visit/[id]", and
        hiding "visit" silently matches nothing and leaks an extra tab.
      */}
      <Tabs.Screen name="request" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="visit/[id]" options={{ href: null }} />
      <Tabs.Screen name="previsit/[id]" options={{ href: null }} />
      <Tabs.Screen name="report/[id]" options={{ href: null }} />
    </Tabs>
  );
}
