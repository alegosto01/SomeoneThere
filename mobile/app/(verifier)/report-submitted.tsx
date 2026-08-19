import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Button, Screen, Text } from '@/components/ui';
import { spacing } from '@/constants/theme';

/** Confirmation after a report is submitted (spec §37, screen 26). */
export default function ReportSubmittedScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.block}>
        <Text variant="display" color="positive">
          ✓
        </Text>
        <Text variant="title">{t('verifier.submitted_title')}</Text>
        <Text variant="body" color="textSecondary">
          {t('verifier.submitted_body')}
        </Text>
      </View>

      <Button label={t('verifier.back_to_jobs')} onPress={() => router.replace('/(verifier)/jobs')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: 'center', gap: spacing.xxl },
  block: { gap: spacing.md, alignItems: 'center' },
});
