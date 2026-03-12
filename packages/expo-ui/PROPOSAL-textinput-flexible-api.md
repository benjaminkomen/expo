# Proposal: Flexible `TextInput` API for Jetpack Compose

**Related:** [#43859](https://github.com/expo/expo/pull/43859) (Button / IconButton less-opinionated API)

---

## Background

The current `TextInput` component is a thin wrapper around Material 3's `TextField`. It exposes a small, fixed set of string props (`placeholder`, `defaultValue`, keyboard options) but hides all of the composable _slot_ parameters that `TextField` / `OutlinedTextField` provide.

As a result, common use-cases that are trivially supported in Compose today are impossible from React Native:

- Password field with a show/hide icon button in the trailing slot
- Search field with a magnifier icon in the leading slot
- Amount field with a currency prefix (`€`) or unit suffix (`kg`)
- Error state with red helper text below the field
- Floating label (the animated label that moves above the field on focus)
- Outlined style instead of the default filled style

This proposal mirrors exactly what PR #43859 did for `Button` / `IconButton`: replace opinionated string props with composable slot children, split variants into separate top-level components, and align prop names with the official Material 3 API.

---

## Material 3 reference API

Both [`TextField`](https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary#TextField(kotlin.String,kotlin.Function1,androidx.compose.ui.Modifier,kotlin.Boolean,kotlin.Boolean,androidx.compose.ui.text.TextStyle,kotlin.Function0,kotlin.Function0,kotlin.Function0,kotlin.Function0,kotlin.Function0,kotlin.Boolean,androidx.compose.ui.text.input.VisualTransformation,androidx.compose.foundation.text.KeyboardOptions,androidx.compose.foundation.text.KeyboardActions,kotlin.Boolean,kotlin.Int,kotlin.Int,androidx.compose.foundation.interaction.MutableInteractionSource,androidx.compose.ui.graphics.Shape,androidx.compose.material3.TextFieldColors))
and [`OutlinedTextField`](https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary#OutlinedTextField(kotlin.String,kotlin.Function1,androidx.compose.ui.Modifier,kotlin.Boolean,kotlin.Boolean,androidx.compose.ui.text.TextStyle,kotlin.Function0,kotlin.Function0,kotlin.Function0,kotlin.Function0,kotlin.Function0,kotlin.Boolean,androidx.compose.ui.text.input.VisualTransformation,androidx.compose.foundation.text.KeyboardOptions,androidx.compose.foundation.text.KeyboardActions,kotlin.Boolean,kotlin.Int,kotlin.Int,androidx.compose.foundation.interaction.MutableInteractionSource,androidx.compose.ui.graphics.Shape,androidx.compose.material3.TextFieldColors))
share the same slot parameters:

| Slot / param | Type | Purpose |
|---|---|---|
| `label` | `@Composable (() -> Unit)?` | Floating label (animates above field on focus) |
| `placeholder` | `@Composable (() -> Unit)?` | Hint text shown when field is empty |
| `leadingIcon` | `@Composable (() -> Unit)?` | Icon / content at the start of the field |
| `trailingIcon` | `@Composable (() -> Unit)?` | Icon / content at the end of the field |
| `prefix` | `@Composable (() -> Unit)?` | Static text/content _inside_ the field, before the typed text |
| `suffix` | `@Composable (() -> Unit)?` | Static text/content _inside_ the field, after the typed text |
| `supportingText` | `@Composable (() -> Unit)?` | Helper / error text below the field |
| `isError` | `Boolean` | Puts the field into error state (red tint) |
| `enabled` | `Boolean` | Enables / disables the field |
| `readOnly` | `Boolean` | Text is not editable, but still selectable |
| `colors` | `TextFieldColors` | Full color customization |

The two variants (`TextField` = filled, `OutlinedTextField` = outlined) have an identical slot-based API and differ only in visual appearance.

---

## Proposed Changes

### 1. Two top-level components instead of a `variant` prop

Following the same approach as PR #43859 (which split `Button` into `Button`, `FilledTonalButton`, `OutlinedButton`, …):

```tsx
// Filled style (current default, unchanged import path)
import { TextInput } from '@expo/ui/jetpack-compose';

// Outlined style (new)
import { OutlinedTextInput } from '@expo/ui/jetpack-compose';
```

Both components accept identical props. A single `variant` prop is intentionally avoided — it hides the two genuinely different components behind a stringly-typed switch and makes tree-shaking harder.

---

### 2. New slot sub-components (SlotView pattern)

Using the same `SlotView` mechanism already used by `ListItem`:

| Sub-component | `slotName` | Material 3 slot |
|---|---|---|
| `TextInput.Label` | `"label"` | `label` |
| `TextInput.LeadingIcon` | `"leadingIcon"` | `leadingIcon` |
| `TextInput.TrailingIcon` | `"trailingIcon"` | `trailingIcon` |
| `TextInput.Prefix` | `"prefix"` | `prefix` |
| `TextInput.Suffix` | `"suffix"` | `suffix` |
| `TextInput.SupportingText` | `"supportingText"` | `supportingText` |

`TextInput.Placeholder` is kept as a slot _and_ as a string prop for convenience (backward-compatible).

---

### 3. New scalar props

| Prop | Type | Default | Material 3 equivalent |
|---|---|---|---|
| `label` | `string` | — | convenience shorthand for `TextInput.Label` |
| `isError` | `boolean` | `false` | `isError` |
| `enabled` | `boolean` | `true` | `enabled` |
| `readOnly` | `boolean` | `false` | `readOnly` |
| `colors` | `TextInputColors` | — | `TextFieldColors` |

`TextInputColors` (mirrors `TextFieldColors`):

```ts
type TextInputColors = {
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
  focusedIndicatorColor?: ColorValue;
  unfocusedIndicatorColor?: ColorValue;
  disabledIndicatorColor?: ColorValue;
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
```

---

### 4. Full TypeScript API

```tsx
// ---- Slot sub-component prop types ----

type TextInputSlotProps = {
  children: React.ReactNode;
};

// ---- Main props ----

export type TextInputProps = {
  ref?: Ref<TextInputRef>;

  // Value
  defaultValue?: string;
  onChangeText: (value: string) => void;

  // Convenience scalar slots (use sub-components for custom content)
  placeholder?: string;
  label?: string;

  // Behavior
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'
    | 'ascii-capable' | 'url' | 'decimal-pad';
  autocorrection?: boolean;
  autoCapitalize?: 'characters' | 'none' | 'sentences' | 'unspecified' | 'words';

  // State
  enabled?: boolean;       // replaces nothing; new prop
  readOnly?: boolean;      // new prop
  isError?: boolean;       // new prop

  // Appearance
  colors?: TextInputColors;  // new prop

  // Layout
  modifiers?: ExpoModifier[];

  // Slot children (TextInput.Label, TextInput.LeadingIcon, etc.)
  children?: React.ReactNode;
};
```

`OutlinedTextInputProps` is identical to `TextInputProps`.

---

### 5. Usage examples

#### Password field with show/hide toggle

```tsx
const [secure, setSecure] = useState(true);

<TextInput
  label="Password"
  keyboardType={secure ? 'password' : 'default'}
  onChangeText={setPassword}>
  <TextInput.LeadingIcon>
    <Icon name="lock" />
  </TextInput.LeadingIcon>
  <TextInput.TrailingIcon>
    <IconButton onClick={() => setSecure(v => !v)}>
      <Icon name={secure ? 'visibility-off' : 'visibility'} />
    </IconButton>
  </TextInput.TrailingIcon>
</TextInput>
```

#### Currency amount field

```tsx
<OutlinedTextInput label="Amount" keyboardType="decimal-pad" onChangeText={setAmount}>
  <OutlinedTextInput.Prefix>
    <Text>€</Text>
  </OutlinedTextInput.Prefix>
  <OutlinedTextInput.Suffix>
    <Text>EUR</Text>
  </OutlinedTextInput.Suffix>
</OutlinedTextInput>
```

#### Error state with helper text

```tsx
<OutlinedTextInput
  label="Email"
  keyboardType="email-address"
  isError={!isValid}
  onChangeText={setEmail}>
  <OutlinedTextInput.SupportingText>
    {isValid ? (
      <Text>We'll send a confirmation link here.</Text>
    ) : (
      <Text>Please enter a valid email address.</Text>
    )}
  </OutlinedTextInput.SupportingText>
</OutlinedTextInput>
```

#### Search field with leading icon

```tsx
<TextInput placeholder="Search…" onChangeText={setQuery}>
  <TextInput.LeadingIcon>
    <Icon name="search" />
  </TextInput.LeadingIcon>
</TextInput>
```

---

### 6. Kotlin implementation sketch

`TextInputView.kt` changes:

```kotlin
// New slot lookup (same as ListItemView.kt)
val labelSlotView        = findChildSlotView(view, "label")
val leadingIconSlotView  = findChildSlotView(view, "leadingIcon")
val trailingIconSlotView = findChildSlotView(view, "trailingIcon")
val prefixSlotView       = findChildSlotView(view, "prefix")
val suffixSlotView       = findChildSlotView(view, "suffix")
val supportingTextSlotView = findChildSlotView(view, "supportingText")

TextField(
  value = ...,
  onValueChange = ...,
  label = labelSlotView?.asComposable() ?: props.label.value.takeIf { it.isNotEmpty() }?.let { { Text(it) } },
  placeholder = { Text(props.placeholder.value) },
  leadingIcon  = leadingIconSlotView?.asComposable(),
  trailingIcon = trailingIconSlotView?.asComposable(),
  prefix       = prefixSlotView?.asComposable(),
  suffix       = suffixSlotView?.asComposable(),
  supportingText = supportingTextSlotView?.asComposable(),
  isError  = props.isError.value,
  enabled  = props.enabled.value,
  readOnly = props.readOnly.value,
  colors   = resolveColors(props.colors.value),
  ...
)
```

A helper extension makes slot rendering concise:

```kotlin
private fun SlotView.asComposable(): @Composable () -> Unit = {
  with(ComposableScope()) { with(this@asComposable) { Content() } }
}
```

`OutlinedTextInputView.kt` reuses the same `TextInputProps` data class but calls `OutlinedTextField(…)` instead.

---

### 7. `ExpoUIModule.kt` registration

```kotlin
View(TextInputView::class) {
  Events("onValueChanged", "onFocusChanged")
  Prop("defaultValue", "") { view, text: String -> if (view.text == null) view.text = text }
  Prop("label") { view: TextInputView, label: String -> view.props.label.value = label }
  Prop("isError") { view: TextInputView, v: Boolean -> view.props.isError.value = v }
  Prop("enabled") { view: TextInputView, v: Boolean -> view.props.enabled.value = v }
  Prop("readOnly") { view: TextInputView, v: Boolean -> view.props.readOnly.value = v }
  Prop("colors") { view: TextInputView, c: TextInputColorsRecord -> view.props.colors.value = c }
  AsyncFunction("setText") { view: TextInputView, text: String -> view.text = text }
}

View(OutlinedTextInputView::class) {
  // Identical registration — same props, same events
  ...
}
```

---

## Migration

| Before | After |
|---|---|
| `<TextInput placeholder="Search" />` | No change needed — `placeholder` string prop is kept |
| `<TextInput keyboardType="password" />` | No change needed |
| N/A | `<TextInput isError={true}>` |
| N/A | `<TextInput.LeadingIcon><Icon … /></TextInput.LeadingIcon>` |
| N/A | `<OutlinedTextInput … />` |

All existing props are preserved. New capabilities are additive-only via new props and optional slot children. **No breaking changes.**

---

## Open questions

1. **`onFocusChanged` event** — Should we add a `onFocus` / `onBlur` event pair in this PR, or keep it separate? (The SwiftUI `TextField` already exposes `onFocusChange`.)
2. **`placeholder` as slot only or dual string+slot?** — Keeping the string prop is convenient for simple cases but creates two ways to do the same thing. The ListItem precedent (`supportingText` string prop + `ListItemSupportingContent` slot) suggests keeping both.
3. **`TextInputColors` field count** — The full Material 3 `TextFieldColors` has 40+ parameters. Should we expose all of them immediately or start with the most common subset (focus/unfocused container + indicator + label colors)?
4. **`OutlinedTextInput` naming** — Alternative: `TextInput.Outlined` as a static property (like `Button.Filled`). Consistent with PR #43859's naming style if that was adopted.
