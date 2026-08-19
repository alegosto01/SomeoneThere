import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Card, Screen, SectionHeader, Text } from '@/components/ui';
import { spacing } from '@/constants/theme';

export default function HowItWorksScreen() {
  const { t } = useTranslation();
  const steps = [1, 2, 3, 4] as const;

  return (
    <>
      <Stack.Screen options={{ title: t('how_it_works.title') }} />
      <Screen>
        <Text variant="title">{t('how_it_works.title')}</Text>

        <View style={styles.steps}>
          {steps.map((step) => (
            <Card key={step}>
              <Text variant="label" color="primary">
                {String(step).padStart(2, '0')}
              </Text>
              <Text variant="heading">{t(`how_it_works.step_${step}_title`)}</Text>
              <Text variant="body" color="textSecondary">
                {t(`how_it_works.step_${step}_body`)}
              </Text>
            </Card>
          ))}
        </View>

        {/* Stating the limits up front is part of the product, not fine print. */}
        <Card muted>
          <SectionHeader title={t('how_it_works.limits_title')} />
          <Text variant="body" color="textSecondary">
            {t('how_it_works.limits_body')}
          </Text>
        </Card>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({ steps: { gap: spacing.md } });
