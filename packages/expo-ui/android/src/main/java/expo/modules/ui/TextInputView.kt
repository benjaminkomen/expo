package expo.modules.ui

import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.views.ComposableScope
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.FunctionalComposableScope

data class TextInputProps(
  val defaultValue: String = "",
  val multiline: Boolean = false,
  val numberOfLines: Int? = null,
  val keyboardType: String = "default",
  val autocorrection: Boolean = true,
  val autoCapitalize: String = "none",
  val isError: Boolean = false,
  val enabled: Boolean = true,
  val readOnly: Boolean = false,
  val secureTextEntry: Boolean = false,
  val colors: TextInputColorsRecord? = null,
  val setTextNonce: Int = 0,
  val setText: String? = null,
  val modifiers: ModifierList = emptyList()
) : ComposeProps

data class TextInputValueChangedEvent(
  @Field val value: String
) : Record

private fun String.toKeyboardType(): KeyboardType {
  return when (this) {
    "default" -> KeyboardType.Text
    "numeric" -> KeyboardType.Number
    "email-address" -> KeyboardType.Email
    "phone-pad" -> KeyboardType.Phone
    "decimal-pad" -> KeyboardType.Decimal
    "password" -> KeyboardType.Password
    "ascii-capable" -> KeyboardType.Ascii
    "url" -> KeyboardType.Uri
    "number-password" -> KeyboardType.NumberPassword
    else -> KeyboardType.Text
  }
}

private fun String.toAutoCapitalize(): KeyboardCapitalization {
  return when (this) {
    "characters" -> KeyboardCapitalization.Characters
    "none" -> KeyboardCapitalization.None
    "sentences" -> KeyboardCapitalization.Sentences
    "unspecified" -> KeyboardCapitalization.Unspecified
    "words" -> KeyboardCapitalization.Words
    else -> KeyboardCapitalization.None
  }
}

private fun SlotView.asComposable(): @Composable () -> Unit = {
  with(ComposableScope()) { with(this@asComposable) { Content() } }
}

@Composable
fun FunctionalComposableScope.TextInputContent(
  props: TextInputProps,
  onValueChanged: (TextInputValueChangedEvent) -> Unit
) {
  TextInputSharedContent(props = props, onValueChanged = onValueChanged) { params ->
    TextField(
      value = params.value,
      onValueChange = params.onValueChange,
      label = params.label,
      placeholder = params.placeholder,
      leadingIcon = params.leadingIcon,
      trailingIcon = params.trailingIcon,
      prefix = params.prefix,
      suffix = params.suffix,
      supportingText = params.supportingText,
      isError = props.isError,
      enabled = props.enabled,
      readOnly = props.readOnly,
      visualTransformation = params.visualTransformation,
      maxLines = params.maxLines,
      singleLine = params.singleLine,
      keyboardOptions = params.keyboardOptions,
      colors = props.colors?.toTextFieldColors() ?: TextFieldDefaults.colors(),
      modifier = params.modifier
    )
  }
}

@Composable
fun FunctionalComposableScope.OutlinedTextInputContent(
  props: TextInputProps,
  onValueChanged: (TextInputValueChangedEvent) -> Unit
) {
  TextInputSharedContent(props = props, onValueChanged = onValueChanged) { params ->
    OutlinedTextField(
      value = params.value,
      onValueChange = params.onValueChange,
      label = params.label,
      placeholder = params.placeholder,
      leadingIcon = params.leadingIcon,
      trailingIcon = params.trailingIcon,
      prefix = params.prefix,
      suffix = params.suffix,
      supportingText = params.supportingText,
      isError = props.isError,
      enabled = props.enabled,
      readOnly = props.readOnly,
      visualTransformation = params.visualTransformation,
      maxLines = params.maxLines,
      singleLine = params.singleLine,
      keyboardOptions = params.keyboardOptions,
      colors = props.colors?.toOutlinedTextFieldColors() ?: OutlinedTextFieldDefaults.colors(),
      modifier = params.modifier
    )
  }
}

/**
 * Shared parameters passed from [TextInputSharedContent] to the text field composable.
 */
private class TextFieldParams(
  val value: String,
  val onValueChange: (String) -> Unit,
  val label: @Composable (() -> Unit)?,
  val placeholder: @Composable (() -> Unit)?,
  val leadingIcon: @Composable (() -> Unit)?,
  val trailingIcon: @Composable (() -> Unit)?,
  val prefix: @Composable (() -> Unit)?,
  val suffix: @Composable (() -> Unit)?,
  val supportingText: @Composable (() -> Unit)?,
  val keyboardOptions: KeyboardOptions,
  val visualTransformation: VisualTransformation,
  val singleLine: Boolean,
  val maxLines: Int,
  val modifier: androidx.compose.ui.Modifier
)

@Composable
private fun FunctionalComposableScope.TextInputSharedContent(
  props: TextInputProps,
  onValueChanged: (TextInputValueChangedEvent) -> Unit,
  textField: @Composable (TextFieldParams) -> Unit
) {
  var textState by remember { mutableStateOf(props.defaultValue) }
  var prevSetTextNonce by remember { mutableIntStateOf(props.setTextNonce) }

  if (props.setTextNonce != prevSetTextNonce) {
    prevSetTextNonce = props.setTextNonce
    props.setText?.let { textState = it }
  }

  textField(
    TextFieldParams(
      value = textState,
      onValueChange = { newValue ->
        textState = newValue
        onValueChanged(TextInputValueChangedEvent(newValue))
      },
      label = findChildSlotView(view, "label")?.asComposable(),
      placeholder = findChildSlotView(view, "placeholder")?.asComposable(),
      leadingIcon = findChildSlotView(view, "leadingIcon")?.asComposable(),
      trailingIcon = findChildSlotView(view, "trailingIcon")?.asComposable(),
      prefix = findChildSlotView(view, "prefix")?.asComposable(),
      suffix = findChildSlotView(view, "suffix")?.asComposable(),
      supportingText = findChildSlotView(view, "supportingText")?.asComposable(),
      keyboardOptions = KeyboardOptions.Default.copy(
        keyboardType = props.keyboardType.toKeyboardType(),
        autoCorrectEnabled = props.autocorrection,
        capitalization = props.autoCapitalize.toAutoCapitalize()
      ),
      visualTransformation = if (props.secureTextEntry) PasswordVisualTransformation() else VisualTransformation.None,
      singleLine = !props.multiline,
      maxLines = if (props.multiline) props.numberOfLines ?: Int.MAX_VALUE else 1,
      modifier = ModifierRegistry.applyModifiers(props.modifiers, appContext, composableScope, globalEventDispatcher)
    )
  )
}
