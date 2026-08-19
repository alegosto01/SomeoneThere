import { Image, StyleSheet, View } from 'react-native';

import { colors, radius } from '@/constants/theme';

import { Text } from './Text';

export function Avatar({
  uri,
  fallback,
  size = 56,
  accessibilityLabel,
}: {
  uri?: string | null;
  fallback: string;
  size?: number;
  accessibilityLabel?: string;
}) {
  const style = { width: size, height: size, borderRadius: radius.pill };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, style]}
        accessibilityLabel={accessibilityLabel}
        accessible
      />
    );
  }

  return (
    <View style={[styles.fallback, style]} accessibilityLabel={accessibilityLabel}>
      <Text variant="bodyStrong" color="primary">
        {fallback}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: colors.surfaceMuted },
  fallback: {
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
