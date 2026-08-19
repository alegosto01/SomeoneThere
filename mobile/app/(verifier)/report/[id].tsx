import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

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
  TextArea,
  TextButton,
} from '@/components/ui';
import { REQUIRED_OBSERVATION_CATEGORIES } from '@/constants/observations';
import { spacing } from '@/constants/theme';
import { useReportByVisit, useSubmitReport } from '@/features/reports/queries';
import { syncReportDraft, uploadQueuedPhoto } from '@/features/verifier/sync';
import { useVisit } from '@/features/visits/queries';
import { useChecklistDraft } from '@/store/checklist-draft';
import type { AnswerSource, ListingMatch } from '@/types';

const MATCHES: ListingMatch[] = [
  'consistent',
  'minor_differences',
  'major_differences',
  'unable_to_determine',
];

const SOURCES: AnswerSource[] = ['landlord', 'agent', 'tenant', 'other'];

/**
 * Report builder and submission (spec §36, §37).
 *
 * The submit button stays disabled until the minimum content exists; the
 * database re-checks the same rules in `submit_report`, so a client bug cannot
 * produce an empty report.
 */
export default function VerifierReportScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const visit = useVisit(id);
  const report = useReportByVisit(id);
  const submitReport = useSubmitReport();

  const {
    drafts,
    getDraft,
    setField,
    setReportId,
    addDifference,
    removeDifference,
    addQuestion,
    updateQuestion,
    removeQuestion,
    addUncheckedArea,
    removeUncheckedArea,
    dequeuePhoto,
    clear,
  } = useChecklistDraft();

  const draft = id ? (drafts[id] ?? getDraft(id)) : null;

  const [newDifference, setNewDifference] = useState('');
  const [newArea, setNewArea] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id && report.data?.id && draft && draft.reportId !== report.data.id) {
      setReportId(id, report.data.id);
    }
  }, [id, report.data?.id, draft, setReportId]);

  if (visit.isPending || report.isPending || !draft) {
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

  const missingRequired = REQUIRED_OBSERVATION_CATEGORIES.filter(
    (category) => !draft.observations[category]?.rating,
  );
  const canSubmit =
    !!draft.listing_match &&
    draft.verifier_summary.trim().length >= 20 &&
    missingRequired.length === 0;

  async function onSubmit() {
    if (!id || !draft?.reportId) return;
    setSubmitting(true);
    setError(null);

    try {
      // Flush notes first, then photos: a photo upload that fails must not cost
      // the verifier their written observations.
      const synced = await syncReportDraft(draft);
      if (!synced) throw new Error('errors.network');

      for (const photo of draft.pending_photos) {
        const uploaded = await uploadQueuedPhoto({
          visitId: id,
          reportId: draft.reportId,
          uri: photo.uri,
          caption: photo.caption,
        });
        if (uploaded) dequeuePhoto(id, photo.uri);
      }

      await submitReport.mutateAsync(draft.reportId);
      clear(id);
      router.replace('/(verifier)/report-submitted');
    } catch (caught) {
      setError(t((caught as Error).message, { defaultValue: t('errors.unknown') }));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: t('verifier.report_title') }} />
      <Screen
        footer={
          <Button
            label={t('verifier.submit_report')}
            onPress={() => void onSubmit()}
            disabled={!canSubmit}
            disabledHint={
              missingRequired.length > 0
                ? t('verifier.errors.missing_required')
                : t('verifier.errors.summary_too_short')
            }
            loading={submitting}
          />
        }
      >
        <Text variant="title">{t('verifier.report_title')}</Text>

        <Card>
          <SectionHeader title={t('verifier.listing_match_title')} />
          <RadioGroup<ListingMatch>
            label={t('verifier.listing_match_title')}
            value={draft.listing_match}
            onChange={(value) => setField(id!, 'listing_match', value)}
            options={MATCHES.map((value) => ({
              value,
              label: t(`report.match.${value}`),
            }))}
          />
        </Card>

        <Card>
          <SectionHeader title={t('verifier.differences_title')} />
          {draft.differences.map((difference, index) => (
            <View key={`${difference}-${index}`} style={styles.listRow}>
              <Text variant="body" style={styles.listText}>
                • {difference}
              </Text>
              <TextButton label={t('common.remove')} onPress={() => removeDifference(id!, index)} />
            </View>
          ))}
          <Input
            label={t('verifier.differences_title')}
            placeholder={t('verifier.differences_placeholder')}
            value={newDifference}
            onChangeText={setNewDifference}
            optional
            optionalLabel={t('common.optional')}
          />
          <SecondaryButton
            label={t('common.add')}
            onPress={() => {
              if (!newDifference.trim()) return;
              addDifference(id!, newDifference.trim());
              setNewDifference('');
            }}
          />
        </Card>

        <Card>
          <SectionHeader title={t('verifier.questions_answers_title')} />
          {draft.questions.map((question, index) => (
            <View key={index} style={styles.question}>
              <Input
                label={t('verifier.questions_title')}
                value={question.question}
                onChangeText={(value) => updateQuestion(id!, index, { question: value })}
              />
              <Input
                label={t('verifier.answer_placeholder')}
                value={question.answer}
                onChangeText={(value) => updateQuestion(id!, index, { answer: value })}
              />
              <RadioGroup<AnswerSource>
                label={t('verifier.answer_source')}
                value={question.answer_source}
                onChange={(value) => updateQuestion(id!, index, { answer_source: value })}
                options={SOURCES.map((value) => ({
                  value,
                  label: t(`report.sources.${value}`),
                }))}
              />
              <TextButton label={t('common.remove')} onPress={() => removeQuestion(id!, index)} />
            </View>
          ))}
          <SecondaryButton
            label={t('common.add')}
            onPress={() =>
              addQuestion(id!, { question: '', answer: '', answer_source: null })
            }
          />
        </Card>

        {/* Areas not checked (spec §26) — this section is never optional. */}
        <Card>
          <SectionHeader
            title={t('verifier.unchecked_title')}
            subtitle={t('verifier.unchecked_hint')}
          />
          {draft.unchecked_areas.map((area, index) => (
            <View key={`${area}-${index}`} style={styles.listRow}>
              <Text variant="body" style={styles.listText}>
                • {area}
              </Text>
              <TextButton
                label={t('common.remove')}
                onPress={() => removeUncheckedArea(id!, index)}
              />
            </View>
          ))}
          <Input
            label={t('verifier.unchecked_title')}
            placeholder={t('verifier.unchecked_placeholder')}
            value={newArea}
            onChangeText={setNewArea}
            optional
            optionalLabel={t('common.optional')}
          />
          <SecondaryButton
            label={t('common.add')}
            onPress={() => {
              if (!newArea.trim()) return;
              addUncheckedArea(id!, newArea.trim());
              setNewArea('');
            }}
          />
        </Card>

        <Card>
          <SectionHeader title={t('verifier.summary_title')} subtitle={t('verifier.summary_hint')} />
          <TextArea
            label={t('verifier.summary_title')}
            placeholder={t('verifier.summary_placeholder')}
            value={draft.verifier_summary}
            onChangeText={(value) => setField(id!, 'verifier_summary', value)}
            maxLength={4000}
          />
        </Card>

        {missingRequired.length > 0 ? (
          <Card muted>
            <Text variant="small" color="attention">
              {t('verifier.errors.missing_required')}
            </Text>
            {missingRequired.map((category) => (
              <Text key={category} variant="small" color="textSecondary">
                • {t(`observations.${category}`)}
              </Text>
            ))}
          </Card>
        ) : null}

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
  listRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  listText: { flex: 1 },
  question: { gap: spacing.sm, paddingVertical: spacing.md },
});
