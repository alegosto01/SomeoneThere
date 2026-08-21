import type { ComponentProps, ReactNode } from 'react';
import { Fragment, createElement } from 'react';

/**
 * Native Stripe surface, isolated behind one module.
 *
 * Two reasons nothing imports `@stripe/stripe-react-native` directly:
 *
 * 1. It is native-only, so a static import breaks the whole web bundle rather
 *    than just the payment screen (see payment-sheet.web.ts).
 * 2. Its native side is absent from Expo Go, where importing it at module scope
 *    crashes the app on launch. Resolving it lazily means Expo Go can run every
 *    screen except payment, which is what makes previewing on a real phone
 *    possible without a full development build.
 *
 * `paymentSheetAvailable` is the single flag callers check; the payment screen
 * explains the limitation rather than failing at the pay button.
 */
type StripeModule = typeof import('@stripe/stripe-react-native');

let stripe: StripeModule | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  stripe = require('@stripe/stripe-react-native') as StripeModule;
} catch {
  stripe = null;
}

export const paymentSheetAvailable = stripe !== null;

// Props mirror the real provider so callers pass the same thing either way;
// the fallback simply ignores everything except children.
type StripeProviderProps = ComponentProps<StripeModule['StripeProvider']>;

function PassThroughProvider({ children }: { children?: ReactNode }) {
  return createElement(Fragment, null, children);
}

export const StripeProvider = (stripe?.StripeProvider ??
  PassThroughProvider) as (props: StripeProviderProps) => ReactNode;

const unavailable = async () => ({
  error: { code: 'Unavailable', message: 'stripe_unavailable' },
});

export const useStripe =
  stripe?.useStripe ??
  (() => ({
    initPaymentSheet: unavailable,
    presentPaymentSheet: unavailable,
    confirmPayment: unavailable,
    retrievePaymentIntent: unavailable,
  }));
