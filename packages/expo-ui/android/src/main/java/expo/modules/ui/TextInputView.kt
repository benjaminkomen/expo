package expo.modules.ui

import android.annotation.SuppressLint
import android.content.Context
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ComposableScope
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.ExpoComposeView

data class TextInputProps(
  val defaultValue: MutableState<String> = mutableStateOf(""),
  val multiline: MutableState<Boolean> = mutableStateOf(false),
  val numberOfLines: MutableState<Int?> = mutableStateOf(null),
  val keyboardType: MutableState<String> = mutableStateOf("default"),
  val autocorrection: MutableState<Boolean> = mutableStateOf(true),
  val autoCapitalize: MutableState<String> = mutableStateOf("none"),
  val isError: MutableState<Boolean> = mutableStateOf(false),
  val enabled: MutableState<Boolean> = mutableStateOf(true),
  val readOnly: MutableState<Boolean> = mutableStateOf(false),
  val secureTextEntry: MutableState<Boolean> = mutableStateOf(false),
  val colors: MutableState<TextInputColorsRecord?> = mutableStateOf(null),
  val modifiers: MutableState<ModifierList> = mutableStateOf(emptyList())
) : ComposeProps

private fun String.keyboardType(): KeyboardType {
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

private fun String.autoCapitalize(): KeyboardCapitalization {
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

@SuppressLint("ViewConstructor")
class TextInputView(context: Context, appContext: AppContext) :
  ExpoComposeView<TextInputProps>(context, appContext) {
  override val props = TextInputProps()
  private val onValueChanged by EventDispatcher()

  private val textState = mutableStateOf<String?>(null)

  var text: String?
    get() = textState.value
    set(value) {
      textState.value = value
      onValueChanged(mapOf("value" to (value ?: "")))
    }

  @Composable
  override fun ComposableScope.Content() {
    val labelSlot = findChildSlotView(this@TextInputView, "label")
    val placeholderSlot = findChildSlotView(this@TextInputView, "placeholder")
    val leadingIconSlot = findChildSlotView(this@TextInputView, "leadingIcon")
    val trailingIconSlot = findChildSlotView(this@TextInputView, "trailingIcon")
    val prefixSlot = findChildSlotView(this@TextInputView, "prefix")
    val suffixSlot = findChildSlotView(this@TextInputView, "suffix")
    val supportingTextSlot = findChildSlotView(this@TextInputView, "supportingText")

    TextField(
      value = textState.value ?: props.defaultValue.value,
      onValueChange = {
        textState.value = it
        onValueChanged(mapOf("value" to it))
      },
      label = labelSlot?.asComposable(),
      placeholder = placeholderSlot?.asComposable(),
      leadingIcon = leadingIconSlot?.asComposable(),
      trailingIcon = trailingIconSlot?.asComposable(),
      prefix = prefixSlot?.asComposable(),
      suffix = suffixSlot?.asComposable(),
      supportingText = supportingTextSlot?.asComposable(),
      isError = props.isError.value,
      enabled = props.enabled.value,
      readOnly = props.readOnly.value,
      visualTransformation = if (props.secureTextEntry.value) PasswordVisualTransformation() else VisualTransformation.None,
      maxLines = if (props.multiline.value) props.numberOfLines.value ?: Int.MAX_VALUE else 1,
      singleLine = !props.multiline.value,
      keyboardOptions = KeyboardOptions.Default.copy(
        keyboardType = props.keyboardType.value.keyboardType(),
        autoCorrectEnabled = props.autocorrection.value,
        capitalization = props.autoCapitalize.value.autoCapitalize()
      ),
      colors = props.colors.value?.toTextFieldColors() ?: TextFieldDefaults.colors(),
      modifier = ModifierRegistry.applyModifiers(props.modifiers.value, appContext, this@Content, globalEventDispatcher)
    )
  }
}

@SuppressLint("ViewConstructor")
class OutlinedTextInputView(context: Context, appContext: AppContext) :
  ExpoComposeView<TextInputProps>(context, appContext) {
  override val props = TextInputProps()
  private val onValueChanged by EventDispatcher()

  private val textState = mutableStateOf<String?>(null)

  var text: String?
    get() = textState.value
    set(value) {
      textState.value = value
      onValueChanged(mapOf("value" to (value ?: "")))
    }

  @Composable
  override fun ComposableScope.Content() {
    val labelSlot = findChildSlotView(this@OutlinedTextInputView, "label")
    val placeholderSlot = findChildSlotView(this@OutlinedTextInputView, "placeholder")
    val leadingIconSlot = findChildSlotView(this@OutlinedTextInputView, "leadingIcon")
    val trailingIconSlot = findChildSlotView(this@OutlinedTextInputView, "trailingIcon")
    val prefixSlot = findChildSlotView(this@OutlinedTextInputView, "prefix")
    val suffixSlot = findChildSlotView(this@OutlinedTextInputView, "suffix")
    val supportingTextSlot = findChildSlotView(this@OutlinedTextInputView, "supportingText")

    OutlinedTextField(
      value = textState.value ?: props.defaultValue.value,
      onValueChange = {
        textState.value = it
        onValueChanged(mapOf("value" to it))
      },
      label = labelSlot?.asComposable(),
      placeholder = placeholderSlot?.asComposable(),
      leadingIcon = leadingIconSlot?.asComposable(),
      trailingIcon = trailingIconSlot?.asComposable(),
      prefix = prefixSlot?.asComposable(),
      suffix = suffixSlot?.asComposable(),
      supportingText = supportingTextSlot?.asComposable(),
      isError = props.isError.value,
      enabled = props.enabled.value,
      readOnly = props.readOnly.value,
      visualTransformation = if (props.secureTextEntry.value) PasswordVisualTransformation() else VisualTransformation.None,
      maxLines = if (props.multiline.value) props.numberOfLines.value ?: Int.MAX_VALUE else 1,
      singleLine = !props.multiline.value,
      keyboardOptions = KeyboardOptions.Default.copy(
        keyboardType = props.keyboardType.value.keyboardType(),
        autoCorrectEnabled = props.autocorrection.value,
        capitalization = props.autoCapitalize.value.autoCapitalize()
      ),
      colors = props.colors.value?.toOutlinedTextFieldColors() ?: OutlinedTextFieldDefaults.colors(),
      modifier = ModifierRegistry.applyModifiers(props.modifiers.value, appContext, this@Content, globalEventDispatcher)
    )
  }
}
