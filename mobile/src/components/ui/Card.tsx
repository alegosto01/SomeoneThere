import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, shadow, spacing } from '@/constants/theme';

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  muted?: boolean;
  testID?: string;
}

export function Card({
  children,
  onPress,
  accessibilityLabel,
  style,
  muted,
  testID,
}: CardProps) {
  const content = [styles.card, muted && styles.muted, style];

  if (!onPress) {
    return (
      <View testID={testID} style={content}>
        {children}
      </View>
    );
  }

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [...content, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadow.card,
  },
  muted: { backgroundColor: colors.surfaceMuted, shadowOpacity: 0, elevation: 0 },
  pressed: { backgroundColor: colors.surfaceMuted },
});
