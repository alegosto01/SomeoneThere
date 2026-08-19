import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, StyleSheet, View } from 'react-native';

import { PermissionSummary } from '@/components/PermissionSummary';
import {
  Button,
  Card,
  Checkbox,
  ErrorState,
  LoadingSkeleton,
  Screen,
  SecondaryButton,
  SectionHeader,
  Text,
} from '@/components/ui';
import { spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/AuthProvider';
import { useCheckIn, useRecordConsent, useVisit } from '@/features/visits/queries';
import { openExternalUrl } from '@/lib/live-call';
import { formatTime, formatVisitDateLong } from '@/utils/datetime';
import { fullAddress } from '@/utils/format';
import { canVerifierCheckIn } from '@/utils/permissions';

/**
 * Verifier visit preparation and permission confirmation (spec §31–§33).
 *
 * Consent is recorded here, in person, immediately before check-in — never
 * inferred from what the customer requested when booking.
 */
export default function VerifierVisitScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const visit = useVisit(id);
  const checkIn = useCheckIn();
  const recordConsent = useRecordConsent();

  const [photosAllowed, setPhotosAllowed] = useState(false);
  const [recordingAllowed, setRecordingAllowed] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  const canCheckIn = session?.user
    ? canVerifierCheckIn(data, session.user.id)
    : false;

  async function onCheckIn() {
    setError(null);
    try {
      // Record what the contact agreed to *before* checking in, so the checklist
      // opens with the correct capture rules already in force.
      await recordConsent.mutateAsync({
        visitId: data.id,
        photosAllowed,
        recordingAllowed,
      });
      await checkIn.mutateAsync(data.id);
      router.push(`/(verifier)/checklist/${data.id}`);
    } catch (caught) {
      setError(t((caught as Error).message, { defaultValue: t('errors.unknown') }));
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: t('verifier.visit_title') }} />
      <Screen>
        <View style={styles.header}>
          <Text variant="title">{fullAddress(data.property)}</Text>
          <Text variant="body" color="textSecondary">
            {formatVisitDateLong(data.scheduled_at, i18n.language)} ·{' '}
            {formatTime(data.scheduled_at)}
          </Text>
        </View>

        {data.property.listing_url ? (
          <SecondaryButton
            label={t('verifier.open_listing')}
            onPress={() => void openExternalUrl(data.property.listing_url!)}
          />
        ) : null}

        {data.property_contact ? (
          <Card>
            <SectionHeader title={t('visit.contact_section')} />
            <Text variant="body">
              {data.property_contact.name ?? '—'} ·{' '}
              {t(`request.viewing.contact_types.${data.property_contact.contact_type}`)}
            </Text>
            {data.property_contact.phone ? (
              <SecondaryButton
                label={data.property_contact.phone}
                onPress={() => void Linking.openURL(`tel:${data.property_contact!.phone}`)}
              />
            ) : null}
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

        {data.customer_notes ? (
          <Card>
            <SectionHeader title={t('verifier.questions_title')} />
            <Text variant="body" color="textSecondary">
              {data.customer_notes}
            </Text>
          </Card>
        ) : null}

        <Card>
          <SectionHeader eyebrow={t('verifier.ready_title')} title={t('verifier.permission_title')} />
          <PermissionSummary visit={data} />
        </Card>

        {/* Consent capture (spec §32) */}
        <Card>
          <SectionHeader
            title={t('verifier.consent_prompt')}
            subtitle={t('verifier.consent_note')}
          />
          <Checkbox
            label={t('verifier.consent_photos')}
            checked={photosAllowed}
            onToggle={() => setPhotosAllowed((value) => !value)}
          />
          {/*
            Recording only appears when the customer asked for it. If they did
            not, there is nothing to consent to and the option stays absent.
          */}
          {data.recording_requested ? (
            <Checkbox
              label={t('verifier.consent_recording')}
              checked={recordingAllowed}
              onToggle={() => setRecordingAllowed((value) => !value)}
            />
          ) : null}
        </Card>

        <Card muted>
          <SectionHeader title={t('verifier.safety_title')} />
          <Text variant="small" color="textSecondary">
            {t('verifier.safety_body')}
          </Text>
        </Card>

        {error ? (
          <Text variant="small" color="negative" accessibilityLiveRegion="polite">
            {error}
          </Text>
        ) : null}

        {data.checked_in_at ? (
          <Button
            label={t('verifier.checklist_title')}
            onPress={() => router.push(`/(verifier)/checklist/${data.id}`)}
          />
        ) : (
          <Button
            label={t('verifier.check_in')}
            onPress={() => void onCheckIn()}
            disabled={!canCheckIn}
            disabledHint={t('verifier.errors.cannot_check_in')}
            loading={checkIn.isPending || recordConsent.isPending}
          />
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({ header: { gap: spacing.xs } });
