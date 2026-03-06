import { requireNativeView } from 'expo';
import { type ImageSourcePropType } from 'react-native';

import { ExpoModifier, ViewEvent } from '../../types';
import { Icon } from '../Icon';
import { createViewModifierEventListener } from '../modifiers/utils';

// region Types

export type FABMenuVariant = 'surface' | 'primary' | 'secondary' | 'tertiary';

export type FABMenuProps = {
  /**
   * The icon displayed on the main floating action button.
   * Pass a `require()` reference to a local XML vector drawable or any other `ImageSourcePropType`.
   * Internally this is rendered using the `Icon` component — no separate icon-loading
   * pipeline is needed.
   *
   * @example
   * ```tsx
   * <FABMenu icon={require('./assets/add.xml')} />
   * ```
   */
  icon: ImageSourcePropType;

  /**
   * Whether the speed-dial menu is open. When provided the component becomes **controlled**
   * and the caller is responsible for updating this value inside `onOpenChange`.
   * Omit the prop to let the component manage its own open state (uncontrolled).
   */
  open?: boolean;

  /**
   * Called whenever the user taps the main FAB to toggle the menu.
   * Receives the *next* open value.
   *
   * @example
   * ```tsx
   * const [open, setOpen] = React.useState(false);
   * <FABMenu open={open} onOpenChange={setOpen} ... />
   * ```
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Controls the container / content colour scheme of all FABs (main + items).
   * Follows the Material 3 colour roles.
   *
   * | Value       | Container colour token              |
   * |-------------|-------------------------------------|
   * | `primary`   | `primaryContainer` *(default)*      |
   * | `secondary` | `secondaryContainer`                |
   * | `tertiary`  | `tertiaryContainer`                 |
   * | `surface`   | `surfaceVariant`                    |
   *
   * @default 'primary'
   */
  variant?: FABMenuVariant;

  /**
   * Modifiers for the component.
   */
  modifiers?: ExpoModifier[];

  /**
   * `FABMenu.Item` elements that define the secondary actions shown when the menu is open.
   */
  children: React.ReactNode;
};

export type FABMenuItemProps = {
  /**
   * The icon displayed on the small secondary FAB.
   * Internally rendered with the `Icon` component — the same pipeline as `FloatingActionButton`.
   */
  icon: ImageSourcePropType;

  /**
   * An optional text label shown to the left of the small FAB.
   */
  label?: string;

  /**
   * Called when the user taps this item.
   */
  onPress?: () => void;
};

// endregion

// region Internal native prop shapes

type NativeFABMenuProps = {
  open?: boolean;
  variant?: FABMenuVariant;
  modifiers?: ExpoModifier[];
  children: React.ReactNode;
} & ViewEvent<'onOpenChange', { isOpen: boolean }>;

type NativeFABMenuItemProps = {
  label?: string;
  children: React.ReactNode;
} & ViewEvent<'onPress', void>;

type NativeSlotViewProps = {
  slotName: string;
  children: React.ReactNode;
};

// endregion

// region Native view references

const FABMenuNativeView: React.ComponentType<NativeFABMenuProps> = requireNativeView(
  'ExpoUI',
  'FABMenuView'
);

const FABMenuItemNativeView: React.ComponentType<NativeFABMenuItemProps> = requireNativeView(
  'ExpoUI',
  'FABMenuItemView'
);

/**
 * Internal slot marker — wraps the main FAB icon so that `FABMenuContent.kt` can locate it
 * via `findChildSlotView(view, "mainIcon")` / `isSlotWithName(it, "mainIcon")`.
 */
const SlotNativeView: React.ComponentType<NativeSlotViewProps> = requireNativeView(
  'ExpoUI',
  'SlotView'
);

// endregion

// region Components

/**
 * A secondary floating action that appears inside a `FABMenu` when it is open.
 *
 * Must be used as a direct child of `FABMenu`. The icon is rendered by the `Icon` component
 * (same pipeline as `FloatingActionButton`), so no extra native icon-loading is needed.
 *
 * @example
 * ```tsx
 * <FABMenu.Item
 *   icon={require('./assets/camera.xml')}
 *   label="Photo"
 *   onPress={() => openCamera()}
 * />
 * ```
 */
function FABMenuItem({ icon, label, onPress }: FABMenuItemProps) {
  return (
    <FABMenuItemNativeView label={label} onPress={onPress}>
      <Icon source={icon} />
    </FABMenuItemNativeView>
  );
}

/**
 * A **speed-dial** (FAB menu) that expands a floating action button into a vertical list of
 * secondary actions.
 *
 * Tapping the main FAB toggles the menu open or closed with an animated slide-in effect.
 * Each secondary action is defined with `FABMenu.Item`.
 *
 * The icon for both the main FAB and each item is loaded via the `Icon` component — the same
 * pipeline as `FloatingActionButton` — so no custom icon-loading code is needed.
 *
 * ### Controlled vs. uncontrolled
 *
 * - **Uncontrolled** – omit `open`; the component manages its own state.
 * - **Controlled** – pass `open` and keep it in sync inside `onOpenChange`.
 *
 * ### When to use FABMenu vs. HorizontalFloatingToolbar
 *
 * Use **FABMenu** when you have a single primary action that expands into several secondary
 * actions, and screen real-estate is at a premium. The items are hidden by default and only
 * revealed on demand, reducing visual clutter.
 *
 * Use **HorizontalFloatingToolbar** when you want to show several related actions
 * *simultaneously* in a horizontal bar that is always visible (or that hides/shows based on
 * scroll behaviour). That component is better suited for small, flat action sets (e.g., text
 * formatting controls) where discoverability matters more than compactness.
 *
 * @example
 * Uncontrolled:
 * ```tsx
 * import { FABMenu } from '@expo/ui/jetpack-compose';
 *
 * <FABMenu icon={require('./assets/add.xml')}>
 *   <FABMenu.Item icon={require('./assets/camera.xml')} label="Photo" onPress={openCamera} />
 *   <FABMenu.Item icon={require('./assets/edit.xml')} label="Write" onPress={openEditor} />
 * </FABMenu>
 * ```
 *
 * @example
 * Controlled:
 * ```tsx
 * const [open, setOpen] = React.useState(false);
 *
 * <FABMenu
 *   icon={require('./assets/add.xml')}
 *   open={open}
 *   onOpenChange={setOpen}
 *   variant="secondary"
 * >
 *   <FABMenu.Item icon={require('./assets/camera.xml')} label="Photo" onPress={openCamera} />
 * </FABMenu>
 * ```
 */
function FABMenu({ icon, open, onOpenChange, variant, modifiers, children }: FABMenuProps) {
  return (
    <FABMenuNativeView
      open={open}
      variant={variant}
      modifiers={modifiers}
      onOpenChange={onOpenChange}
      {...(modifiers ? createViewModifierEventListener(modifiers) : undefined)}>
      {/* The main FAB icon is placed in a named slot so FABMenuContent.kt can find it
          via isSlotWithName(it, "mainIcon") and render it inside FloatingActionButton. */}
      <SlotNativeView slotName="mainIcon">
        <Icon source={icon} />
      </SlotNativeView>
      {children}
    </FABMenuNativeView>
  );
}

FABMenu.Item = FABMenuItem;

// endregion

export { FABMenu };
