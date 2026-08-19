import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View } from 'react-native';

import { Notice } from '@/components/Disclaimer';
import { WizardProgress } from '@/components/WizardProgress';
import {
  Button,
  Input,
  RadioGroup,
  Screen,
  SecondaryButton,
  SectionHeader,
  Text,
} from '@/components/ui';
import { spacing } from '@/constants/theme';
import { useRequestDraft } from '@/store/request-draft';
import type { PropertyContactType } from '@/types';
import { formatTime, formatVisitDateLong } from '@/utils/datetime';
import { viewingStepSchema } from '@/utils/validation';

/** Step 2 — Viewing details (spec §10). */
export default function RequestViewingStep() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { draft, update } = useRequestDraft();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [picker, setPicker] = useState<'date' | 'time' | null>(null);

  const scheduled = draft.scheduled_at ? new Date(draft.scheduled_at) : null;

  function onPickerChange(_event: unknown, selected?: Date) {
    setPicker(null);
    if (!selected) return;

    const base = scheduled ?? new Date();
    const next = new Date(base);
    if (picker === 'date') {
      next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
    } else {
      next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
    }
    update({ scheduled_at: next.toISOString() });
  }

  function onNext() {
    const parsed = viewingStepSchema.safeParse({
      scheduled_at: draft.scheduled_at ?? '',
      expected_duration_minutes: draft.expected_duration_minutes,
      contact_name: draft.contact_name,
      contact_type: draft.contact_type,
      contact_phone: draft.contact_phone,
      contact_email: draft.contact_email,
      access_confirmed: draft.access_confirmed,
    });

    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [String(issue.path[0]), t(issue.message)]),
        ),
      );
      return;
    }

    setErrors({});
    router.push('/(customer)/request/priorities');
  }

  return (
    <Screen footer={<Button label={t('common.next')} onPress={onNext} />}>
      <WizardProgress current="viewing" />
      <Text variant="title">{t('request.viewing.title')}</Text>

      <View style={styles.dateRow}>
        <SecondaryButton
          label={
            scheduled
              ? formatVisitDateLong(scheduled.toISOString(), i18n.language)
              : t('request.viewing.date')
          }
          onPress={() => setPicker('date')}
          style={styles.dateButton}
        />
        <SecondaryButton
          label={scheduled ? formatTime(scheduled.toISOString()) : t('request.viewing.time')}
          onPress={() => setPicker('time')}
          style={styles.dateButton}
        />
      </View>

      {errors.scheduled_at ? (
        <Text variant="small" color="negative" accessibilityLiveRegion="polite">
          {errors.scheduled_at}
        </Text>
      ) : null}

      {picker ? (
        <DateTimePicker
          value={scheduled ?? new Date(Date.now() + 24 * 60 * 60 * 1000)}
          mode={picker}
          minimumDate={picker === 'date' ? new Date() : undefined}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onPickerChange}
        />
      ) : null}

      <RadioGroup<string>
        label={t('request.viewing.duration')}
        value={String(draft.expected_duration_minutes)}
        onChange={(value) => update({ expected_duration_minutes: Number(value) })}
        options={['20', '30', '45', '60'].map((value) => ({
          value,
          label: t('common.minutes', { count: Number(value) }),
        }))}
      />

      <SectionHeader title={t('request.viewing.contact_section')} />

      <Input
        label={t('request.viewing.contact_name')}
        value={draft.contact_name}
        onChangeText={(value) => update({ contact_name: value })}
        optional
        optionalLabel={t('common.optional')}
      />

      <RadioGroup<PropertyContactType>
        label={t('request.viewing.contact_type')}
        value={draft.contact_type}
        onChange={(contact_type) => update({ contact_type })}
        options={(['landlord', 'agent', 'tenant', 'other'] as PropertyContactType[]).map(
          (value) => ({ value, label: t(`request.viewing.contact_types.${value}`) }),
        )}
      />

      <Input
        label={t('request.viewing.contact_phone')}
        value={draft.contact_phone}
        onChangeText={(value) => update({ contact_phone: value })}
        keyboardType="phone-pad"
        optional
        optionalLabel={t('common.optional')}
      />

      <Input
        label={t('request.viewing.contact_email')}
        value={draft.contact_email}
        onChangeText={(value) => update({ contact_email: value })}
        keyboardType="email-address"
        autoCapitalize="none"
        optional
        optionalLabel={t('common.optional')}
        error={errors.contact_email}
      />

      <RadioGroup<string>
        label={t('request.viewing.access_question')}
        value={draft.access_confirmed ? 'yes' : 'not_yet'}
        onChange={(value) => update({ access_confirmed: value === 'yes' })}
        options={[
          { value: 'yes', label: t('common.yes') },
          { value: 'not_yet', label: t('common.not_yet') },
        ]}
      />

      {/*
        Access not agreed yet is a normal state, not an error — but the customer
        must not walk away believing the visit is confirmed (spec §10).
      */}
      {!draft.access_confirmed ? (
        <Notice>{t('request.viewing.access_not_yet_notice')}</Notice>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  dateRow: { flexDirection: 'row', gap: spacing.md },
  dateButton: { flex: 1 },
});
