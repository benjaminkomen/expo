import { requireNativeView } from 'expo';
import { Ref } from 'react';
import { type ColorValue } from 'react-native';

import { ExpoModifier, ViewEvent } from '../../types';
import { createViewModifierEventListener } from '../modifiers/utils';

export type TextInputRef = {
  setText: (newText: string) => Promise<void>;
};

/**
 * Full color customization for `TextInput` and `TextInput.Outlined`,
 * mirroring Material 3's `TextFieldColors`.
 * All fields are optional; omitted fields fall back to the Material theme default.
 * @platform android
 */
export type TextInputColors = {
  focusedTextColor?: ColorValue;
  unfocusedTextColor?: ColorValue;
  disabledTextColor?: ColorValue;
  errorTextColor?: ColorValue;
  focusedContainerColor?: ColorValue;
  unfocusedContainerColor?: ColorValue;
  disabledContainerColor?: ColorValue;
  errorContainerColor?: ColorValue;
  cursorColor?: ColorValue;
  errorCursorColor?: ColorValue;
  /** Indicator line color for `TextInput`; border color for `TextInput.Outlined`. */
  focusedIndicatorColor?: ColorValue;
  /** Indicator line color for `TextInput`; border color for `TextInput.Outlined`. */
  unfocusedIndicatorColor?: ColorValue;
  /** Indicator line color for `TextInput`; border color for `TextInput.Outlined`. */
  disabledIndicatorColor?: ColorValue;
  /** Indicator line color for `TextInput`; border color for `TextInput.Outlined`. */
  errorIndicatorColor?: ColorValue;
  focusedLeadingIconColor?: ColorValue;
  unfocusedLeadingIconColor?: ColorValue;
  disabledLeadingIconColor?: ColorValue;
  errorLeadingIconColor?: ColorValue;
  focusedTrailingIconColor?: ColorValue;
  unfocusedTrailingIconColor?: ColorValue;
  disabledTrailingIconColor?: ColorValue;
  errorTrailingIconColor?: ColorValue;
  focusedLabelColor?: ColorValue;
  unfocusedLabelColor?: ColorValue;
  disabledLabelColor?: ColorValue;
  errorLabelColor?: ColorValue;
  focusedPlaceholderColor?: ColorValue;
  unfocusedPlaceholderColor?: ColorValue;
  disabledPlaceholderColor?: ColorValue;
  errorPlaceholderColor?: ColorValue;
  focusedSupportingTextColor?: ColorValue;
  unfocusedSupportingTextColor?: ColorValue;
  disabledSupportingTextColor?: ColorValue;
  errorSupportingTextColor?: ColorValue;
  focusedPrefixColor?: ColorValue;
  unfocusedPrefixColor?: ColorValue;
  disabledPrefixColor?: ColorValue;
  errorPrefixColor?: ColorValue;
  focusedSuffixColor?: ColorValue;
  unfocusedSuffixColor?: ColorValue;
  disabledSuffixColor?: ColorValue;
  errorSuffixColor?: ColorValue;
};

