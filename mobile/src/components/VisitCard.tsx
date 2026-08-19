import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Card, StatusBadge, Text } from '@/components/ui';
import { spacing } from '@/constants/theme';
import type { Property, Visit } from '@/types';
import { formatVisitDateTime, relativeDayKey, formatTime } from '@/utils/datetime';
import { shortAddress } from '@/utils/format';
import { statusTone } from '@/utils/visit-status';

export interface VisitCardProps {
  visit: Pick<Visit, 'id' | 'scheduled_at' | 'status' | 'verifier_id' | 'access_confirmed'>;
  property: Pick<Property, 'address_line'>;
  onPress: () => void;
  actionLabel: string;
}

export function VisitCard({ visit, property, onPress, actionLabel }: VisitCardProps) {
  const { t, i18n } = useTranslation();
  const dayKey = relativeDayKey(visit.scheduled_at);
  const when = dayKey
    ? `${t(`common.${dayKey}`)} · ${formatTime(visit.scheduled_at)}`
    : formatVisitDateTime(visit.scheduled_at, i18n.language);

  return (
    <Card onPress={onPress} accessibilityLabel={`${shortAddress(property.address_line)}, ${when}`}>
      <Text variant="bodyStrong">{shortAddress(property.address_line)}</Text>
      <Text variant="small" color="textSecondary">
        {when}
      </Text>

      <View style={styles.badges}>
        <StatusBadge
          label={t(`visit.timeline.${statusLabelKey(visit.status)}`, {
            defaultValue: t(`visits.${statusLabelKey(visit.status)}`, {
              defaultValue: statusLabelKey(visit.status),
            }),
          })}
          tone={statusTone(visit.status)}
          symbol={statusTone(visit.status) === 'positive' ? '✓' : undefined}
        />
      </View>

      <Text variant="small" color="primary">
        {actionLabel} →
      </Text>
    </Card>
  );
}

/**
 * Raw statuses map onto the same customer-facing vocabulary used by the
 * timeline, so a card and a detail screen never disagree about wording.
 */
function statusLabelKey(status: Visit['status']): string {
  switch (status) {
    case 'request_received':
    case 'access_pending':
      return 'booking_received';
    case 'access_confirmed':
    case 'verifier_pending':
      return 'access_confirmed';
    case 'verifier_assigned':
      return 'verifier_assigned';
    case 'verifier_en_route':
    case 'verifier_arrived':
      return 'verifier_on_the_way';
    case 'live':
      return 'viewing_started';
    case 'visit_completed':
    case 'report_pending':
      return 'viewing_started';
    case 'report_ready':
      return 'report_ready';
    default:
      return status;
  }
}

const styles = StyleSheet.create({
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
});
