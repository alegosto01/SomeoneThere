import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Card, Screen, Text } from '@/components/ui';
import { ReportDisclaimer } from '@/components/Disclaimer';

export default function LegalScreen() {
  const { t } = useTranslation();
  return (
    <>
      <Stack.Screen options={{ title: t('legal.limitations_title') }} />
      <Screen>
        <Text variant="title">{t('legal.limitations_title')}</Text>
        <Card>
          <Text variant="body" color="textSecondary">
            {t('legal.limitations_body')}
          </Text>
        </Card>
        <ReportDisclaimer />
      </Screen>
    </>
  );
}
