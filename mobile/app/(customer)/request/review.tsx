import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { WizardProgress } from '@/components/WizardProgress';
import { Notice } from '@/components/Disclaimer';
import { Button, Card, Screen, SectionHeader, Text } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/AuthProvider';
import { useCreateVisitDraft } from '@/features/visits/queries';
import { analytics } from '@/lib/analytics';
import { VISIT_PRICE } from '@/lib/stripe';
import { useRequestDraft } from '@/store/request-draft';
import { formatVisitDateLong, formatTime } from '@/utils/datetime';
import { formatMoney, sanitizeText } from '@/utils/format';

function Line({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.line}>
      <Text variant="small" color="textMuted">
        {label}
      </Text>
      <Text variant="body">{value}</Text>
    </View>
  );
}

/** Step 5 — Review and payment (spec §13). */
export default function RequestReviewStep() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { session } = useAuth();
  const { draft } = useRequestDraft();
  const createDraft = useCreateVisitDraft();
  const [error, setError] = useState<string | null>(null);

  async function onPay() {
    if (!session?.user || !draft.scheduled_at) return;
    setError(null);

    try {
      const visit = await createDraft.mutateAsync({
        customerId: session.user.id,
        property: {
          listing_url: draft.listing_url || null,
          address_line: sanitizeText(draft.address_line, 200),
          city: draft.city,
          postal_code: draft.postal_code || null,
          neighborhood: draft.neighborhood || null,
          property_type: draft.property_type,
          advertised_rent: draft.advertised_rent ? Number(draft.advertised_rent) : null,
        },
        scheduledAt: draft.scheduled_at,
        expectedDurationMinutes: draft.expected_duration_minutes,
        contact: {
          name: draft.contact_name || null,
          contact_type: draft.contact_type,
          phone: draft.contact_phone || null,
          email: draft.contact_email || null,
        },
        accessConfirmed: draft.access_confirmed,
        priorities: draft.priorities,
        customerNotes: draft.customer_notes ? sanitizeText(draft.customer_notes) : null,
        liveCallProvider: draft.live_call_requested ? draft.live_call_provider : null,
        recordingRequested: draft.recording_requested,
        photosRequested: draft.photos_requested,
      });

      analytics.track('payment_started', { visit_id: visit.id });
      router.push(`/(customer)/request/payment?visitId=${visit.id}`);
    } catch (caught) {
      setError(t((caught as Error).message, { defaultValue: t('errors.unknown') }));
    }
  }

  const when = draft.scheduled_at
    ? `${formatVisitDateLong(draft.scheduled_at, i18n.language)} · ${formatTime(draft.scheduled_at)}`
    : '—';

  return (
    <Screen
      footer={
        <Button
          label={t('request.review.pay_cta')}
          onPress={onPay}
          loading={createDraft.isPending}
        />
      }
    >
      <WizardProgress current="review" />
      <Text variant="title">{t('request.review.title')}</Text>

      <Card>
        <SectionHeader title={t('request.review.property_section')} />
        <Line label={t('request.property.address')} value={draft.address_line} />
        <Line
          label={t('request.property.property_type')}
          value={t(`request.property.types.${draft.property_type}`)}
        />
        {draft.listing_url ? (
          <Line label={t('request.property.listing_url')} value={draft.listing_url} />
        ) : null}
      </Card>

      <Card>
        <SectionHeader title={t('request.review.when_section')} />
        <Line label={t('request.viewing.date')} value={when} />
        <Line
          label={t('request.viewing.contact_type')}
          value={t(`request.viewing.contact_types.${draft.contact_type}`)}
        />
        <Line
          label={t('request.viewing.access_question')}
          value={draft.access_confirmed ? t('common.yes') : t('common.not_yet')}
        />
      </Card>

      <Card>
        <SectionHeader title={t('request.review.priorities_section')} />
        {draft.priorities.length > 0 ? (
          <Text variant="body">
            {draft.priorities.map((key) => t(`priorities.${key}`)).join(' · ')}
          </Text>
        ) : null}
        {draft.customer_notes ? (
          <Text variant="small" color="textSecondary">
            {draft.customer_notes}
          </Text>
        ) : null}
      </Card>

      <Card>
        <SectionHeader title={t('request.review.preferences_section')} />
        <Line
          label={t('request.preferences.live_call_section')}
          value={
            draft.live_call_requested
              ? t(`request.preferences.providers.${draft.live_call_provider}`)
              : t('common.no')
          }
        />
        <Line
          label={t('request.preferences.recording_section')}
          value={draft.recording_requested ? t('common.yes') : t('common.no')}
        />
        <Line
          label={t('request.preferences.photos_section')}
          value={draft.photos_requested ? t('common.yes') : t('common.no')}
        />
      </Card>

      <Card>
        <SectionHeader title={t('request.review.price_section')} />
        <View style={styles.priceRow}>
          <Text variant="body">{t('request.review.price_label')}</Text>
          <Text variant="heading">
            {formatMoney(VISIT_PRICE.amount, VISIT_PRICE.currency, i18n.language)}
          </Text>
        </View>
        <Text variant="small" color="textSecondary">
          {t('request.review.cancellation_body')}
        </Text>
      </Card>

      {/* Paying is a request, not a confirmation of access (spec §13). */}
      <Notice>{t('request.review.payment_note')}</Notice>

      {error ? (
        <Text variant="small" color="negative" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  line: { gap: 2, paddingVertical: spacing.xs },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
