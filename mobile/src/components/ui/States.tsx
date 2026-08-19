import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';

import { Button } from './Button';
import { Text } from './Text';

/**
 * Loading / empty / error are first-class states everywhere (spec §46).
 * A screen must never render blank.
 */

export function LoadingSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <View style={styles.skeleton} accessibilityRole="progressbar" accessibilityLabel="Loading">
      {Array.from({ length: lines }).map((_, index) => (
        <View
          key={index}
          style={[styles.skeletonLine, index === lines - 1 && styles.skeletonLineShort]}
        />
      ))}
    </View>
  );
}

export function LoadingState({ label }: { label?: string }) {
  return (
    <View style={styles.centered} accessibilityLiveRegion="polite">
      <ActivityIndicator color={colors.primary} />
      {label ? (
        <Text variant="small" color="textSecondary" center>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

export function EmptyState({
  title,
  body,
  actionLabel,
  onAction,
}: {
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.centered}>
      <Text variant="heading" center>
        {title}
      </Text>
      {body ? (
        <Text variant="body" color="textSecondary" center>
          {body}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} style={styles.action} />
      ) : null}
    </View>
  );
}

export function ErrorState({
  title,
  body,
  retryLabel,
  onRetry,
}: {
  title: string;
  body?: string;
  retryLabel: string;
  onRetry: () => void;
}) {
  return (
    <View style={styles.centered} accessibilityLiveRegion="polite">
      <Text variant="heading" center>
        {title}
      </Text>
      {body ? (
        <Text variant="body" color="textSecondary" center>
          {body}
        </Text>
      ) : null}
      <Button label={retryLabel} onPress={onRetry} style={styles.action} />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  action: { alignSelf: 'stretch', marginTop: spacing.sm },
  skeleton: { gap: spacing.md, padding: spacing.lg },
  skeletonLine: {
    height: 16,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
  },
  skeletonLineShort: { width: '60%' },
});
