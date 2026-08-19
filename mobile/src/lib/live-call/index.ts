import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { analytics } from '@/lib/analytics';
import { captureError } from '@/lib/monitoring';
import type { LiveCallProvider } from '@/types';

/**
 * Live call MVP (spec §18): no in-app WebRTC. The visit stores a URL and we hand
 * off to whichever app owns it, then the user swipes back to SomeoneThere.
 */
export async function openLiveCall(params: {
  url: string;
  provider: LiveCallProvider | null;
  visitId: string;
}): Promise<boolean> {
  analytics.track('live_call_joined', {
    visit_id: params.visitId,
    provider: params.provider ?? 'other',
  });

  try {
    // WhatsApp links belong in the native app; the rest are fine in a browser tab.
    if (params.provider === 'whatsapp' && (await Linking.canOpenURL(params.url))) {
      await Linking.openURL(params.url);
      return true;
    }
    await WebBrowser.openBrowserAsync(params.url);
    return true;
  } catch (error) {
    captureError(error, { area: 'live_call' });
    return false;
  }
}

export async function openExternalUrl(url: string): Promise<boolean> {
  try {
    await WebBrowser.openBrowserAsync(url);
    return true;
  } catch (error) {
    captureError(error, { area: 'external_link' });
    return false;
  }
}