export type TextInputProps = {
  /**
   * Can be used for imperatively setting text on the TextInput component.
   */
  ref?: Ref<TextInputRef>;
  /**
   * Initial value that the TextInput displays when being mounted.
   * As the TextInput is an uncontrolled component, change the `key` prop to reset the text value.
   */
  defaultValue?: string;
  /**
   * A callback triggered when the user types into the TextInput.
   */
  onChangeText: (value: string) => void;
  /**
   * If true, the text input can be multiple lines.
   * While the content will wrap, there's no keyboard button to insert a new line.
   */
  multiline?: boolean;
  /**
   * The number of lines to display when `multiline` is set to true.
   * If the number of lines in the view is above this number, the view scrolls.
   * @default undefined, which means unlimited lines.
   */
  numberOfLines?: number;
  /**
   * Determines which keyboard to open.
   * @default 'default'
   */
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'ascii-capable'
    | 'url'
    | 'decimal-pad';
  /**
   * If true, the text is visually masked with bullet characters (•••).
   * Use this for password fields. Toggle it to implement show/hide password.
   * Note: this is separate from `keyboardType` — set `keyboardType="numeric"` together
   * with `secureTextEntry` for a masked numeric PIN field.
   * @default false
   */
  secureTextEntry?: boolean;
  /**
   * If true, autocorrection is enabled.
   * @default true
   */
  autocorrection?: boolean;
  /**
   * Options to request the software keyboard to capitalize text.
   * @default 'none'
   * @platform android
   */
  autoCapitalize?: 'characters' | 'none' | 'sentences' | 'unspecified' | 'words';
  /**
   * Puts the field into an error state, applying error colors to the indicator, label, and
   * supporting text. Use `TextInput.SupportingText` to show the error message.
   * @default false
   */
  isError?: boolean;
  /**
   * Whether the text field is enabled. A disabled field is not interactive and is rendered
   * with reduced opacity.
   * @default true
   */
  enabled?: boolean;
  /**
   * Whether the text field is read-only. The text is not editable but remains selectable.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Full color customization mirroring Material 3's `TextFieldColors`.
   */
  colors?: TextInputColors;
  /**
   * Modifiers for the component.
   */
  modifiers?: ExpoModifier[];
  /**
   * Slot children: `TextInput.Label`, `TextInput.Placeholder`, `TextInput.LeadingIcon`,
   * `TextInput.TrailingIcon`, `TextInput.Prefix`, `TextInput.Suffix`,
   * `TextInput.SupportingText`.
   */
  children?: React.ReactNode;
};

export type NativeTextInputProps = Omit<TextInputProps, 'onChangeText'> &
  ViewEvent<'onValueChanged', { value: string }>;

type NativeSlotViewProps = {
  slotName: string;
  children: React.ReactNode;
};

type TextInputSlotProps = {
  children: React.ReactNode;
};

const TextInputNativeView: React.ComponentType<NativeTextInputProps> = requireNativeView(
  'ExpoUI',
  'TextInputView'
);

const OutlinedTextInputNativeView: React.ComponentType<NativeTextInputProps> = requireNativeView(
  'ExpoUI',
  'OutlinedTextInputView'
);

const SlotNativeView: React.ComponentType<NativeSlotViewProps> = requireNativeView(
  'ExpoUI',
  'SlotView'
);

function transformTextInputProps(props: TextInputProps): NativeTextInputProps {
  const { modifiers, ...restProps } = props;
  return {
    modifiers,
    ...(modifiers ? createViewModifierEventListener(modifiers) : undefined),
    ...restProps,
    onValueChanged: (event) => {
      props.onChangeText?.(event.nativeEvent.value);
    },
  };
}

// ---- Shared slot sub-components ----
// Both TextInput and TextInput.Outlined read from the same slotName strings,
// so they can share the same slot component implementations.

/**
 * Floating label slot for `TextInput` / `TextInput.Outlined`.
 * The label animates above the field when the field is focused or has content.
 */
export function TextInputLabel(props: TextInputSlotProps) {
  return <SlotNativeView slotName="label">{props.children}</SlotNativeView>;
}

/**
 * Placeholder slot for `TextInput` / `TextInput.Outlined`.
 * Displayed when the field is empty.
 */
export function TextInputPlaceholder(props: TextInputSlotProps) {
  return <SlotNativeView slotName="placeholder">{props.children}</SlotNativeView>;
}

/**
 * Leading icon slot for `TextInput` / `TextInput.Outlined`.
 * Rendered to the left of the input area.
 */
export function TextInputLeadingIcon(props: TextInputSlotProps) {
  return <SlotNativeView slotName="leadingIcon">{props.children}</SlotNativeView>;
}

/**
 * Trailing icon slot for `TextInput` / `TextInput.Outlined`.
 * Rendered to the right of the input area.
 */
