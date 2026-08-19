import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { WizardProgress } from '@/components/WizardProgress';
import { Button, CheckboxGroup, Screen, Text, TextArea } from '@/components/ui';
import { PRIORITY_KEYS, type PriorityKey } from '@/constants/priorities';
import { analytics } from '@/lib/analytics';
import { useRequestDraft } from '@/store/request-draft';
import { prioritiesStepSchema } from '@/utils/validation';

/** Step 3 — Customer priorities (spec §11). */
export default function RequestPrioritiesStep() {
  const { t } = useTranslation();
  const router = useRouter();
  const { draft, update, togglePriority } = useRequestDraft();
  const [error, setError] = useState<string | null>(null);

  function onNext() {
    const parsed = prioritiesStepSchema.safeParse({
      priorities: draft.priorities,
      customer_notes: draft.customer_notes,
    });

    if (!parsed.success) {
      setError(t(parsed.error.issues[0]?.message ?? 'errors.unknown'));
      return;
    }

    setError(null);
    analytics.track('priorities_completed', { priority_count: draft.priorities.length });
    router.push('/(customer)/request/preferences');
  }

  return (
    <Screen footer={<Button label={t('common.next')} onPress={onNext} />}>
      <WizardProgress current="priorities" />
      <Text variant="title">{t('request.priorities.title')}</Text>
      <Text variant="body" color="textSecondary">
        {t('request.priorities.subtitle')}
      </Text>

      <CheckboxGroup<PriorityKey>
        label={t('request.priorities.title')}
        values={draft.priorities}
        onToggle={togglePriority}
        options={PRIORITY_KEYS.map((value) => ({ value, label: t(`priorities.${value}`) }))}
      />

      <TextArea
        label={t('request.priorities.notes_label')}
        placeholder={t('request.priorities.notes_placeholder')}
        value={draft.customer_notes}
        onChangeText={(value) => update({ customer_notes: value })}
        maxLength={2000}
        optional
        optionalLabel={t('common.optional')}
      />

      {error ? (
        <Text variant="small" color="negative" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </Screen>
  );
}
