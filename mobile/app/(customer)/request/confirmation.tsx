import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Button, Screen, SecondaryButton, Text } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/AuthProvider';
import { registerForPushNotifications } from '@/lib/notifications';
import { useRequestDraft } from '@/store/request-draft';

/**
 * Booking confirmation (spec §13). Wording is "request received", because
 * payment does not mean access has been arranged.
 */
export default function ConfirmationScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { visitId } = useLocalSearchParams<{ visitId: string }>();
  const { session } = useAuth();
  const { reset } = useRequestDraft();

  useEffect(() => {
    // The wizard is done — clear the persisted draft so the next request
    // starts from a blank form.
    reset();

    // This is the moment a push notification becomes genuinely useful, so it is
    // also the moment worth asking for permission.
    if (session?.user) void registerForPushNotifications(session.user.id);
  }, [reset, session?.user]);

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.block}>
        <Text variant="display" color="positive">
          ✓
        </Text>
        <Text variant="title">{t('payment.confirmed_title')}</Text>
        <Text variant="body" color="textSecondary">
          {t('payment.confirmed_body')}
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          label={t('payment.view_booking')}
          onPress={() => router.replace(`/(customer)/visit/${visitId}`)}
        />
        <SecondaryButton
          label={t('payment.back_home')}
          onPress={() => router.replace('/(customer)/home')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: 'center', gap: spacing.xxl },
  block: { gap: spacing.md, alignItems: 'center' },
  actions: { gap: spacing.md },
});
