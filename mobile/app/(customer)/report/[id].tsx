import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';

import { ReportDisclaimer } from '@/components/Disclaimer';
import { ObservationRow } from '@/components/ObservationRow';
import {
  Card,
  ErrorState,
  LoadingSkeleton,
  Screen,
  SectionHeader,
  StatusBadge,
  Text,
} from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useReport, useSignedReportMedia } from '@/features/reports/queries';
import { durationBetween, formatTime, formatVisitDateLong } from '@/utils/datetime';
import { fullAddress, verifierDisplayName } from '@/utils/format';
import type { ListingMatch } from '@/types';

/** Listing-match tone. "Major differences" is attention, never alarm-red. */
const MATCH_TONE: Record<ListingMatch, 'positive' | 'attention' | 'neutral'> = {
  consistent: 'positive',
  minor_differences: 'neutral',
  major_differences: 'attention',
  unable_to_determine: 'neutral',
};

/** The viewing report (spec §21–§28). */
export default function ReportDetailScreen() {
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const report = useReport(id);
  const media = useSignedReportMedia(id, report.data?.media ?? []);

  if (report.isPending) {
    return (
      <Screen>
        <LoadingSkeleton lines={8} />
      </Screen>
    );
  }

  if (report.isError || !report.data) {
    return (
      <Screen>
        <ErrorState
          title={t('errors.generic_title')}
          body={t('errors.load_report')}
          retryLabel={t('common.retry')}
          onRetry={() => void report.refetch()}
        />
      </Screen>
    );
  }

  const data = report.data;
  const visit = data.visit;
  const duration =
    visit.checked_in_at && visit.checked_out_at
      ? durationBetween(visit.checked_in_at, visit.checked_out_at)
      : null;

  return (
    <>
      <Stack.Screen options={{ title: t('report.title') }} />
      <Screen>
        {/* Header (spec §21.1) */}
        <View style={styles.header}>
          <Text variant="label" color="textMuted">
            {t('report.title').toUpperCase()}
          </Text>
          <Text variant="title">{fullAddress(visit.property)}</Text>
          <Text variant="body" color="textSecondary">
            {formatVisitDateLong(visit.scheduled_at, i18n.language)}
            {visit.checked_in_at ? ` · ${formatTime(visit.checked_in_at)}` : ''}
          </Text>
          <StatusBadge label={t('report.verified_visit')} tone="positive" symbol="✓" />
          {/*
            "Verified visit" is about the workflow, not the property. Saying so
            immediately, next to the badge, is the whole point (spec §21.1).
          */}
          <Text variant="small" color="textMuted">
            {t('report.verified_visit_hint')}
          </Text>
        </View>

        <Card muted>
          <Text variant="small" color="textMuted">
            {t('report.visit_id')}: {visit.id}
          </Text>
          {data.verifier ? (
            <Text variant="small" color="textSecondary">
              {t('report.attended_by')}:{' '}
              {verifierDisplayName(data.verifier.first_name, data.verifier.last_initial)}
            </Text>
          ) : null}
          {duration !== null ? (
            <Text variant="small" color="textSecondary">
              {t('report.duration')}: {t('common.minutes', { count: duration })}
            </Text>
          ) : null}
        </Card>

        {/* Property match (spec §22) */}
        {data.listing_match ? (
          <Card>
            <SectionHeader title={t('report.match_section')} />
            <StatusBadge
              label={t(`report.match.${data.listing_match}`)}
              tone={MATCH_TONE[data.listing_match]}
            />
          </Card>
        ) : null}

        {data.verifier_summary ? (
          <Card>
            <SectionHeader title={t('report.summary_section')} />
            <Text variant="body" color="textSecondary">
              {data.verifier_summary}
            </Text>
          </Card>
        ) : null}

        {/* Observations (spec §23) */}
        {data.observations.length > 0 ? (
          <Card>
            <SectionHeader title={t('report.observations_section')} />
            {data.observations.map((observation) => (
              <ObservationRow
                key={observation.id}
                category={observation.category}
                rating={observation.rating}
                note={observation.note}
              />
            ))}
          </Card>
        ) : null}

        {/* Listing differences (spec §24) */}
        {data.differences.length > 0 ? (
          <Card>
            <SectionHeader eyebrow={t('report.differences_section')} />
            {data.differences.map((difference) => (
              <Text key={difference.id} variant="body" color="textSecondary">
                • {difference.description}
              </Text>
            ))}
          </Card>
        ) : null}

        {/* Questions and answers (spec §25) */}
        {data.questions.length > 0 ? (
          <Card>
            <SectionHeader eyebrow={t('report.questions_section')} />
            {data.questions.map((question) => (
              <View key={question.id} style={styles.qa}>
                <Text variant="bodyStrong">{question.question}</Text>
                <Text variant="body" color="textSecondary">
                  {question.answer ?? '—'}
                </Text>
                {question.answer_source ? (
                  <Text variant="small" color="textMuted">
                    {t('report.answer_source', {
                      source: t(`report.sources.${question.answer_source}`),
                    })}
                  </Text>
                ) : null}
              </View>
            ))}
          </Card>
        ) : null}

        {/* Areas not checked (spec §26) — explicit, never omitted. */}
        {data.unchecked_areas.length > 0 ? (
          <Card>
            <SectionHeader
              eyebrow={t('report.unchecked_section')}
              subtitle={t('report.unchecked_hint')}
            />
            {data.unchecked_areas.map((area) => (
              <Text key={area.id} variant="body" color="textSecondary">
                • {area.description}
              </Text>
            ))}
          </Card>
        ) : null}

        {/* Photos (spec §27) — served through short-lived signed URLs. */}
        <Card>
          <SectionHeader title={t('report.photos_section')} />
          {data.media.length === 0 ? (
            <Text variant="small" color="textMuted">
              {t('report.no_photos')}
            </Text>
          ) : media.isPending ? (
            <LoadingSkeleton lines={2} />
          ) : (
            <>
              <Text variant="small" color="textMuted">
                {t('report.photos_permission_note')}
              </Text>
              <View style={styles.photos}>
                {data.media.map((item) => {
                  const uri = media.data?.[item.storage_path];
                  return uri ? (
                    <View key={item.id} style={styles.photoWrapper}>
                      <Image
                        source={{ uri }}
                        style={styles.photo}
                        accessibilityLabel={item.caption ?? t('report.photos_section')}
                      />
                      {item.caption ? (
                        <Text variant="small" color="textMuted">
                          {item.caption}
                        </Text>
                      ) : null}
                    </View>
                  ) : null;
                })}
              </View>
            </>
          )}
        </Card>

        <ReportDisclaimer />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.sm },
  qa: { gap: 2, paddingVertical: spacing.sm },
  photos: { gap: spacing.md, marginTop: spacing.sm },
  photoWrapper: { gap: spacing.xs },
  photo: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
});
