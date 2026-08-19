import { Text as RNText, type TextProps as RNTextProps, StyleSheet } from 'react-native';

import { colors, typography } from '@/constants/theme';

type Variant = keyof typeof typography;

export interface TextProps extends RNTextProps {
  variant?: Variant;
  color?: keyof typeof colors;
  center?: boolean;
}

/**
 * All copy goes through here so text scales with the OS font setting and
 * inherits one type ramp (spec §50).
 */
export function Text({
  variant = 'body',
  color = 'text',
  center,
  style,
  ...props
}: TextProps) {
  return (
    <RNText
      maxFontSizeMultiplier={1.6}
      style={[
        typography[variant],
        { color: colors[color] },
        center && styles.center,
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({ center: { textAlign: 'center' } });
