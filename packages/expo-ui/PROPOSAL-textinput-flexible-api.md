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

### Why TextInput needs named slots (unlike Button)

PR #43859 made `Button` less opinionated by accepting **free children**: `<Button><Row><Icon /><Text /></Row></Button>`. This works because a button's composable content _is_ its children — there is only one slot and the developer owns its full layout.

`TextField` is fundamentally different. Its layout is fixed by Material 3: leading icon sits to the left of the input area, trailing icon to the right, prefix/suffix appear _inside_ the text area, and supporting text is rendered below the field boundary. None of these positions can be reached by passing free children — each one is a **separate, named, positional slot** in the Compose API.

The correct analogy is `ListItem`, not `Button`. `ListItem` already uses the `SlotView` named-slot pattern (`ListItem.Leading`, `ListItem.Trailing`, `ListItem.SupportingContent`) for exactly this reason. This proposal applies the same pattern to `TextInput`.

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

### 1. Component naming: `TextInput` and `TextInput.Outlined`

Following PR #43859's approach of separate components per variant, the outlined variant is exposed as a static property on the main component — consistent with how the button variants are organised:

```tsx
import { TextInput } from '@expo/ui/jetpack-compose';

// Filled (default Material 3 style)
<TextInput … />

// Outlined
<TextInput.Outlined … />
```

A `variant` prop is intentionally avoided — it hides two genuinely different native components behind a stringly-typed switch.

Both `TextInput` and `TextInput.Outlined` accept identical props.

---

### 2. Slot sub-components (SlotView pattern)

Using the same `SlotView` mechanism already used by `ListItem`. All content that the original API expressed as string props is now a slot — no string convenience shorthands:

| Sub-component | `slotName` | Material 3 slot |
|---|---|---|
| `TextInput.Label` | `"label"` | `label` |
| `TextInput.Placeholder` | `"placeholder"` | `placeholder` |
| `TextInput.LeadingIcon` | `"leadingIcon"` | `leadingIcon` |
| `TextInput.TrailingIcon` | `"trailingIcon"` | `trailingIcon` |
| `TextInput.Prefix` | `"prefix"` | `prefix` |
| `TextInput.Suffix` | `"suffix"` | `suffix` |
| `TextInput.SupportingText` | `"supportingText"` | `supportingText` |

`TextInput.Outlined.Label`, `TextInput.Outlined.LeadingIcon`, etc. are the same sub-components re-used — both variants share identical children API.

---

### 3. Scalar props

| Prop | Type | Default | Material 3 equivalent |
|---|---|---|---|
| `isError` | `boolean` | `false` | `isError` |
| `enabled` | `boolean` | `true` | `enabled` |
| `readOnly` | `boolean` | `false` | `readOnly` |
| `colors` | `TextInputColors` | — | `TextFieldColors` |

---

### 4. `TextInputColors` — full `TextFieldColors` mapping

Every parameter from Material 3's `TextFieldColors` is exposed. All fields are optional; omitted fields fall back to the Material theme default.

```ts
export type TextInputColors = {
  // Text
  focusedTextColor?: ColorValue;
  unfocusedTextColor?: ColorValue;
  disabledTextColor?: ColorValue;
  errorTextColor?: ColorValue;

  // Container (filled variant background / outlined variant has no container fill by default)
  focusedContainerColor?: ColorValue;
  unfocusedContainerColor?: ColorValue;
  disabledContainerColor?: ColorValue;
  errorContainerColor?: ColorValue;

  // Cursor
  cursorColor?: ColorValue;
  errorCursorColor?: ColorValue;

  // Indicator line (filled) / border (outlined)
  focusedIndicatorColor?: ColorValue;
  unfocusedIndicatorColor?: ColorValue;
  disabledIndicatorColor?: ColorValue;
  errorIndicatorColor?: ColorValue;

  // Leading icon
  focusedLeadingIconColor?: ColorValue;
  unfocusedLeadingIconColor?: ColorValue;
  disabledLeadingIconColor?: ColorValue;
  errorLeadingIconColor?: ColorValue;

  // Trailing icon
  focusedTrailingIconColor?: ColorValue;
  unfocusedTrailingIconColor?: ColorValue;
  disabledTrailingIconColor?: ColorValue;
  errorTrailingIconColor?: ColorValue;

  // Label
  focusedLabelColor?: ColorValue;
  unfocusedLabelColor?: ColorValue;
  disabledLabelColor?: ColorValue;
  errorLabelColor?: ColorValue;

  // Placeholder
  focusedPlaceholderColor?: ColorValue;
  unfocusedPlaceholderColor?: ColorValue;
  disabledPlaceholderColor?: ColorValue;
  errorPlaceholderColor?: ColorValue;

  // Supporting text
  focusedSupportingTextColor?: ColorValue;
  unfocusedSupportingTextColor?: ColorValue;
  disabledSupportingTextColor?: ColorValue;
  errorSupportingTextColor?: ColorValue;

  // Prefix
  focusedPrefixColor?: ColorValue;
  unfocusedPrefixColor?: ColorValue;
  disabledPrefixColor?: ColorValue;
  errorPrefixColor?: ColorValue;

  // Suffix
  focusedSuffixColor?: ColorValue;
  unfocusedSuffixColor?: ColorValue;
  disabledSuffixColor?: ColorValue;
  errorSuffixColor?: ColorValue;
};
```