export function TextInputTrailingIcon(props: TextInputSlotProps) {
  return <SlotNativeView slotName="trailingIcon">{props.children}</SlotNativeView>;
}

/**
 * Prefix slot for `TextInput` / `TextInput.Outlined`.
 * Rendered inside the text area, before the typed text.
 */
export function TextInputPrefix(props: TextInputSlotProps) {
  return <SlotNativeView slotName="prefix">{props.children}</SlotNativeView>;
}

/**
 * Suffix slot for `TextInput` / `TextInput.Outlined`.
 * Rendered inside the text area, after the typed text.
 */
export function TextInputSuffix(props: TextInputSlotProps) {
  return <SlotNativeView slotName="suffix">{props.children}</SlotNativeView>;
}

/**
 * Supporting text slot for `TextInput` / `TextInput.Outlined`.
 * Rendered below the field. When `isError` is true, this text is rendered in the error color.
 */
export function TextInputSupportingText(props: TextInputSlotProps) {
  return <SlotNativeView slotName="supportingText">{props.children}</SlotNativeView>;
}

// ---- TextInput (filled) ----

/**
 * Renders a filled `TextInput` component following Material 3 design.
 *
 * Filled text fields have more visual emphasis than outlined ones. Prefer them
 * in dialogs and short forms where that emphasis is appropriate.
 * For long forms with many fields, use `TextInput.Outlined` to reduce visual noise.
 *
 * Use sub-components to fill the named slots:
 * - `TextInput.Label` — floating label
 * - `TextInput.Placeholder` — hint text shown when empty (use alongside a label, not instead of one)
 * - `TextInput.LeadingIcon` — decorative icon identifying the field type
 * - `TextInput.TrailingIcon` — icon or action at the end of the field; wrap interactive content in `IconButton`
 * - `TextInput.Prefix` — static content inside the field, before the typed text
 * - `TextInput.Suffix` — static content inside the field, after the typed text
 * - `TextInput.SupportingText` — helper text or error message below the field
 *
 * @platform android
 */
function TextInputComponent(props: TextInputProps) {
  return <TextInputNativeView {...transformTextInputProps(props)} />;
}

TextInputComponent.Label = TextInputLabel;
TextInputComponent.Placeholder = TextInputPlaceholder;
TextInputComponent.LeadingIcon = TextInputLeadingIcon;
TextInputComponent.TrailingIcon = TextInputTrailingIcon;
TextInputComponent.Prefix = TextInputPrefix;
TextInputComponent.Suffix = TextInputSuffix;
TextInputComponent.SupportingText = TextInputSupportingText;

// ---- TextInput.Outlined ----

/**
 * Renders an outlined `TextInput` component following Material 3 design.
 *
 * Outlined text fields have less visual emphasis than filled ones. Prefer them
 * in long forms where the reduced emphasis simplifies a dense layout.
 * For dialogs and short forms, use `TextInput` (filled) instead.
 *
 * Accepts the same slot sub-components as `TextInput`:
 * `TextInput.Label`, `TextInput.Placeholder`, `TextInput.LeadingIcon`,
 * `TextInput.TrailingIcon`, `TextInput.Prefix`, `TextInput.Suffix`,
 * `TextInput.SupportingText`.
 *
 * @platform android
 */
function OutlinedTextInputComponent(props: TextInputProps) {
  return <OutlinedTextInputNativeView {...transformTextInputProps(props)} />;
}

OutlinedTextInputComponent.Label = TextInputLabel;
OutlinedTextInputComponent.Placeholder = TextInputPlaceholder;
OutlinedTextInputComponent.LeadingIcon = TextInputLeadingIcon;
OutlinedTextInputComponent.TrailingIcon = TextInputTrailingIcon;
OutlinedTextInputComponent.Prefix = TextInputPrefix;
OutlinedTextInputComponent.Suffix = TextInputSuffix;
OutlinedTextInputComponent.SupportingText = TextInputSupportingText;

TextInputComponent.Outlined = OutlinedTextInputComponent;

export { TextInputComponent as TextInput };
