import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import {
  Button,
  Card,
  ErrorState,
  LoadingSkeleton,
  Screen,
  SectionHeader,
  Text,
} from '@/components/ui';
import { spacing } from '@/constants/theme';
import { useVisit } from '@/features/visits/queries';
import { openLiveCall } from '@/lib/live-call';
import { formatTime } from '@/utils/datetime';
import { shortAddress, verifierDisplayName } from '@/utils/format';
import { canJoinLiveCall } from '@/utils/visit-status';

/**
 * Day-of-visit screen (spec §17): the time, the address, who is attending, what
 * they will check, and one button.
 */
export default function PreVisitScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const visit = useVisit(id);

  if (visit.isPending) {
    return (
      <Screen>
        <LoadingSkeleton lines={5} />
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

  return (
    <>
      <Stack.Screen options={{ title: t('previsit.title') }} />
      <Screen
        footer={
          data.live_call_provider ? (
            <Button
              label={t('previsit.join_live')}
              disabled={!canJoin}
              disabledHint={canJoin ? undefined : t('previsit.waiting')}
              onPress={() =>
                void openLiveCall({
                  url: data.live_call_url!,
                  provider: data.live_call_provider,
                  visitId: data.id,
                })
              }
            />
          ) : null
        }
      >
        <View style={styles.header}>
          <Text variant="title">{t('previsit.title')}</Text>
          <Text variant="display">{formatTime(data.scheduled_at)}</Text>
          <Text variant="body" color="textSecondary">
            {shortAddress(data.property.address_line)}
          </Text>
        </View>

        {data.verifier ? (
          <Text variant="body">
            {t('previsit.attending', {
              name: verifierDisplayName(data.verifier.first_name, data.verifier.last_initial),
            })}
          </Text>
        ) : null}

        {data.priorities.length > 0 ? (
          <Card>
            <SectionHeader eyebrow={t('previsit.priorities_title')} />
            {data.priorities.map((priority) => (
              <Text key={priority.id} variant="body">
                ✓ {t(`priorities.${priority.priority_key}`, { defaultValue: priority.priority_key })}
              </Text>
            ))}
          </Card>
        ) : null}

        {data.customer_notes ? (
          <Card>
            <SectionHeader eyebrow={t('previsit.questions_title')} />
            <Text variant="body" color="textSecondary">
              {data.customer_notes}
            </Text>
          </Card>
        ) : null}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({ header: { gap: spacing.xs } });
