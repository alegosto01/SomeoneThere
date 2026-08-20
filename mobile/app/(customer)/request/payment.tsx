import { paymentSheetAvailable, useStripe } from '@/lib/stripe/payment-sheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, ErrorState, LoadingState, Screen, Text } from '@/components/ui';
import { createPaymentIntent } from '@/lib/stripe';
import { analytics } from '@/lib/analytics';
import { captureError } from '@/lib/monitoring';
import { formatMoney } from '@/utils/format';

type Phase = 'preparing' | 'ready' | 'processing' | 'error';

/**
 * Checkout (spec §45). The client presents Stripe's sheet and reports the
 * outcome optimistically; the visit is only actually marked paid by the webhook,
 * so the confirmation screen deliberately says "request received", not "paid".
 */
export default function PaymentScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { visitId } = useLocalSearchParams<{ visitId: string }>();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [phase, setPhase] = useState<Phase>('preparing');
  const [price, setPrice] = useState<{ amount: number; currency: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const prepare = useCallback(async () => {
    if (!visitId) return;

    // On web there is no PaymentSheet. Say so before creating a PaymentIntent,
    // rather than letting the user reach the pay button and fail there.
    if (!paymentSheetAvailable) {
      setError(t('payment.unavailable_here'));
      setPhase('error');
      return;
    }

    setPhase('preparing');
    setError(null);

    try {
      const intent = await createPaymentIntent(visitId);
      setPrice({ amount: intent.amount, currency: intent.currency });

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'SomeoneThere',
        paymentIntentClientSecret: intent.clientSecret,
        allowsDelayedPaymentMethods: false,
      });
      if (initError) throw new Error(initError.message);

      setPhase('ready');
    } catch (caught) {
      captureError(caught, { area: 'payment_init' });
      setError(t('payment.failed_body'));
      setPhase('error');
    }
  }, [visitId, initPaymentSheet, t]);

  useEffect(() => {
    void prepare();
  }, [prepare]);

  async function onPay() {
    setPhase('processing');
    const { error: sheetError } = await presentPaymentSheet();

    if (sheetError) {
      // Cancelling is not a failure — send the customer back to the sheet.
      if (sheetError.code === 'Canceled') {
        setPhase('ready');
        return;
      }
      captureError(sheetError, { area: 'payment_sheet' });
      setError(t('payment.failed_body'));
      setPhase('error');
      return;
    }

    analytics.track('payment_completed', { visit_id: visitId });
    router.replace(`/(customer)/request/confirmation?visitId=${visitId}`);
  }

  if (phase === 'preparing') {
    return (
      <Screen>
        <LoadingState label={t('payment.processing')} />
      </Screen>
    );
  }

  if (phase === 'error') {
    return (
      <Screen>
        <ErrorState
          title={t('payment.failed_title')}
          body={error ?? t('payment.failed_body')}
          retryLabel={t('common.retry')}
          onRetry={() => void prepare()}
        />
      </Screen>
    );
  }

  return (
    <Screen
      footer={
        <Button
          label={
            price
              ? t('payment.pay_now', {
                  amount: formatMoney(price.amount, price.currency, i18n.language),
                })
              : t('payment.title')
          }
          onPress={() => void onPay()}
          loading={phase === 'processing'}
        />
      }
    >
      <Text variant="title">{t('payment.title')}</Text>
      <Text variant="body" color="textSecondary">
        {t('request.review.payment_note')}
      </Text>
    </Screen>
  );
}
