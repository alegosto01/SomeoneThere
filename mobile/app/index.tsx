import { Redirect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { LoadingState, Text } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/AuthProvider';

/**
 * Splash / role router (spec §5): once the session and profile are known, send
 * the user to the experience for their role.
 */
export default function Index() {
  const { t } = useTranslation();
  const { session, role, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={styles.splash}>
        <Text variant="display" color="primary">
          {t('common.app_name')}
        </Text>
        <Text variant="body" color="textSecondary">
          {t('common.city')}
        </Text>
        <LoadingState />
      </View>
    );
  }

  if (!session) return <Redirect href="/(auth)/login" />;

  // The profile row can lag a fresh sign-up by a moment; wait rather than
  // guessing a role and routing the user into the wrong app.
  if (!role) {
    return (
      <View style={styles.splash}>
        <LoadingState label={t('common.loading')} />
      </View>
    );
  }

  return <Redirect href={role === 'verifier' ? '/(verifier)/jobs' : '/(customer)/home'} />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
  },
});
