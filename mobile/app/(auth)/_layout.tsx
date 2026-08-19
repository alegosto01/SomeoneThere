import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/features/auth/AuthProvider';

export default function AuthLayout() {
  const { session, initializing } = useAuth();
  if (!initializing && session) return <Redirect href="/" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
