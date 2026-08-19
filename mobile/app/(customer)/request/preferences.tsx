import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Notice } from '@/components/Disclaimer';
import { WizardProgress } from '@/components/WizardProgress';
import { Button, Checkbox, RadioGroup, Screen, SectionHeader, Text } from '@/components/ui';
import { useRequestDraft } from '@/store/request-draft';
import type { LiveCallProvider } from '@/types';

/** Step 4 — Viewing preferences and privacy (spec §12). */
export default function RequestPreferencesStep() {
  const { t } = useTranslation();
  const router = useRouter();
  const { draft, update } = useRequestDraft();

  return (
    <Screen
      footer={
        <Button
          label={t('common.next')}
          onPress={() => router.push('/(customer)/request/review')}
        />
      }
    >
      <WizardProgress current="preferences" />
      <Text variant="title">{t('request.preferences.title')}</Text>

      <SectionHeader title={t('request.preferences.live_call_section')} />
      <Checkbox
        label={t('request.preferences.live_call_label')}
        description={t('request.preferences.live_call_hint')}
        checked={draft.live_call_requested}
        onToggle={() => update({ live_call_requested: !draft.live_call_requested })}
      />

      {draft.live_call_requested ? (
        <RadioGroup<LiveCallProvider>
          label={t('request.preferences.provider_label')}
          value={draft.live_call_provider}
          onChange={(live_call_provider) => update({ live_call_provider })}
          options={(['google_meet', 'whatsapp', 'zoom', 'other'] as LiveCallProvider[]).map(
            (value) => ({ value, label: t(`request.preferences.providers.${value}`) }),
          )}
        />
      ) : null}

      <SectionHeader title={t('request.preferences.recording_section')} />
      {/*
        Recording defaults to "no" and stays off unless the property contact
        consents in person (spec §12). Asking for it here only records the
        request — the verifier sets the actual permission on site.
      */}
      <RadioGroup<string>
        label={t('request.preferences.recording_section')}
        value={draft.recording_requested ? 'yes' : 'no'}
        onChange={(value) => update({ recording_requested: value === 'yes' })}
        options={[
          { value: 'no', label: t('request.preferences.recording_no') },
          { value: 'yes', label: t('request.preferences.recording_yes') },
        ]}
      />

      <SectionHeader title={t('request.preferences.photos_section')} />
      <Checkbox
        label={t('request.preferences.photos_label')}
        checked={draft.photos_requested}
        onToggle={() => update({ photos_requested: !draft.photos_requested })}
      />

      <Notice>{t('request.preferences.privacy_notice')}</Notice>
    </Screen>
  );
}
