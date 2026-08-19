import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { StatusBadge, Text, type BadgeTone } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import type { ObservationRating } from '@/types';

const RATING_TONE: Record<ObservationRating, BadgeTone> = {
  good: 'positive',
  acceptable: 'neutral',
  concern: 'attention',
  not_checked: 'neutral',
  not_applicable: 'neutral',
};

/** Non-colour cue for each rating, so the meaning survives a screen reader. */
const RATING_SYMBOL: Record<ObservationRating, string> = {
  good: '✓',
  acceptable: '–',
  concern: '!',
  not_checked: '○',
  not_applicable: '—',
};

export function ObservationRow({
  category,
  rating,
  note,
}: {
  category: string;
  rating: ObservationRating;
  note?: string | null;
}) {
  const { t } = useTranslation();
  return (
    <View style={styles.row}>
      <View style={styles.header}>
        <Text variant="body" style={styles.label}>
          {t(`observations.${category}`, { defaultValue: category })}
        </Text>
        <StatusBadge
          label={t(`report.ratings.${rating}`)}
          tone={RATING_TONE[rating]}
          symbol={RATING_SYMBOL[rating]}
        />
      </View>
      {note ? (
        <Text variant="small" color="textSecondary">
          {note}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  label: { flex: 1 },
});
