import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { VisitCard } from '@/components/VisitCard';
import { EmptyState, ErrorState, LoadingSkeleton, Screen, Text } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/AuthProvider';
import { useVerifierVisits } from '@/features/visits/queries';
import { isCompleted, isTerminal } from '@/utils/visit-status';

export default function VerifierVisitsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { session } = useAuth();
  const visits = useVerifierVisits(session?.user.id);

  const past = useMemo(
    () =>
      (visits.data ?? [])
        .filter((visit) => isCompleted(visit.status) || isTerminal(visit.status))
        .sort((a, b) => b.scheduled_at.localeCompare(a.scheduled_at)),
    [visits.data],
  );

  return (
    <Screen>
      <Text variant="title">{t('verifier.tabs.visits')}</Text>

      {visits.isPending ? (
        <LoadingSkeleton lines={4} />
      ) : visits.isError ? (
        <ErrorState
          title={t('errors.generic_title')}
          body={t('errors.load_visits')}
          retryLabel={t('common.retry')}
          onRetry={() => void visits.refetch()}
        />
      ) : past.length === 0 ? (
        <EmptyState title={t('visits.empty_completed')} />
      ) : (
        <View style={styles.list}>
          {past.map((visit) => (
            <VisitCard
              key={visit.id}
              visit={visit}
              property={visit.property}
              actionLabel={t('verifier.view_visit')}
              onPress={() => router.push(`/(verifier)/visit/${visit.id}`)}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({ list: { gap: spacing.md } });
