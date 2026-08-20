/**
 * Native Stripe surface, isolated behind one module.
 *
 * `@stripe/stripe-react-native` is native-only — importing it anywhere that the
 * web bundler can reach breaks the whole web build, not just the payment screen.
 * Everything that touches the Stripe SDK goes through here, and `payment-sheet.web.ts`
 * provides the web counterpart.
 */
export { StripeProvider, useStripe } from '@stripe/stripe-react-native';

export const paymentSheetAvailable = true;
