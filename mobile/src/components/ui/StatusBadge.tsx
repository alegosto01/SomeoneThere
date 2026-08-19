import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';

import { Text } from './Text';

export type BadgeTone = 'positive' | 'attention' | 'negative' | 'neutral';

const TONE_STYLES: Record<BadgeTone, { bg: keyof typeof colors; fg: keyof typeof colors }> = {
  positive: { bg: 'positiveSoft', fg: 'positive' },
  attention: { bg: 'attentionSoft', fg: 'attention' },
  negative: { bg: 'negativeSoft', fg: 'negative' },
  neutral: { bg: 'neutralSoft', fg: 'neutral' },
};

/**
 * Status never relies on colour alone (spec §50) — the label always carries the
 * meaning, and `symbol` adds a non-colour cue.
 */
export function StatusBadge({
  label,
  tone = 'neutral',
  symbol,
}: {
  label: string;
  tone?: BadgeTone;
  symbol?: string;
}) {
  const { bg, fg } = TONE_STYLES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: colors[bg] }]}>
      <Text variant="small" color={fg} accessibilityLabel={label}>
        {symbol ? `${symbol} ${label}` : label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
});
