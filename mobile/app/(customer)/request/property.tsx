import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { WizardProgress } from '@/components/WizardProgress';
import { Button, Input, RadioGroup, Screen, Text, TextButton } from '@/components/ui';
import { useRequestDraft } from '@/store/request-draft';
import type { PropertyType } from '@/types';
import { propertyStepSchema } from '@/utils/validation';

/** Step 1 — Property (spec §9). */
export default function RequestPropertyStep() {
  const { t } = useTranslation();
  const router = useRouter();
  const { draft, update } = useRequestDraft();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [urlHidden, setUrlHidden] = useState(false);

  function onNext() {
    const parsed = propertyStepSchema.safeParse({
      listing_url: draft.listing_url || undefined,
      address_line: draft.address_line,
      city: draft.city,
      postal_code: draft.postal_code,
      neighborhood: draft.neighborhood,
      property_type: draft.property_type,
      advertised_rent: draft.advertised_rent ? Number(draft.advertised_rent) : null,
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
    router.push('/(customer)/request/viewing');
  }

  return (
    <Screen footer={<Button label={t('common.next')} onPress={onNext} />}>
      <WizardProgress current="property" />
      <Text variant="title">{t('request.property.title')}</Text>

      {!urlHidden ? (
        <>
          <Input
            label={t('request.property.listing_url')}
            hint={t('request.property.listing_url_hint')}
            value={draft.listing_url}
            onChangeText={(value) => update({ listing_url: value })}
            autoCapitalize="none"
            keyboardType="url"
            optional
            optionalLabel={t('common.optional')}
            error={errors.listing_url}
          />
          {/*
            A listing link is genuinely optional — plenty of Madrid rentals only
            ever exist in a WhatsApp message. Never block the booking on it.
          */}
          <TextButton
            label={t('request.property.no_url')}
            onPress={() => {
              update({ listing_url: '' });
              setUrlHidden(true);
            }}
          />
        </>
      ) : null}

      <Input
        label={t('request.property.address')}
        value={draft.address_line}
        onChangeText={(value) => update({ address_line: value })}
        autoComplete="street-address"
        error={errors.address_line}
      />

      <Input
        label={t('request.property.city')}
        value={draft.city}
        onChangeText={(value) => update({ city: value })}
        error={errors.city}
      />

      <Input
        label={t('request.property.postal_code')}
        value={draft.postal_code}
        onChangeText={(value) => update({ postal_code: value })}
        keyboardType="number-pad"
        optional
        optionalLabel={t('common.optional')}
      />

      <Input
        label={t('request.property.neighborhood')}
        value={draft.neighborhood}
        onChangeText={(value) => update({ neighborhood: value })}
        optional
        optionalLabel={t('common.optional')}
      />

      <RadioGroup<PropertyType>
        label={t('request.property.property_type')}
        value={draft.property_type}
        onChange={(property_type) => update({ property_type })}
        options={(['room', 'studio', 'apartment', 'other'] as PropertyType[]).map((value) => ({
          value,
          label: t(`request.property.types.${value}`),
        }))}
      />

      <Input
        label={t('request.property.rent')}
        value={draft.advertised_rent}
        onChangeText={(value) => update({ advertised_rent: value.replace(/[^0-9.]/g, '') })}
        keyboardType="decimal-pad"
        optional
        optionalLabel={t('common.optional')}
        error={errors.advertised_rent}
      />
    </Screen>
  );
}
