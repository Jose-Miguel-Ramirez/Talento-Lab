// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
export type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'hammer.fill': 'build',
  'person.fill': 'person',
  'arrow.right': 'arrow-forward',
  'doc.viewfinder': 'find-in-page',
  'xmark.circle.fill': 'cancel',
  'checkmark': 'check',
  'magnifyingglass': 'search',
  'desktopcomputer': 'computer',
  'car.fill': 'directions-car',
  'party.popper.fill': 'celebration',
  'heart.fill': 'favorite',
  'leaf.fill': 'eco',
  'calendar.badge.plus': 'event-available',
  'checkmark.shield.fill': 'verified-user',
  'bell.fill': 'notifications',
  'lock.fill': 'lock',
  'questionmark.circle.fill': 'help',
  'doc.text.fill': 'description',
  'mappin.and.ellipse': 'place',
  'info.circle': 'info',
  'envelope.fill': 'email',
  'star.fill': 'star',
  'arrow.up.right': 'trending-up',
  'bell.badge.fill': 'notifications-active',
  'chart.bar.fill': 'bar-chart',
  'list.clipboard': 'assignment',
  'rectangle.portrait.and.arrow.right': 'logout',
  'map.fill': 'map',
  'heart': 'favorite-border',
  'bubble.right': 'chat-bubble-outline',
  'plus': 'add',
  'list.bullet': 'list',
  'photo.fill': 'photo',
  'exclamationmark.triangle.fill': 'warning',
  'eye.slash.fill': 'visibility-off',
  'person.crop.circle.badge.checkmark': 'how-to-reg',
  'ellipsis': 'more-horiz',
  'pencil': 'edit',
  'trash.fill': 'delete',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
