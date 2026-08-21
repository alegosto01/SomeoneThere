import { Redirect, Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, type ColorValue } from 'react-native';

import { colors } from '@/constants/theme';
import { useAuth } from '@/features/auth/AuthProvider';

function TabGlyph({ glyph, color }: { glyph: string; color: ColorValue }) {
  return <Text style={{ color, fontSize: 18 }}>{glyph}</Text>;
}

/** Verifier navigation (spec §29). */
export default function VerifierLayout() {
  const { t } = useTranslation();
  const { session, role, initializing } = useAuth();

  if (initializing) return null;
  if (!session) return <Redirect href="/(auth)/login" />;
  if (role !== 'verifier' && role !== 'admin') return <Redirect href="/(customer)/home" />;

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
        name="jobs"
        options={{
          title: t('verifier.tabs.jobs'),
          tabBarIcon: ({ color }) => <TabGlyph glyph="◈" color={color} />,
        }}
      />
      <Tabs.Screen
        name="visits"
        options={{
          title: t('verifier.tabs.visits'),
          tabBarIcon: ({ color }) => <TabGlyph glyph="◷" color={color} />,
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: t('verifier.tabs.earnings'),
          tabBarIcon: ({ color }) => <TabGlyph glyph="€" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('verifier.tabs.profile'),
          tabBarIcon: ({ color }) => <TabGlyph glyph="☺" color={color} />,
        }}
      />

      <Tabs.Screen name="visit/[id]" options={{ href: null }} />
      <Tabs.Screen name="checklist/[id]" options={{ href: null }} />
      <Tabs.Screen name="report/[id]" options={{ href: null }} />
      <Tabs.Screen name="report-submitted" options={{ href: null }} />
    </Tabs>
  );
}
