import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { Button, Input, Screen, Text, TextButton } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { signUp } from '@/features/auth/api';
import { fieldErrors } from '@/utils/form-errors';
import { registerSchema } from '@/utils/validation';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const [values, setValues] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function set(key: keyof typeof values) {
    return (value: string) => setValues((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit() {
    const parsed = registerSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error.issues));
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      await signUp(parsed.data);
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
        <Text variant="display">{t('auth.register_title')}</Text>

        <View style={styles.form}>
          <Input
            label={t('auth.first_name')}
            value={values.first_name}
            onChangeText={set('first_name')}
            autoComplete="given-name"
            error={errors.first_name ? t(errors.first_name) : undefined}
          />
          <Input
            label={t('auth.last_name')}
            value={values.last_name}
            onChangeText={set('last_name')}
            autoComplete="family-name"
            optional
            optionalLabel={t('common.optional')}
          />
          <Input
            label={t('auth.email')}
            value={values.email}
            onChangeText={set('email')}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            error={errors.email}
          />
          <Input
            label={t('auth.password')}
            value={values.password}
            onChangeText={set('password')}
            secureTextEntry
            autoComplete="new-password"
            error={errors.password ? t(errors.password) : undefined}
          />

          {errors.form ? (
            <Text variant="small" color="negative" accessibilityLiveRegion="polite">
              {errors.form}
            </Text>
          ) : null}

          <Button label={t('auth.sign_up')} onPress={onSubmit} loading={submitting} />

          <TextButton
            label={t('auth.have_account')}
            onPress={() => router.push('/(auth)/login')}
            style={styles.link}
          />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { gap: spacing.xl, paddingTop: spacing.xxxl },
  form: { gap: spacing.lg },
  link: { alignSelf: 'center' },
});
