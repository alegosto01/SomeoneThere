import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { supabase } from '@/lib/supabase/client';
import { captureError } from '@/lib/monitoring';

/**
 * Push registration (spec §64). Tokens are stored per device so the backend can
 * notify a user whose app is closed; the backend is what triggers sends, not
 * mobile state changes.
 */

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications(userId: string): Promise<string | null> {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('visit-updates', {
        name: 'Visit updates',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    const existing = await Notifications.getPermissionsAsync();
    let status = existing.status;
    if (status !== 'granted') {
      status = (await Notifications.requestPermissionsAsync()).status;
    }
    if (status !== 'granted') return null;

    const { data: token } = await Notifications.getExpoPushTokenAsync();
    if (!token) return null;

    await supabase.from('device_tokens').upsert(
      { user_id: userId, platform: Platform.OS, token },
      { onConflict: 'token' },
    );

    return token;
  } catch (error) {
    // A missing push token must never block using the app.
    captureError(error, { area: 'notifications' });
    return null;
  }
}

export async function unregisterPushToken() {
  try {
    const { data: token } = await Notifications.getExpoPushTokenAsync();
    if (token) await supabase.from('device_tokens').delete().eq('token', token);
  } catch (error) {
    captureError(error, { area: 'notifications' });
  }
}

export { Notifications };