---

### 5. Full TypeScript API

```tsx
type TextInputSlotProps = {
  children: React.ReactNode;
};

export type TextInputRef = {
  setText: (newText: string) => Promise<void>;
};

export type TextInputProps = {
  ref?: Ref<TextInputRef>;

  // Value
  defaultValue?: string;
  onChangeText: (value: string) => void;

  // Behavior
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'ascii-capable'
    | 'url'
    | 'decimal-pad';
  autocorrection?: boolean;
  autoCapitalize?: 'characters' | 'none' | 'sentences' | 'unspecified' | 'words';

  // State
  enabled?: boolean;
  readOnly?: boolean;
  isError?: boolean;

  // Appearance
  colors?: TextInputColors;

  // Layout
  modifiers?: ExpoModifier[];

  // Named slot children
  children?: React.ReactNode;
};

// Sub-components — identical for both TextInput and TextInput.Outlined
TextInput.Label           = (props: TextInputSlotProps) => …  // slotName="label"
TextInput.Placeholder     = (props: TextInputSlotProps) => …  // slotName="placeholder"
TextInput.LeadingIcon     = (props: TextInputSlotProps) => …  // slotName="leadingIcon"
TextInput.TrailingIcon    = (props: TextInputSlotProps) => …  // slotName="trailingIcon"
TextInput.Prefix          = (props: TextInputSlotProps) => …  // slotName="prefix"
TextInput.Suffix          = (props: TextInputSlotProps) => …  // slotName="suffix"
TextInput.SupportingText  = (props: TextInputSlotProps) => …  // slotName="supportingText"
TextInput.Outlined        = (props: TextInputProps)     => …  // OutlinedTextField variant
```

---

### 6. Usage examples

#### Password field with show/hide toggle

```tsx
const [secure, setSecure] = useState(true);

<TextInput
  keyboardType={secure ? 'password' : 'default'}
  onChangeText={setPassword}>
  <TextInput.Label>
    <Text>Password</Text>
  </TextInput.Label>
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

#### Currency amount field (outlined)

```tsx
<TextInput.Outlined keyboardType="decimal-pad" onChangeText={setAmount}>
  <TextInput.Outlined.Label>
    <Text>Amount</Text>
  </TextInput.Outlined.Label>
  <TextInput.Outlined.Prefix>
    <Text>€</Text>
  </TextInput.Outlined.Prefix>
  <TextInput.Outlined.Suffix>
    <Text>EUR</Text>
  </TextInput.Outlined.Suffix>
