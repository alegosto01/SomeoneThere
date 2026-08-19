import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';

import { Text } from './Text';

export interface TimelineItem {
  key: string;
  label: string;
  state: 'done' | 'current' | 'pending';
}

/**
 * Visit progress (spec §15). Reached steps are marked with a check glyph and
 * full-contrast text; unreached steps use an open circle and muted text, so the
 * distinction survives without colour.
 */
export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <View accessibilityRole="list" style={styles.container}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const reached = item.state !== 'pending';
        return (
          <View key={item.key} style={styles.row} accessibilityRole="text">
            <View style={styles.rail}>
              <View
                style={[
                  styles.marker,
                  reached ? styles.markerDone : styles.markerPending,
                  item.state === 'current' && styles.markerCurrent,
                ]}
              >
                <Text variant="small" color={reached ? 'textInverse' : 'textMuted'}>
                  {item.state === 'done' ? '✓' : item.state === 'current' ? '•' : '○'}
                </Text>
              </View>
              {!isLast ? (
                <View style={[styles.line, reached && styles.lineDone]} />
              ) : null}
            </View>
            <Text
              variant={item.state === 'current' ? 'bodyStrong' : 'body'}
              color={reached ? 'text' : 'textMuted'}
              style={styles.label}
            >
              {item.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 0 },
  row: { flexDirection: 'row', gap: spacing.md },
  rail: { alignItems: 'center', width: 24 },
  marker: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerDone: { backgroundColor: colors.primary },
  markerCurrent: { backgroundColor: colors.positive },
  markerPending: { backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border },
  line: { flex: 1, width: 2, minHeight: 20, backgroundColor: colors.border },
  lineDone: { backgroundColor: colors.primarySoft },
  label: { flex: 1, paddingBottom: spacing.lg },
});
