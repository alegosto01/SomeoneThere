import { StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/theme';

import { Text } from './Text';

export function SectionHeader({
  title,
  subtitle,
  eyebrow,
}: {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  return (
    <View style={styles.container} accessibilityRole="header">
      {eyebrow ? (
        <Text variant="label" color="textMuted">
          {eyebrow.toUpperCase()}
        </Text>
      ) : null}
      {title ? <Text variant="heading">{title}</Text> : null}
      {subtitle ? (
        <Text variant="small" color="textSecondary">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs, marginBottom: spacing.sm },
});
