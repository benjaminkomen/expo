package expo.modules.ui

import android.annotation.SuppressLint
import android.content.Context
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.FloatingActionButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SmallFloatingActionButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.core.view.size
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.types.Enumerable
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ComposableScope
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.ExpoComposeView
import expo.modules.kotlin.views.FunctionalComposableScope

// region CompositionLocals

/**
 * Carries the container/content colour from FABMenuContent down into each FABMenuItemView.Content()
 * so all FABs share the same colour without needing an explicit prop on each item view.
 */
internal val LocalFABMenuContainerColor = compositionLocalOf { Color.Unspecified }
internal val LocalFABMenuContentColor = compositionLocalOf { Color.Unspecified }

// endregion

// region Enums

enum class FABMenuVariant(val value: String) : Enumerable {
  SURFACE("surface"),
  PRIMARY("primary"),
  SECONDARY("secondary"),
  TERTIARY("tertiary")
}

// endregion

// region Props & records

data class FABMenuOpenChangeEvent(
  @Field val isOpen: Boolean
) : Record

/**
 * Props for the main FABMenuView.
 * The main FAB icon is provided as a child SlotView named "mainIcon" (set up by TypeScript).
 */
data class FABMenuProps(
  val open: Boolean? = null,
  val variant: FABMenuVariant? = FABMenuVariant.PRIMARY,
  val modifiers: ModifierList = emptyList()
) : ComposeProps

/**
 * Props for each secondary action item. The item icon is provided as a child IconView,
 * following the same pattern as FloatingActionButton.
 */
data class FABMenuItemProps(
  val label: MutableState<String?> = mutableStateOf(null)
) : ComposeProps

// endregion

// region FABMenuItemView

/**
 * A secondary floating action inside a FABMenu speed-dial.
 *
 * The icon is passed as a child `Icon` component on the TypeScript side; `Content()` uses
 * `Children(this)` to render it inside a `SmallFloatingActionButton`, the same pattern used by
 * `FloatingActionButton`. The container colour is inherited via `LocalFABMenuContainerColor`.
 */
@SuppressLint("ViewConstructor")
class FABMenuItemView(context: Context, appContext: AppContext) :
  ExpoComposeView<FABMenuItemProps>(context, appContext) {

  override val props = FABMenuItemProps()

  internal val onPress by EventDispatcher<Unit>()

  @Composable
  override fun ComposableScope.Content() {
    val containerColor = LocalFABMenuContainerColor.current
    val contentColor = LocalFABMenuContentColor.current

    SmallFloatingActionButton(
      onClick = { onPress(Unit) },
      containerColor = if (containerColor != Color.Unspecified) containerColor
      else FloatingActionButtonDefaults.containerColor,
      contentColor = if (contentColor != Color.Unspecified) contentColor
      else FloatingActionButtonDefaults.contentColor
    ) {
      Children(this) // renders the Icon child provided from TypeScript
    }
  }
}

// endregion

// region FABMenuContent composable

@Composable
fun FunctionalComposableScope.FABMenuContent(
  props: FABMenuProps,
  onOpenChange: (FABMenuOpenChangeEvent) -> Unit
) {
  var internalOpen by remember { mutableStateOf(false) }
  val isOpen = props.open ?: internalOpen

  // Resolve Material3 colour tokens from the variant
  val containerColor = when (props.variant) {
    FABMenuVariant.SECONDARY -> MaterialTheme.colorScheme.secondaryContainer
    FABMenuVariant.TERTIARY -> MaterialTheme.colorScheme.tertiaryContainer
    FABMenuVariant.SURFACE -> MaterialTheme.colorScheme.surfaceVariant
    else -> MaterialTheme.colorScheme.primaryContainer
  }
  val contentColor = when (props.variant) {
    FABMenuVariant.SECONDARY -> MaterialTheme.colorScheme.onSecondaryContainer
    FABMenuVariant.TERTIARY -> MaterialTheme.colorScheme.onTertiaryContainer
    FABMenuVariant.SURFACE -> MaterialTheme.colorScheme.onSurfaceVariant
    else -> MaterialTheme.colorScheme.onPrimaryContainer
  }

  // Collect only FABMenuItemView children (SlotViews and other views are handled separately)
  val items = buildList {
    for (i in 0 until view.size) {
      (view.getChildAt(i) as? FABMenuItemView)?.let { add(it) }
    }
  }

  val modifier = ModifierRegistry.applyModifiers(
    props.modifiers, appContext, composableScope, globalEventDispatcher
  )

  // Provide resolved colours so FABMenuItemView.Content() inherits them
  CompositionLocalProvider(
    LocalFABMenuContainerColor provides containerColor,
    LocalFABMenuContentColor provides contentColor
  ) {
    Box(
      contentAlignment = Alignment.BottomEnd,
      modifier = modifier.fillMaxSize()
    ) {
      // Speed-dial items stacked above the main FAB, reversed so the first item sits
      // closest to the main button.
      Column(
        horizontalAlignment = Alignment.End,
        verticalArrangement = Arrangement.spacedBy(8.dp),
        modifier = Modifier.padding(bottom = 72.dp, end = 8.dp)
      ) {
        for (item in items.reversed()) {
          key(item) {
            AnimatedVisibility(
              visible = isOpen,
              enter = fadeIn(tween(150)) + slideInVertically(tween(150)) { it / 2 },
              exit = fadeOut(tween(100)) + slideOutVertically(tween(100)) { it / 2 }
            ) {
              Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
              ) {
                val label = item.props.label.value
                if (!label.isNullOrEmpty()) {
                  Surface(
                    shape = MaterialTheme.shapes.small,
                    tonalElevation = 3.dp,
                    shadowElevation = 2.dp
                  ) {
                    Text(
                      text = label,
                      style = MaterialTheme.typography.labelLarge,
                      modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                    )
                  }
                }
                // Render FABMenuItemView.Content() — SmallFAB with icon via Children(this)
                Children(ComposableScope(), filter = { it === item })
              }
            }
          }
        }
      }

      // Main FAB — icon is provided via a "mainIcon" SlotView child from TypeScript
      FloatingActionButton(
        onClick = {
          val newOpen = !isOpen
          if (props.open == null) internalOpen = newOpen
          onOpenChange(FABMenuOpenChangeEvent(isOpen = newOpen))
        },
        containerColor = containerColor,
        contentColor = contentColor,
        modifier = Modifier.padding(8.dp)
      ) {
        // Renders the children of the "mainIcon" SlotView (i.e. the Icon component)
        Children(ComposableScope(), filter = { isSlotWithName(it, "mainIcon") })
      }
    }
  }
}

// endregion
