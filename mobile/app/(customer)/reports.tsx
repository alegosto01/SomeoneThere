import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Card, EmptyState, ErrorState, LoadingSkeleton, Screen, StatusBadge, Text } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/AuthProvider';
import { useCustomerReports } from '@/features/reports/queries';
import { analytics } from '@/lib/analytics';
import { formatVisitDateLong } from '@/utils/datetime';
import { shortAddress } from '@/utils/format';

export default function ReportsScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { session } = useAuth();
  const reports = useCustomerReports(session?.user.id);

  return (
    <Screen>
      <Text variant="title">{t('reports.title')}</Text>

      {reports.isPending ? (
        <LoadingSkeleton lines={4} />
      ) : reports.isError ? (
        <ErrorState
          title={t('errors.generic_title')}
          body={t('errors.load_reports')}
          retryLabel={t('common.retry')}
          onRetry={() => void reports.refetch()}
        />
      ) : (reports.data ?? []).length === 0 ? (
        <EmptyState title={t('reports.empty_title')} body={t('reports.empty_body')} />
      ) : (
        <View style={styles.list}>
          {(reports.data ?? []).map((report) => {
            const visit = report.visit as unknown as {
              scheduled_at: string;
              property: { address_line: string };
            };
            return (
              <Card
                key={report.id}
                onPress={() => {
                  analytics.track('report_opened', { report_id: report.id });
                  router.push(`/(customer)/report/${report.id}`);
                }}
                accessibilityLabel={shortAddress(visit.property.address_line)}
              >
                <Text variant="bodyStrong">{shortAddress(visit.property.address_line)}</Text>
                <Text variant="small" color="textSecondary">
                  {formatVisitDateLong(visit.scheduled_at, i18n.language)}
                </Text>

                <StatusBadge label={t('reports.ready')} tone="positive" symbol="✓" />

                {/*
                  The headline is the listing-match finding, in neutral wording.
                  Never "safe" or "verified" (spec §20).
                */}
                {report.listing_match ? (
                  <Text variant="small" color="textSecondary">
                    {t(`report.match.${report.listing_match}`)}
                  </Text>
                ) : null}

                <Text variant="small" color="primary">
                  {t('reports.open_report')} →
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
