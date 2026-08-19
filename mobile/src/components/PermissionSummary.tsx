import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import type { Visit } from '@/types';
import { capturePermissions } from '@/utils/permissions';

type PermissionState = 'allowed' | 'pending' | 'denied';

const GLYPH: Record<PermissionState, string> = {
  allowed: '✓',
  pending: '○',
  denied: '✕',
};

const TONE: Record<PermissionState, keyof typeof colors> = {
  allowed: 'positive',
  pending: 'attention',
  denied: 'textMuted',
};

function PermissionLine({ label, state, note }: { label: string; state: PermissionState; note?: string }) {
  const { t } = useTranslation();
  return (
    <View style={styles.line}>
      <Text variant="body" color={TONE[state]} accessibilityLabel={`${label}: ${t(`common.${state === 'allowed' ? 'yes' : 'no'}`)}`}>
        {GLYPH[state]} {label}
      </Text>
      {note ? (
        <Text variant="small" color="textMuted">
          {note}
        </Text>
      ) : null}
    </View>
  );
}

/**
 * What the verifier is and is not allowed to capture on this visit (spec §32).
 * Rendered before check-in, and again above the checklist during the walkthrough,
 * so the rule is never more than one screen away while capturing.
 */
export function PermissionSummary({
  visit,
}: {
  visit: Pick<
    Visit,
    | 'access_confirmed'
    | 'photos_requested'
    | 'photos_allowed'
    | 'recording_requested'
    | 'recording_allowed'
    | 'live_call_url'
  >;
}) {
  const { t } = useTranslation();
  const permissions = capturePermissions(visit);

  return (
    <View style={styles.container}>
      <PermissionLine
        label={t('verifier.permission_attendance')}
        state={visit.access_confirmed ? 'allowed' : 'pending'}
      />
      <PermissionLine
        label={t('verifier.permission_live')}
        state={visit.live_call_url ? 'allowed' : 'pending'}
      />
      <PermissionLine
        label={t('verifier.permission_photos')}
        state={
          permissions.canTakePhotos
            ? 'allowed'
            : permissions.photosPendingPermission
              ? 'pending'
              : 'denied'
        }
        note={permissions.photosPendingPermission ? t('verifier.permission_photos_ask') : undefined}
      />
      <PermissionLine
        label={t('verifier.permission_recording')}
        state={permissions.canRecordVideo ? 'allowed' : 'denied'}
        note={!visit.recording_requested ? t('verifier.permission_recording_never') : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  line: { gap: 2 },
});
