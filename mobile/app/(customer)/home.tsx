import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingSkeleton,
  Screen,
  SecondaryButton,
  StatusBadge,
  Text,
} from '@/components/ui';
import { spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/AuthProvider';
import { useCustomerVisits } from '@/features/visits/queries';
import { analytics } from '@/lib/analytics';
import { formatTime, formatVisitDateTime, relativeDayKey } from '@/utils/datetime';
import { shortAddress } from '@/utils/format';
import { isUpcoming } from '@/utils/visit-status';

export default function CustomerHome() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { session } = useAuth();
  const visits = useCustomerVisits(session?.user.id);

  /** The nearest upcoming visit is the only one the home screen shows (spec §7). */
  const nextVisit = useMemo(() => {
    return (visits.data ?? [])
      .filter((visit) => isUpcoming(visit.status))
      .sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at))[0];
  }, [visits.data]);

  function startRequest() {
    analytics.track('viewing_request_started');
    router.push('/(customer)/request/property');
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="label" color="primary">
          {t('common.app_name').toUpperCase()}
        </Text>
        <Text variant="small" color="textSecondary">
          {t('common.city')}
        </Text>
      </View>

      <View style={styles.hero}>
        <Text variant="display">{t('home.hero_title')}</Text>
        <Text variant="body" color="textSecondary">
          {t('home.hero_subtitle')}
        </Text>
        <Button label={t('home.cta_request')} onPress={startRequest} style={styles.cta} />
      </View>

      {visits.isPending ? (
        <LoadingSkeleton />
      ) : visits.isError ? (
        <ErrorState
          title={t('errors.generic_title')}
          body={t('errors.load_visits')}
          retryLabel={t('common.retry')}
          onRetry={() => void visits.refetch()}
        />
      ) : nextVisit ? (
        <Card
          onPress={() => router.push(`/(customer)/visit/${nextVisit.id}`)}
          accessibilityLabel={t('home.next_visit_label')}
        >
          <Text variant="label" color="textMuted">
            {t('home.next_visit_label')}
          </Text>
          <Text variant="heading">{shortAddress(nextVisit.property.address_line)}</Text>
          <Text variant="body" color="textSecondary">
            {relativeDayKey(nextVisit.scheduled_at)
              ? `${t(`common.${relativeDayKey(nextVisit.scheduled_at)}`)} · ${formatTime(nextVisit.scheduled_at)}`
              : formatVisitDateTime(nextVisit.scheduled_at, i18n.language)}
          </Text>

          <StatusBadge
            label={
              nextVisit.verifier_id ? t('home.verifier_assigned') : t('home.verifier_pending')
            }
            tone={nextVisit.verifier_id ? 'positive' : 'attention'}
            symbol={nextVisit.verifier_id ? '✓' : '○'}
          />

          <Text variant="small" color="primary">
            {t('home.view_booking')} →
          </Text>
        </Card>
      ) : (
        <EmptyState title={t('home.empty_title')} body={t('home.empty_body')} />
      )}

      <SecondaryButton
        label={t('home.how_it_works')}
        onPress={() => router.push('/(customer)/settings/how-it-works')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: 2 },
  hero: { gap: spacing.sm },
  cta: { marginTop: spacing.sm },
});
