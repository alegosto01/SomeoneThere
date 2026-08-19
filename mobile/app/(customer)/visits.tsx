import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { VisitCard } from '@/components/VisitCard';
import { EmptyState, ErrorState, LoadingSkeleton, Screen, Text } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/AuthProvider';
import { useCustomerVisits } from '@/features/visits/queries';
import { isCompleted, isTerminal, isUpcoming } from '@/utils/visit-status';

type Tab = 'upcoming' | 'completed';

export default function VisitsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { session } = useAuth();
  const visits = useCustomerVisits(session?.user.id);
  const [tab, setTab] = useState<Tab>('upcoming');

  const { upcoming, completed } = useMemo(() => {
    const all = visits.data ?? [];
    return {
      upcoming: all.filter((visit) => isUpcoming(visit.status)),
      // Cancelled, failed-access and refunded visits belong in the completed
      // list too — they are finished, and hiding them would leave the customer
      // wondering where their booking went.
      completed: all
        .filter((visit) => isCompleted(visit.status) || isTerminal(visit.status))
        .sort((a, b) => b.scheduled_at.localeCompare(a.scheduled_at)),
    };
  }, [visits.data]);

  const shown = tab === 'upcoming' ? upcoming : completed;

  return (
    <Screen>
      <Text variant="title">{t('visits.title')}</Text>

      <View style={styles.tabs} accessibilityRole="tablist">
        {(['upcoming', 'completed'] as Tab[]).map((value) => (
          <Pressable
            key={value}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === value }}
            onPress={() => setTab(value)}
            style={[styles.tab, tab === value && styles.tabActive]}
          >
            <Text variant={tab === value ? 'bodyStrong' : 'body'} color={tab === value ? 'primary' : 'textSecondary'}>
              {t(`visits.${value}`)}
            </Text>
          </Pressable>
        ))}
      </View>

      {visits.isPending ? (
        <LoadingSkeleton lines={4} />
      ) : visits.isError ? (
        <ErrorState
          title={t('errors.generic_title')}
          body={t('errors.load_visits')}
          retryLabel={t('common.retry')}
          onRetry={() => void visits.refetch()}
        />
      ) : shown.length === 0 ? (
        <EmptyState
          title={t(tab === 'upcoming' ? 'visits.empty_upcoming' : 'visits.empty_completed')}
          actionLabel={tab === 'upcoming' ? t('home.cta_request') : undefined}
          onAction={
            tab === 'upcoming' ? () => router.push('/(customer)/request/property') : undefined
          }
        />
      ) : (
        <View style={styles.list}>
          {shown.map((visit) => (
            <VisitCard
              key={visit.id}
              visit={visit}
              property={visit.property}
              actionLabel={
                visit.status === 'report_ready'
                  ? t('visits.open_report')
                  : t('visits.view_booking')
              }
              onPress={() =>
                visit.status === 'report_ready' && visit.report
                  ? router.push(`/(customer)/report/${visit.report.id}`)
                  : router.push(`/(customer)/visit/${visit.id}`)
              }
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    gap: spacing.xs,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
  },
  tabActive: { backgroundColor: colors.surface },
  list: { gap: spacing.md },
});
