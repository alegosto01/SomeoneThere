import { StripeProvider } from '@/lib/stripe/payment-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@/features/auth/AuthProvider';
import { initMonitoring } from '@/lib/monitoring';
import { colors } from '@/constants/theme';
import { config } from '@/constants/config';
import '@/i18n';

void SplashScreen.preventAutoHideAsync();
initMonitoring();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // The verifier is often on a bad connection; retry a couple of times
      // before showing an error state rather than failing on the first blip.
      retry: 2,
      staleTime: 30 * 1000,
      refetchOnWindowFocus: true,
    },
  },
});

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-only gate: render content as the splash hides
    setReady(true);
    void SplashScreen.hideAsync();
  }, []);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StripeProvider
            publishableKey={config.stripePublishableKey}
            merchantIdentifier="merchant.com.someonethere.app"
          >
            <AuthProvider>
              <StatusBar style="dark" />
              <Stack
                screenOptions={{
                  headerShadowVisible: false,
                  headerStyle: { backgroundColor: colors.background },
                  headerTintColor: colors.text,
                  contentStyle: { backgroundColor: colors.background },
                }}
              >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(customer)" options={{ headerShown: false }} />
                <Stack.Screen name="(verifier)" options={{ headerShown: false }} />
              </Stack>
            </AuthProvider>
          </StripeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
