import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';

export const REQUEST_STEPS = [
  'property',
  'viewing',
  'priorities',
  'preferences',
  'review',
] as const;

export type RequestStep = (typeof REQUEST_STEPS)[number];

/** Progress indicator for the request wizard (spec §8). */
export function WizardProgress({ current }: { current: RequestStep }) {
  const { t } = useTranslation();
  const index = REQUEST_STEPS.indexOf(current);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 1, max: REQUEST_STEPS.length, now: index + 1 }}
      style={styles.container}
    >
      <View style={styles.bars}>
        {REQUEST_STEPS.map((step, stepIndex) => (
          <View
            key={step}
            style={[styles.bar, stepIndex <= index ? styles.barDone : styles.barPending]}
          />
        ))}
      </View>
      <Text variant="small" color="textSecondary">
        {t('common.step', { current: index + 1, total: REQUEST_STEPS.length })} ·{' '}
        {t(`request.steps.${current}`)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  bars: { flexDirection: 'row', gap: spacing.xs },
  bar: { flex: 1, height: 4, borderRadius: radius.pill },
  barDone: { backgroundColor: colors.primary },
  barPending: { backgroundColor: colors.border },
});
