import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';

/**
 * Required at the end of every report (spec §28). Kept as one component so the
 * wording cannot drift between the report screen and anywhere else it appears.
 */
export function ReportDisclaimer() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text variant="small" color="textSecondary">
        {t('report.disclaimer')}
      </Text>
      <Text variant="small" color="textMuted">
        {t('report.disclaimer_secondary')}
      </Text>
    </View>
  );
}

/** Neutral, non-alarming notice used for privacy and permission messages. */
export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.notice}>
      <Text variant="small" color="textSecondary">
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  notice: {
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },
});
