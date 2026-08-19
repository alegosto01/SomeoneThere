import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

import {
  Card,
  ConfirmationDialog,
  RadioGroup,
  Screen,
  SectionHeader,
  Text,
} from '@/components/ui';
import { colors, MIN_TOUCH_TARGET, spacing } from '@/constants/theme';
import { config } from '@/constants/config';
import { useAuth } from '@/features/auth/AuthProvider';
import { requestAccountDeletion, updateProfile } from '@/features/profile/api';
import { setLanguage, type Language } from '@/i18n';
import { analytics } from '@/lib/analytics';
import { captureError } from '@/lib/monitoring';

function Row({ label, value, onPress }: { label: string; value?: string; onPress?: () => void }) {
  const content = (
    <View style={styles.row}>
      <Text variant="body">{label}</Text>
      {value ? (
        <Text variant="small" color="textSecondary">
          {value}
        </Text>
      ) : onPress ? (
        <Text variant="body" color="textMuted">
          ›
        </Text>
      ) : null}
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}>
      {content}
    </Pressable>
  );
}

export default function CustomerProfile() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { profile, signOut, refreshProfile } = useAuth();

  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function changeLanguage(language: Language) {
    await setLanguage(language);
    if (profile) {
      // Persisted so backend push notifications arrive in the same language.
      await updateProfile(profile.id, {
        first_name: profile.first_name ?? '',
        last_name: profile.last_name ?? '',
        phone: profile.phone ?? '',
        preferred_language: language,
      }).catch((error) => captureError(error, { area: 'profile_language' }));
      await refreshProfile();
    }
  }

  async function onDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await requestAccountDeletion();
      router.replace('/(auth)/login');
    } catch (error) {
      captureError(error, { area: 'account_deletion' });
      setDeleteError(t((error as Error).message, { defaultValue: t('errors.unknown') }));
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <Screen>
      <Text variant="title">{t('profile.title')}</Text>

      <Card>
        <SectionHeader title={t('profile.account_section')} />
        <Row
          label={t('profile.name')}
          value={[profile?.first_name, profile?.last_name].filter(Boolean).join(' ')}
        />
        <Row label={t('profile.email')} value={profile?.email ?? ''} />
        <Row label={t('profile.phone')} value={profile?.phone ?? '—'} />
      </Card>

      <Card>
        <SectionHeader title={t('profile.language')} />
        <RadioGroup<Language>
          label={t('profile.language')}
          value={(i18n.language.startsWith('es') ? 'es' : 'en') as Language}
          onChange={(language) => void changeLanguage(language)}
          options={[
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
          ]}
        />
      </Card>

      <Card>
        <SectionHeader title={t('profile.payments_section')} />
        <Text variant="small" color="textSecondary">
          {t('profile.payment_methods_note')}
        </Text>
      </Card>

      <Card>
        <SectionHeader title={t('profile.support_section')} />
        <Row
          label={t('profile.contact_support')}
          onPress={() => {
            analytics.track('support_opened');
            void Linking.openURL(`mailto:${config.supportEmail}`);
          }}
        />
        <Row
          label={t('profile.faq')}
          onPress={() => router.push('/(customer)/settings/how-it-works')}
        />
      </Card>

      <Card>
        <SectionHeader title={t('profile.legal_section')} />
        <Row
          label={t('profile.service_limitations')}
          onPress={() => router.push('/(customer)/settings/legal')}
        />
        <Row
          label={t('profile.privacy_policy')}
          onPress={() => router.push('/(customer)/settings/legal')}
        />
        <Row label={t('profile.terms')} onPress={() => router.push('/(customer)/settings/legal')} />
      </Card>

      <Card>
        <SectionHeader title={t('profile.danger_section')} />
        <Row label={t('common.sign_out')} onPress={() => setConfirmSignOut(true)} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('profile.delete_account')}
          onPress={() => setConfirmDelete(true)}
          style={styles.row}
        >
          <Text variant="body" color="negative">
            {t('profile.delete_account')}
          </Text>
        </Pressable>
      </Card>

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

      {deleteError ? (
        <Text variant="small" color="negative" accessibilityLiveRegion="polite">
          {deleteError}
        </Text>
      ) : null}

      <ConfirmationDialog
        visible={confirmDelete}
        title={t('profile.delete_confirm_title')}
        body={t('profile.delete_confirm_body')}
        confirmLabel={t('profile.delete_account')}
        cancelLabel={t('common.cancel')}
        destructive
        loading={deleting}
        onConfirm={() => void onDelete()}
        onCancel={() => setConfirmDelete(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: MIN_TOUCH_TARGET,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});
