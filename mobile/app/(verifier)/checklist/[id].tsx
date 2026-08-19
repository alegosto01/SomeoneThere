import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { PermissionSummary } from '@/components/PermissionSummary';
import {
  Button,
  Card,
  ErrorState,
  Input,
  LoadingSkeleton,
  RadioGroup,
  Screen,
  SecondaryButton,
  SectionHeader,
  Text,
} from '@/components/ui';
import { CHECKLIST_SECTIONS, REQUIRED_OBSERVATION_CATEGORIES } from '@/constants/observations';
import { spacing } from '@/constants/theme';
import { useReportByVisit } from '@/features/reports/queries';
import { syncReportDraft } from '@/features/verifier/sync';
import { useCheckOut, useStartLiveCall, useVisit } from '@/features/visits/queries';
import { openLiveCall } from '@/lib/live-call';
import { useChecklistDraft } from '@/store/checklist-draft';
import type { ObservationRating } from '@/types';
import { capturePermissions } from '@/utils/permissions';

const RATINGS: ObservationRating[] = [
  'good',
  'acceptable',
  'concern',
  'not_checked',
  'not_applicable',
];

/**
 * The live walkthrough (spec §34, §35).
 *
 * Every keystroke lands in the persisted local draft first — a verifier inside a
 * concrete building will lose signal, and losing their notes is not acceptable.
 * Syncing to the backend is opportunistic and failure-tolerant.
 */
export default function VerifierChecklistScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const visit = useVisit(id);
  const report = useReportByVisit(id);
  const checkOut = useCheckOut();
  const startLive = useStartLiveCall();

  const { drafts, getDraft, setObservation, setReportId, queuePhoto } = useChecklistDraft();
  const draft = id ? (drafts[id] ?? getDraft(id)) : null;

  const [error, setError] = useState<string | null>(null);

  // Bind the local draft to the server-side report row as soon as one exists.
  useEffect(() => {
    if (id && report.data?.id && draft && draft.reportId !== report.data.id) {
      setReportId(id, report.data.id);
    }
  }, [id, report.data?.id, draft, setReportId]);

  const progress = useMemo(() => {
    if (!draft) return { done: 0, total: REQUIRED_OBSERVATION_CATEGORIES.length };
    const done = REQUIRED_OBSERVATION_CATEGORIES.filter(
      (category) => draft.observations[category]?.rating,
    ).length;
    return { done, total: REQUIRED_OBSERVATION_CATEGORIES.length };
  }, [draft]);

  const sync = useCallback(async () => {
    if (draft) await syncReportDraft(draft);
  }, [draft]);

  async function onAddPhoto() {
    if (!id) return;
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchCameraAsync({ quality: 0.8, exif: false });
    if (result.canceled || !result.assets[0]) return;

    // Queued locally; uploaded (and stripped of metadata) when there is signal.
    queuePhoto(id, result.assets[0].uri, '');
  }

  async function onFinish() {
    if (!id) return;
    setError(null);
    try {
      await sync();
      await checkOut.mutateAsync(id);
      router.replace(`/(verifier)/report/${id}`);
    } catch (caught) {
      setError(t((caught as Error).message, { defaultValue: t('errors.unknown') }));
    }
  }

  if (visit.isPending || !draft) {
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
  const permissions = capturePermissions(data);

  return (
    <>
      <Stack.Screen options={{ title: t('verifier.checklist_title') }} />
      <Screen
        footer={
          <Button
            label={t('verifier.finish_visit')}
            onPress={() => void onFinish()}
            loading={checkOut.isPending}
          />
        }
      >
        <View style={styles.header}>
          <Text variant="title">{t('verifier.checklist_title')}</Text>
          <Text variant="small" color="textSecondary">
            {t('verifier.checklist_progress', progress)}
          </Text>
        </View>

        {/* The capture rules stay visible during the walkthrough, not just before it. */}
        <Card muted>
          <PermissionSummary visit={data} />
        </Card>

        {/*
          The call link is set by SomeoneThere before the visit. Opening it here
          also marks the session live, which is what unlocks the customer's own
          join button (spec §17) — so the two sides can never be out of step.
        */}
        {data.live_call_provider && data.live_call_url ? (
          <SecondaryButton
            label={data.status === 'live' ? t('visit.join_live') : t('verifier.start_live')}
            loading={startLive.isPending}
            onPress={() => {
              if (data.status !== 'live') {
                void startLive.mutateAsync({ visitId: data.id, url: data.live_call_url! });
              }
              void openLiveCall({
                url: data.live_call_url!,
                provider: data.live_call_provider,
                visitId: data.id,
              });
            }}
          />
        ) : data.live_call_provider ? (
          <Card muted>
            <Text variant="small" color="textMuted">
              {t('visit.join_live_disabled')}
            </Text>
          </Card>
        ) : null}

        {data.priorities.length > 0 ? (
          <Card>
            <SectionHeader title={t('verifier.priorities_title')} />
            {data.priorities.map((priority) => (
              <Text key={priority.id} variant="body">
                ✓ {t(`priorities.${priority.priority_key}`, { defaultValue: priority.priority_key })}
              </Text>
            ))}
          </Card>
        ) : null}

        {CHECKLIST_SECTIONS.map((section) => (
          <Card key={section.key}>
            <SectionHeader title={t(`checklist.${section.key}`)} />
            {section.categories.map((category) => {
              const observation = draft.observations[category];
              const required = REQUIRED_OBSERVATION_CATEGORIES.includes(category);
              return (
                <View key={category} style={styles.observation}>
                  <Text variant="bodyStrong">
                    {t(`observations.${category}`)}
                    {required ? ' *' : ''}
                  </Text>
                  <RadioGroup<ObservationRating>
                    label={t(`observations.${category}`)}
                    value={observation?.rating ?? null}
                    onChange={(rating) => {
                      setObservation(id!, category, { rating });
                      void sync();
                    }}
                    options={RATINGS.map((value) => ({
                      value,
                      label: t(`report.ratings.${value}`),
                    }))}
                  />
                  <Input
                    label={t('verifier.note_placeholder')}
                    value={observation?.note ?? ''}
                    onChangeText={(note) => setObservation(id!, category, { note })}
                    onBlur={() => void sync()}
                    multiline
                    optional
                    optionalLabel={t('common.optional')}
                  />
                </View>
              );
            })}
          </Card>
        ))}

        <Card>
          <SectionHeader title={t('report.photos_section')} />
          {permissions.canTakePhotos ? (
            <>
              <SecondaryButton label={t('verifier.add_photo')} onPress={() => void onAddPhoto()} />
              {draft.pending_photos.length > 0 ? (
                <Text variant="small" color="textSecondary">
                  {t('verifier.photos_queued', { count: draft.pending_photos.length })}
                </Text>
              ) : null}
            </>
          ) : (
            <Text variant="small" color="textMuted">
              {t('verifier.photos_blocked')}
            </Text>
          )}
        </Card>

        {error ? (
          <Text variant="small" color="negative" accessibilityLiveRegion="polite">
            {error}
          </Text>
        ) : null}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs },
  observation: { gap: spacing.sm, paddingVertical: spacing.md },
});