</TextInput.Outlined>
```

#### Error state with helper text

```tsx
<TextInput.Outlined
  keyboardType="email-address"
  isError={!isValid}
  onChangeText={setEmail}>
  <TextInput.Outlined.Label>
    <Text>Email</Text>
  </TextInput.Outlined.Label>
  <TextInput.Outlined.SupportingText>
    <Text>{isValid ? 'We'll send a confirmation link here.' : 'Enter a valid email address.'}</Text>
  </TextInput.Outlined.SupportingText>
</TextInput.Outlined>
```

#### Search field with leading icon and placeholder

```tsx
<TextInput onChangeText={setQuery}>
  <TextInput.Placeholder>
    <Text>Search…</Text>
  </TextInput.Placeholder>
  <TextInput.LeadingIcon>
    <Icon name="search" />
  </TextInput.LeadingIcon>
</TextInput>
```

#### Custom brand colors

```tsx
<TextInput
  onChangeText={setText}
  colors={{
    focusedIndicatorColor: '#6200EE',
    unfocusedIndicatorColor: '#AAAAAA',
    focusedLabelColor: '#6200EE',
    unfocusedLabelColor: '#888888',
    cursorColor: '#6200EE',
  }}>
  <TextInput.Label><Text>Username</Text></TextInput.Label>
</TextInput>
```

---

### 7. Kotlin implementation sketch

#### `TextInputProps` additions

```kotlin
data class TextInputProps(
  val defaultValue: MutableState<String> = mutableStateOf(""),
  val multiline: MutableState<Boolean> = mutableStateOf(false),
  val numberOfLines: MutableState<Int?> = mutableStateOf(null),
  val keyboardType: MutableState<String> = mutableStateOf("default"),
  val autocorrection: MutableState<Boolean> = mutableStateOf(true),
  val autoCapitalize: MutableState<String> = mutableStateOf("none"),
  // New
  val isError: MutableState<Boolean> = mutableStateOf(false),
  val enabled: MutableState<Boolean> = mutableStateOf(true),
  val readOnly: MutableState<Boolean> = mutableStateOf(false),
  val colors: MutableState<TextInputColorsRecord?> = mutableStateOf(null),
  val modifiers: MutableState<ModifierList> = mutableStateOf(emptyList())
) : ComposeProps
```

#### `TextInputView.kt` composable

```kotlin
@Composable
override fun ComposableScope.Content() {
  val labelSlot         = findChildSlotView(view, "label")
  val placeholderSlot   = findChildSlotView(view, "placeholder")
  val leadingIconSlot   = findChildSlotView(view, "leadingIcon")
  val trailingIconSlot  = findChildSlotView(view, "trailingIcon")
  val prefixSlot        = findChildSlotView(view, "prefix")
  val suffixSlot        = findChildSlotView(view, "suffix")
  val supportingTextSlot = findChildSlotView(view, "supportingText")

  TextField(
    value = textState.value ?: props.defaultValue.value,
    onValueChange = { textState.value = it; onValueChanged(mapOf("value" to it)) },
    label          = labelSlot?.asComposable(),
    placeholder    = placeholderSlot?.asComposable(),
    leadingIcon    = leadingIconSlot?.asComposable(),
    trailingIcon   = trailingIconSlot?.asComposable(),
    prefix         = prefixSlot?.asComposable(),
    suffix         = suffixSlot?.asComposable(),
    supportingText = supportingTextSlot?.asComposable(),
    isError        = props.isError.value,
    enabled        = props.enabled.value,
    readOnly       = props.readOnly.value,
    singleLine     = !props.multiline.value,
    maxLines       = if (props.multiline.value) props.numberOfLines.value ?: Int.MAX_VALUE else 1,
    keyboardOptions = KeyboardOptions.Default.copy(
      keyboardType       = props.keyboardType.value.keyboardType(),
      autoCorrectEnabled = props.autocorrection.value,
      capitalization     = props.autoCapitalize.value.autoCapitalize()
    ),
    colors   = props.colors.value?.toComposeColors() ?: TextFieldDefaults.colors(),
    modifier = ModifierRegistry.applyModifiers(props.modifiers.value, appContext, this, globalEventDispatcher)
  )
}
```

`OutlinedTextInputView.kt` is identical except it calls `OutlinedTextField(…)` and uses `OutlinedTextFieldDefaults.colors()` as fallback.

#### Helper extension

```kotlin
private fun SlotView.asComposable(): @Composable () -> Unit = {
  with(ComposableScope()) { with(this@asComposable) { Content() } }
}
```

#### `TextInputColorsRecord` (Kotlin Record)

```kotlin
data class TextInputColorsRecord(
  @Field val focusedTextColor: Color? = null,
  @Field val unfocusedTextColor: Color? = null,
  @Field val disabledTextColor: Color? = null,
  @Field val errorTextColor: Color? = null,
  @Field val focusedContainerColor: Color? = null,
  @Field val unfocusedContainerColor: Color? = null,
  @Field val disabledContainerColor: Color? = null,
  @Field val errorContainerColor: Color? = null,
  @Field val cursorColor: Color? = null,
  @Field val errorCursorColor: Color? = null,
  @Field val focusedIndicatorColor: Color? = null,
  @Field val unfocusedIndicatorColor: Color? = null,
  @Field val disabledIndicatorColor: Color? = null,
  @Field val errorIndicatorColor: Color? = null,
  @Field val focusedLeadingIconColor: Color? = null,
  @Field val unfocusedLeadingIconColor: Color? = null,
  @Field val disabledLeadingIconColor: Color? = null,
  @Field val errorLeadingIconColor: Color? = null,
  @Field val focusedTrailingIconColor: Color? = null,
  @Field val unfocusedTrailingIconColor: Color? = null,
  @Field val disabledTrailingIconColor: Color? = null,
  @Field val errorTrailingIconColor: Color? = null,
  @Field val focusedLabelColor: Color? = null,
  @Field val unfocusedLabelColor: Color? = null,
  @Field val disabledLabelColor: Color? = null,
  @Field val errorLabelColor: Color? = null,
  @Field val focusedPlaceholderColor: Color? = null,
  @Field val unfocusedPlaceholderColor: Color? = null,
  @Field val disabledPlaceholderColor: Color? = null,
  @Field val errorPlaceholderColor: Color? = null,
  @Field val focusedSupportingTextColor: Color? = null,
  @Field val unfocusedSupportingTextColor: Color? = null,
  @Field val disabledSupportingTextColor: Color? = null,
  @Field val errorSupportingTextColor: Color? = null,
  @Field val focusedPrefixColor: Color? = null,
  @Field val unfocusedPrefixColor: Color? = null,
  @Field val disabledPrefixColor: Color? = null,
  @Field val errorPrefixColor: Color? = null,
  @Field val focusedSuffixColor: Color? = null,
  @Field val unfocusedSuffixColor: Color? = null,
  @Field val disabledSuffixColor: Color? = null,
  @Field val errorSuffixColor: Color? = null,
) : Record

fun TextInputColorsRecord.toComposeColors(): TextFieldColors {
  val d = TextFieldDefaults.colors()
  return TextFieldDefaults.colors(
    focusedTextColor          = focusedTextColor.composeOrNull          ?: d.focusedTextColor,
    unfocusedTextColor        = unfocusedTextColor.composeOrNull        ?: d.unfocusedTextColor,
    disabledTextColor         = disabledTextColor.composeOrNull         ?: d.disabledTextColor,
    errorTextColor            = errorTextColor.composeOrNull            ?: d.errorTextColor,
    focusedContainerColor     = focusedContainerColor.composeOrNull     ?: d.focusedContainerColor,
    unfocusedContainerColor   = unfocusedContainerColor.composeOrNull   ?: d.unfocusedContainerColor,
    disabledContainerColor    = disabledContainerColor.composeOrNull    ?: d.disabledContainerColor,
    errorContainerColor       = errorContainerColor.composeOrNull       ?: d.errorContainerColor,
    cursorColor               = cursorColor.composeOrNull               ?: d.cursorColor,
    errorCursorColor          = errorCursorColor.composeOrNull          ?: d.errorCursorColor,
    focusedIndicatorColor     = focusedIndicatorColor.composeOrNull     ?: d.focusedIndicatorColor,
    unfocusedIndicatorColor   = unfocusedIndicatorColor.composeOrNull   ?: d.unfocusedIndicatorColor,
    disabledIndicatorColor    = disabledIndicatorColor.composeOrNull    ?: d.disabledIndicatorColor,
    errorIndicatorColor       = errorIndicatorColor.composeOrNull       ?: d.errorIndicatorColor,
    focusedLeadingIconColor   = focusedLeadingIconColor.composeOrNull   ?: d.focusedLeadingIconColor,
    unfocusedLeadingIconColor = unfocusedLeadingIconColor.composeOrNull ?: d.unfocusedLeadingIconColor,
    disabledLeadingIconColor  = disabledLeadingIconColor.composeOrNull  ?: d.disabledLeadingIconColor,
    errorLeadingIconColor     = errorLeadingIconColor.composeOrNull     ?: d.errorLeadingIconColor,
    focusedTrailingIconColor   = focusedTrailingIconColor.composeOrNull   ?: d.focusedTrailingIconColor,
    unfocusedTrailingIconColor = unfocusedTrailingIconColor.composeOrNull ?: d.unfocusedTrailingIconColor,
    disabledTrailingIconColor  = disabledTrailingIconColor.composeOrNull  ?: d.disabledTrailingIconColor,
    errorTrailingIconColor     = errorTrailingIconColor.composeOrNull     ?: d.errorTrailingIconColor,
    focusedLabelColor         = focusedLabelColor.composeOrNull         ?: d.focusedLabelColor,
    unfocusedLabelColor       = unfocusedLabelColor.composeOrNull       ?: d.unfocusedLabelColor,
    disabledLabelColor        = disabledLabelColor.composeOrNull        ?: d.disabledLabelColor,
    errorLabelColor           = errorLabelColor.composeOrNull           ?: d.errorLabelColor,
    focusedPlaceholderColor   = focusedPlaceholderColor.composeOrNull   ?: d.focusedPlaceholderColor,
    unfocusedPlaceholderColor = unfocusedPlaceholderColor.composeOrNull ?: d.unfocusedPlaceholderColor,
    disabledPlaceholderColor  = disabledPlaceholderColor.composeOrNull  ?: d.disabledPlaceholderColor,
    errorPlaceholderColor     = errorPlaceholderColor.composeOrNull     ?: d.errorPlaceholderColor,
    focusedSupportingTextColor   = focusedSupportingTextColor.composeOrNull   ?: d.focusedSupportingTextColor,
    unfocusedSupportingTextColor = unfocusedSupportingTextColor.composeOrNull ?: d.unfocusedSupportingTextColor,
    disabledSupportingTextColor  = disabledSupportingTextColor.composeOrNull  ?: d.disabledSupportingTextColor,
    errorSupportingTextColor     = errorSupportingTextColor.composeOrNull     ?: d.errorSupportingTextColor,
    focusedPrefixColor   = focusedPrefixColor.composeOrNull   ?: d.focusedPrefixColor,
    unfocusedPrefixColor = unfocusedPrefixColor.composeOrNull ?: d.unfocusedPrefixColor,
    disabledPrefixColor  = disabledPrefixColor.composeOrNull  ?: d.disabledPrefixColor,
    errorPrefixColor     = errorPrefixColor.composeOrNull     ?: d.errorPrefixColor,
    focusedSuffixColor   = focusedSuffixColor.composeOrNull   ?: d.focusedSuffixColor,
    unfocusedSuffixColor = unfocusedSuffixColor.composeOrNull ?: d.unfocusedSuffixColor,
    disabledSuffixColor  = disabledSuffixColor.composeOrNull  ?: d.disabledSuffixColor,
    errorSuffixColor     = errorSuffixColor.composeOrNull     ?: d.errorSuffixColor,
  )
}
```

---

### 8. `ExpoUIModule.kt` registration

```kotlin
View(TextInputView::class) {
  Events("onValueChanged")
  Prop("defaultValue", "") { view: TextInputView, text: String ->
    if (view.text == null) view.text = text
  }
  Prop("isError")   { view: TextInputView, v: Boolean               -> view.props.isError.value   = v }
  Prop("enabled")   { view: TextInputView, v: Boolean               -> view.props.enabled.value   = v }
  Prop("readOnly")  { view: TextInputView, v: Boolean               -> view.props.readOnly.value  = v }
  Prop("colors")    { view: TextInputView, c: TextInputColorsRecord  -> view.props.colors.value    = c }
  AsyncFunction("setText") { view: TextInputView, text: String -> view.text = text }
}

View(OutlinedTextInputView::class) {
  // Identical registration
  Events("onValueChanged")
  Prop("defaultValue", "") { view: OutlinedTextInputView, text: String ->
    if (view.text == null) view.text = text
  }
  Prop("isError")   { view: OutlinedTextInputView, v: Boolean               -> view.props.isError.value   = v }
  Prop("enabled")   { view: OutlinedTextInputView, v: Boolean               -> view.props.enabled.value   = v }
  Prop("readOnly")  { view: OutlinedTextInputView, v: Boolean               -> view.props.readOnly.value  = v }
  Prop("colors")    { view: OutlinedTextInputView, c: TextInputColorsRecord  -> view.props.colors.value    = c }
  AsyncFunction("setText") { view: OutlinedTextInputView, text: String -> view.text = text }
}
```

---

## Open questions

1. **`onFocusChanged` event** — Should `onFocus` / `onBlur` be added in this PR or separately? The SwiftUI `TextField` already exposes `onFocusChange`.
2. **`TextInput.Outlined` sub-components** — Should `TextInput.Outlined.Label`, `TextInput.Outlined.LeadingIcon`, etc. be distinct types or aliases pointing to the same `SlotView` wrappers as `TextInput.Label`, `TextInput.LeadingIcon`, etc.? Since both variants read the same `slotName` strings, they can safely share implementations.
