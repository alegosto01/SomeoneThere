import type { ReactNode } from 'react';
import { createElement } from 'react';

/**
 * Web counterpart to `payment-sheet.ts`.
 *
 * The Stripe PaymentSheet is a native component with no web build, so on web the
 * provider is a pass-through and the sheet reports that it is unavailable rather
 * than pretending to work. The payment screen checks `paymentSheetAvailable` and
 * explains the limitation instead of failing at the moment of payment — a
 * checkout that looks functional and then dies is worse than one that says up
 * front it cannot run here.
 */
export function StripeProvider({ children }: { children?: ReactNode }) {
  return createElement('div', { style: { display: 'contents' } }, children);
}

const unavailable = async () => ({
  error: { code: 'Unavailable', message: 'stripe_unavailable_on_web' },
});

export function useStripe() {
  return {
    initPaymentSheet: unavailable,
    presentPaymentSheet: unavailable,
    confirmPayment: unavailable,
    retrievePaymentIntent: unavailable,
  };
}

export const paymentSheetAvailable = false;
