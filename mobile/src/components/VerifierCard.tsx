import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Avatar, Card, SectionHeader, Text } from '@/components/ui';
import { spacing } from '@/constants/theme';
import type { VerifierPublicCard } from '@/types';
import { verifierDisplayName } from '@/utils/format';

/**
 * The verifier as the customer sees them (spec §16): first name, last initial,
 * photo, identity flag, languages, visit count. Nothing else — no surname, no
 * phone, no email.
 */
export function VerifierCard({ verifier }: { verifier: VerifierPublicCard }) {
  const { t } = useTranslation();
  const name = verifierDisplayName(verifier.first_name, verifier.last_initial);

  return (
    <Card>
      <SectionHeader eyebrow={t('visit.verifier_section')} />
      <View style={styles.row}>
        <Avatar uri={verifier.avatar_url} fallback={verifier.first_name[0] ?? '?'} size={64} />
        <View style={styles.details}>
          <Text variant="heading">{name}</Text>
          {verifier.identity_verified ? (
            <Text variant="small" color="positive">
              ✓ {t('visit.identity_verified')}
            </Text>
          ) : null}
          <Text variant="small" color="textSecondary">
            {t('visit.completed_visits', { count: verifier.completed_visits })}
            {verifier.average_rating ? ` · ${verifier.average_rating.toFixed(1)} ★` : ''}
          </Text>
        </View>
      </View>

      {verifier.bio ? (
        <Text variant="small" color="textSecondary">
          {verifier.bio}
        </Text>
      ) : null}

      {verifier.languages.length > 0 ? (
        <View>
          <Text variant="label" color="textMuted">
            {t('visit.languages').toUpperCase()}
          </Text>
          <Text variant="small">{verifier.languages.join(' · ')}</Text>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.lg, alignItems: 'center' },
  details: { flex: 1, gap: 2 },
});
