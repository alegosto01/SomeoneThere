import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import {
  Card,
  EmptyState,
  ErrorState,
  LoadingSkeleton,
  Screen,
  SectionHeader,
  StatusBadge,
  Text,
} from '@/components/ui';
import { spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/AuthProvider';
import { useVerifierVisits } from '@/features/visits/queries';
import { formatTime, formatVisitDateTime, relativeDayKey } from '@/utils/datetime';
import { shortAddress } from '@/utils/format';
import { isUpcoming } from '@/utils/visit-status';

/**
 * Verifier assignments (spec §30). No open-market bidding in the MVP — an
 * operator assigns visits, and this tab shows what has been assigned.
 */
export default function VerifierJobsScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { session } = useAuth();
  const visits = useVerifierVisits(session?.user.id);

  const assignments = useMemo(
    () =>
      (visits.data ?? [])
        .filter((visit) => isUpcoming(visit.status))
        .sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at)),
    [visits.data],
  );

  return (
    <Screen>
      <SectionHeader eyebrow={t('verifier.jobs_title')} />

      {visits.isPending ? (
        <LoadingSkeleton lines={4} />
      ) : visits.isError ? (
        <ErrorState
          title={t('errors.generic_title')}
          body={t('errors.load_visits')}
          retryLabel={t('common.retry')}
          onRetry={() => void visits.refetch()}
        />
      ) : assignments.length === 0 ? (
        <EmptyState title={t('verifier.jobs_empty_title')} body={t('verifier.jobs_empty_body')} />
      ) : (
        <View style={styles.list}>
          {assignments.map((visit) => {
            const dayKey = relativeDayKey(visit.scheduled_at);
            return (
              <Card
                key={visit.id}
                onPress={() => router.push(`/(verifier)/visit/${visit.id}`)}
                accessibilityLabel={shortAddress(visit.property.address_line)}
              >
                <Text variant="small" color="textSecondary">
                  {dayKey
                    ? `${t(`common.${dayKey}`)} · ${formatTime(visit.scheduled_at)}`
                    : formatVisitDateTime(visit.scheduled_at, i18n.language)}
                </Text>
                <Text variant="heading">{shortAddress(visit.property.address_line)}</Text>
                <Text variant="small" color="textSecondary">
                  {visit.property.city}
                </Text>
                <Text variant="small" color="textMuted">
                  {t('verifier.estimated_visit', { minutes: visit.expected_duration_minutes })}
                </Text>

                {!visit.access_confirmed ? (
                  <StatusBadge
                    label={t('visit.timeline.access_confirmed')}
                    tone="attention"
                    symbol="○"
                  />
                ) : null}

                <Text variant="small" color="primary">
                  {t('verifier.view_visit')} →
                </Text>
              </Card>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({ list: { gap: spacing.md } });
