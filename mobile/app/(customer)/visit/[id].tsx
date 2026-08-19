import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Notice } from '@/components/Disclaimer';
import { VerifierCard } from '@/components/VerifierCard';
import {
  Button,
  Card,
  ConfirmationDialog,
  ErrorState,
  LoadingSkeleton,
  Screen,
  SecondaryButton,
  SectionHeader,
  Text,
  TextButton,
  Timeline,
} from '@/components/ui';
import { spacing } from '@/constants/theme';
import { useCancelVisit, useVisit } from '@/features/visits/queries';
import { analytics } from '@/lib/analytics';
import { openLiveCall } from '@/lib/live-call';
import { formatTime, formatVisitDateLong } from '@/utils/datetime';
import { fullAddress } from '@/utils/format';
import { buildTimeline, canCustomerCancel, canJoinLiveCall } from '@/utils/visit-status';

/** Visit detail with status timeline (spec §15, §16). */
export default function VisitDetailScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const visit = useVisit(id);
  const cancelVisit = useCancelVisit();
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    if (id) analytics.track('visit_opened', { visit_id: id });
  }, [id]);

  if (visit.isPending) {
    return (
      <Screen>
        <LoadingSkeleton lines={6} />
      </Screen>
    );
  }

  if (visit.isError || !visit.data) {
    return (
      <Screen>
        <ErrorState
          title={t('errors.generic_title')}
          body={t('errors.load_visit')}
          retryLabel={t('common.retry')}
          onRetry={() => void visit.refetch()}
        />
      </Screen>
    );
  }

  const data = visit.data;
  const canJoin = canJoinLiveCall(data);
  const timeline = buildTimeline(data.status).map((entry) => ({
    key: entry.step,
    label: t(`visit.timeline.${entry.step}`),
    state: entry.state,
  }));

  return (
    <>
      <Stack.Screen options={{ title: t('visit.title') }} />
      <Screen>
        <View style={styles.header}>
          <Text variant="title">{fullAddress(data.property)}</Text>
          <Text variant="body" color="textSecondary">
            {formatVisitDateLong(data.scheduled_at, i18n.language)} ·{' '}
            {formatTime(data.scheduled_at)}
          </Text>
        </View>

        {data.status === 'cancelled' ? <Notice>{t('visit.cancelled_notice')}</Notice> : null}
        {data.status === 'access_failed' ? (
          <Notice>{t('visit.access_failed_notice')}</Notice>
        ) : null}
        {data.status === 'refunded' ? <Notice>{t('visit.refunded_notice')}</Notice> : null}

        <Card>
          <SectionHeader title={t('visit.timeline_title')} />
          <Timeline items={timeline} />
        </Card>

        {data.verifier ? (
          <VerifierCard verifier={data.verifier} />
        ) : (
          <Card muted>
            <Text variant="body" color="textSecondary">
              {t('visit.verifier_pending')}
            </Text>
          </Card>
        )}

        {data.priorities.length > 0 ? (
          <Card>
            <SectionHeader title={t('visit.priorities_section')} />
            {data.priorities.map((priority) => (
              <Text key={priority.id} variant="body">
                ✓ {t(`priorities.${priority.priority_key}`, { defaultValue: priority.priority_key })}
              </Text>
            ))}
          </Card>
        ) : null}

        {data.customer_notes ? (
          <Card>
            <SectionHeader title={t('visit.questions_section')} />
            <Text variant="body" color="textSecondary">
              {data.customer_notes}
            </Text>
          </Card>
        ) : null}

        {data.status === 'report_ready' && data.report ? (
          <Button
            label={t('visit.open_report')}
            onPress={() => router.push(`/(customer)/report/${data.report!.id}`)}
          />
        ) : null}

        {/*
          The join button stays disabled until the verifier is actually at the
          property and the call is marked ready (spec §17) — a live link the
          customer can open too early is worse than no link at all.
        */}
        {data.live_call_provider ? (
          <Button
            label={t('visit.join_live')}
            disabled={!canJoin}
            disabledHint={t('visit.join_live_disabled')}
            onPress={() =>
              void openLiveCall({
                url: data.live_call_url!,
                provider: data.live_call_provider,
                visitId: data.id,
              })
            }
          />
        ) : null}

        <SecondaryButton
          label={t('previsit.title')}
          onPress={() => router.push(`/(customer)/previsit/${data.id}`)}
        />

        {canCustomerCancel(data.status) ? (
          <TextButton label={t('visit.cancel_visit')} onPress={() => setConfirmCancel(true)} />
        ) : null}

        <ConfirmationDialog
          visible={confirmCancel}
          title={t('visit.cancel_confirm_title')}
          body={t('visit.cancel_confirm_body')}
          confirmLabel={t('visit.cancel_visit')}
          cancelLabel={t('common.close')}
          destructive
          loading={cancelVisit.isPending}
          onConfirm={async () => {
            await cancelVisit.mutateAsync({
              visitId: data.id,
              reason: 'customer_cancelled',
            });
            setConfirmCancel(false);
          }}
          onCancel={() => setConfirmCancel(false)}
        />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({ header: { gap: spacing.xs } });
