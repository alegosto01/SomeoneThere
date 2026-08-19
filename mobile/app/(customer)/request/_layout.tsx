import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function RequestLayout() {
  const { t } = useTranslation();
  return (
    <Stack
      screenOptions={{
        title: t('request.title'),
        headerBackTitle: t('common.back'),
      }}
    />
  );
}
