import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import {
  Avatar,
  Button,
  Card,
  ConfirmationDialog,
  LoadingSkeleton,
  RadioGroup,
  Screen,
  SectionHeader,
  Text,
  TextArea,
} from '@/components/ui';
import { spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/AuthProvider';
import { fetchVerifierProfile, updateVerifierProfile } from '@/features/profile/api';
import { setLanguage, type Language } from '@/i18n';
import { captureError } from '@/lib/monitoring';
import { initials } from '@/utils/format';

export default function VerifierProfileScreen() {
  const { t, i18n } = useTranslation();
  const { profile, signOut } = useAuth();
  const [bio, setBio] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  const verifierProfile = useQuery({
    queryKey: ['verifier-profile', profile?.id],
    queryFn: () => fetchVerifierProfile(profile!.id),
    enabled: !!profile?.id,
  });

  const data = verifierProfile.data;
  const bioValue = bio ?? data?.bio ?? '';

  async function onSaveBio() {
    if (!profile?.id) return;
    setSaving(true);
    try {
      await updateVerifierProfile(profile.id, {
        bio: bioValue || null,
        languages: data?.languages ?? [],
      });
      await verifierProfile.refetch();
    } catch (error) {
      captureError(error, { area: 'verifier_profile' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <Text variant="title">{t('verifier.profile_title')}</Text>

      <Card>
        <View style={styles.identity}>
          <Avatar
            uri={profile?.avatar_url}
            fallback={initials(profile?.first_name, profile?.last_name)}
            size={64}
          />
          <View style={styles.identityText}>
            <Text variant="heading">
              {[profile?.first_name, profile?.last_name].filter(Boolean).join(' ')}
            </Text>
            {verifierProfile.isPending ? null : (
              <Text
                variant="small"
                color={data?.identity_verified ? 'positive' : 'attention'}
              >
                {data?.identity_verified
                  ? `✓ ${t('verifier.identity_verified')}`
                  : `○ ${t('verifier.identity_pending')}`}
              </Text>
            )}
            {data ? (
              <Text variant="small" color="textSecondary">
                {t('visit.completed_visits', { count: data.completed_visits })}
                {data.average_rating ? ` · ${data.average_rating.toFixed(1)} ★` : ''}
              </Text>
            ) : null}
          </View>
        </View>
      </Card>

      {verifierProfile.isPending ? (
        <LoadingSkeleton lines={3} />
      ) : (
        <Card>
          <SectionHeader title={t('verifier.profile_title')} />
          <TextArea
            label={t('verifier.profile_title')}
            value={bioValue}
            onChangeText={setBio}
            maxLength={500}
            optional
            optionalLabel={t('common.optional')}
          />
          <Button label={t('common.save')} onPress={() => void onSaveBio()} loading={saving} />
        </Card>
      )}

      <Card>
        <SectionHeader title={t('profile.language')} />
        <RadioGroup<Language>
          label={t('profile.language')}
          value={(i18n.language.startsWith('es') ? 'es' : 'en') as Language}
          onChange={(language) => void setLanguage(language)}
          options={[
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
          ]}
        />
      </Card>

      <Card muted>
        <SectionHeader title={t('verifier.payout_details')} />
        <Text variant="small" color="textSecondary">
          {t('verifier.payout_details_note')}
        </Text>
      </Card>

      <Card muted>
        <SectionHeader title={t('verifier.safety_title')} />
        <Text variant="small" color="textSecondary">
          {t('verifier.safety_body')}
        </Text>
      </Card>

      <Button label={t('common.sign_out')} onPress={() => setConfirmSignOut(true)} />

      <ConfirmationDialog
        visible={confirmSignOut}
        title={t('profile.sign_out_confirm')}
        confirmLabel={t('common.sign_out')}
        cancelLabel={t('common.cancel')}
        onConfirm={() => {
          setConfirmSignOut(false);
          void signOut();
        }}
        onCancel={() => setConfirmSignOut(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: { flexDirection: 'row', gap: spacing.lg, alignItems: 'center' },
  identityText: { flex: 1, gap: 2 },
});
