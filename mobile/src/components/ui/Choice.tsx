import { Pressable, StyleSheet, View } from 'react-native';

import { colors, MIN_TOUCH_TARGET, radius, spacing } from '@/constants/theme';

import { Text } from './Text';

/**
 * Checkbox and radio share one row shape. The selected state is carried by a
 * glyph and a border, not only by colour (spec §50).
 */
function ChoiceRow({
  label,
  description,
  selected,
  onPress,
  role,
  glyph,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  role: 'checkbox' | 'radio';
  glyph: string;
}) {
  return (
    <Pressable
      accessibilityRole={role}
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      accessibilityHint={description}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        selected && styles.rowSelected,
        pressed && styles.rowPressed,
      ]}
    >
      <View style={[styles.indicator, selected && styles.indicatorSelected]}>
        <Text variant="small" color={selected ? 'textInverse' : 'textMuted'}>
          {selected ? glyph : ''}
        </Text>
      </View>
      <View style={styles.labels}>
        <Text variant={selected ? 'bodyStrong' : 'body'}>{label}</Text>
        {description ? (
          <Text variant="small" color="textSecondary">
            {description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

export function Checkbox(props: {
  label: string;
  description?: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <ChoiceRow
      label={props.label}
      description={props.description}
      selected={props.checked}
      onPress={props.onToggle}
      role="checkbox"
      glyph="✓"
    />
  );
}

export interface RadioOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

export function RadioGroup<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: RadioOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  label?: string;
}) {
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={styles.group}>
      {options.map((option) => (
        <ChoiceRow
          key={option.value}
          label={option.label}
          description={option.description}
          selected={value === option.value}
          onPress={() => onChange(option.value)}
          role="radio"
          glyph="●"
        />
      ))}
    </View>
  );
}

export function CheckboxGroup<T extends string>({
  options,
  values,
  onToggle,
  label,
}: {
  options: RadioOption<T>[];
  values: T[];
  onToggle: (value: T) => void;
  label?: string;
}) {
  return (
    <View accessibilityLabel={label} style={styles.group}>
      {options.map((option) => (
        <Checkbox
          key={option.value}
          label={option.label}
          description={option.description}
          checked={values.includes(option.value)}
          onToggle={() => onToggle(option.value)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: MIN_TOUCH_TARGET,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowSelected: { borderColor: colors.primary, borderWidth: 2, backgroundColor: colors.primarySoft },
  rowPressed: { backgroundColor: colors.surfaceMuted },
  indicator: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  labels: { flex: 1, gap: 2 },
});
