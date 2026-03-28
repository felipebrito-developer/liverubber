/**
 * Web no-op for react-native-vector-icons.
 * react-native-paper uses this internally — it's native-only.
 * On web, icons render as empty text which is acceptable for preview.
 */
import React from 'react';
import { Text } from 'react-native';

function Icon({ name = '?', size = 16, color = '#fff', ...rest }: Record<string, unknown>) {
  return <Text style={{ fontSize: size, color: color as string }} {...(rest as object)}>{''}</Text>;
}

Icon.Button = Icon;
Icon.getImageSource = () => Promise.resolve({ uri: '' });
Icon.getImageSourceSync = () => ({ uri: '' });
Icon.loadFont = () => Promise.resolve();
Icon.hasIcon = () => false;

export default Icon;
export const createIconSet = () => Icon;
export const createIconSetFromFontello = () => Icon;
export const createIconSetFromIcoMoon = () => Icon;
