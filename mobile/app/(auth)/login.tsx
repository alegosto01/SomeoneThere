import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { Button, Input, Screen, SecondaryButton, Text, TextButton } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { signIn } from '@/features/auth/api';
import { fieldErrors } from '@/utils/form-errors';
import { loginSchema } from '@/utils/validation';

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error.issues));
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      await signIn(parsed.data);
      router.replace('/');
    } catch (error) {
      setErrors({ form: t((error as Error).message, { defaultValue: t('errors.unknown') }) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Screen contentStyle={styles.content}>
        <View style={styles.header}>
          <Text variant="label" color="primary">
            {t('common.app_name').toUpperCase()} · {t('common.city').toUpperCase()}
          </Text>
          <Text variant="display">{t('auth.welcome_title')}</Text>
          <Text variant="body" color="textSecondary">
            {t('auth.welcome_subtitle')}
          </Text>
        </View>

        <View style={styles.form}>
          <Text variant="heading">{t('auth.login_title')}</Text>

          <Input
            label={t('auth.email')}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            error={errors.email}
          />
          <Input
            label={t('auth.password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="current-password"
            textContentType="password"
            error={errors.password}
          />

          {errors.form ? (
            <Text variant="small" color="negative" accessibilityLiveRegion="polite">
              {errors.form}
            </Text>
          ) : null}

          <Button label={t('auth.sign_in')} onPress={onSubmit} loading={submitting} />

          <Text variant="small" color="textMuted" center>
            {t('auth.or')}
          </Text>

          {/*
            Google sign-in is wired through Supabase OAuth; enable the provider
            in the Supabase dashboard before showing this to real users.
          */}
          <SecondaryButton
            label={t('auth.continue_google')}
            onPress={() => router.push('/(auth)/register')}
            disabled
          />

          <TextButton
            label={t('auth.no_account')}
            onPress={() => router.push('/(auth)/register')}
            style={styles.link}
          />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { gap: spacing.xxl, paddingTop: spacing.xxxl },
  header: { gap: spacing.sm },
  form: { gap: spacing.lg },
  link: { alignSelf: 'center' },
});
