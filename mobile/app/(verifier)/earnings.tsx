import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Card, EmptyState, ErrorState, LoadingSkeleton, Screen, SectionHeader, Text } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/AuthProvider';
import { fetchVerifierEarnings } from '@/features/payments/api';
import { formatVisitDateLong } from '@/utils/datetime';
import { formatMoney } from '@/utils/format';

/**
 * Earnings (spec §41). Verifiers have no access to payment rows — RLS gives
 * them none — so this counts completed visits at the standard payout rate.
 * Real payout amounts are reconciled by SomeoneThere outside the app.
 */
const PAYOUT_PER_VISIT = 20;

export default function VerifierEarningsScreen() {
  const { t, i18n } = useTranslation();
  const { session } = useAuth();

  const earnings = useQuery({
    queryKey: ['earnings', session?.user.id],
    queryFn: () => fetchVerifierEarnings(session!.user.id),
    enabled: !!session?.user.id,
  });

  const completed = earnings.data ?? [];
  const total = completed.length * PAYOUT_PER_VISIT;

  return (
    <Screen>
      <Text variant="title">{t('verifier.earnings_title')}</Text>

      {earnings.isPending ? (
        <LoadingSkeleton lines={3} />
      ) : earnings.isError ? (
        <ErrorState
          title={t('errors.generic_title')}
          retryLabel={t('common.retry')}
          onRetry={() => void earnings.refetch()}
        />
      ) : completed.length === 0 ? (
        <EmptyState title={t('verifier.earnings_empty')} />
      ) : (
        <>
          <Card>
            <SectionHeader title={t('verifier.earnings_total')} />
            <Text variant="display" color="primary">
              {formatMoney(total, 'EUR', i18n.language)}
            </Text>
            <Text variant="small" color="textSecondary">
              {t('visit.completed_visits', { count: completed.length })}
            </Text>
          </Card>

          <View style={styles.list}>
            {completed.map((visit) => (
              <Card key={visit.id} muted>
                <Text variant="body">
                  {formatVisitDateLong(visit.scheduled_at, i18n.language)}
                </Text>
                <Text variant="small" color="textSecondary">
                  {formatMoney(PAYOUT_PER_VISIT, 'EUR', i18n.language)}
                </Text>
              </Card>
            ))}
          </View>
        </>
      )}

      <Text variant="small" color="textMuted">
        {t('verifier.earnings_note')}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({ list: { gap: spacing.sm } });
