import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, MIN_TOUCH_TARGET, radius, spacing, typography } from '@/constants/theme';

import { Text } from './Text';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  /** Explains *why* the button is disabled — shown under it, not as a tooltip. */
  disabledHint?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Button({
  label,
  onPress,
  disabled,
  loading,
  disabledHint,
  accessibilityHint,
  style,
  testID,
}: ButtonProps) {
  const inactive = disabled || loading;
  return (
    <View style={style}>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: !!inactive, busy: !!loading }}
        disabled={inactive}
        onPress={onPress}
        style={({ pressed }) => [
          styles.base,
          styles.primary,
          pressed && styles.primaryPressed,
          inactive && styles.disabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors.textInverse} />
        ) : (
          <Text variant="bodyStrong" color="textInverse">
            {label}
          </Text>
        )}
      </Pressable>
      {disabled && disabledHint ? (
        <Text variant="small" color="textMuted" center style={styles.hint}>
          {disabledHint}
        </Text>
      ) : null}
    </View>
  );
}

export function SecondaryButton({ label, onPress, disabled, loading, style, testID }: ButtonProps) {
  const inactive = disabled || loading;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles.secondary,
        pressed && styles.secondaryPressed,
        inactive && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <Text variant="bodyStrong" color="primary">
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export function TextButton({ label, onPress, disabled, style, testID }: ButtonProps) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.textButton, pressed && styles.textButtonPressed, style]}
    >
      <Text variant="bodyStrong" color={disabled ? 'textMuted' : 'primary'}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_TOUCH_TARGET,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  primary: { backgroundColor: colors.primary },
  primaryPressed: { backgroundColor: colors.primaryPressed },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  secondaryPressed: { backgroundColor: colors.surfaceMuted },
  disabled: { opacity: 0.45 },
  textButton: {
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  textButtonPressed: { opacity: 0.6 },
  hint: { marginTop: spacing.sm, ...typography.small },
});
