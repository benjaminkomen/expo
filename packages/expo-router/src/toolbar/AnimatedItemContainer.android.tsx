'use client';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { requireExpoUI } from '../optional-libraries/expo-ui';

/**
 * Shared animated container for Android toolbar items.
 *
 * On initial mount, renders the content without animation so the touch target
 * is immediately active. The enter/exit animations only play for subsequent
 * visibility changes (i.e. when the `hidden` prop is toggled at runtime).
 */
export function AnimatedItemContainer({
  visible,
  children,
}: {
  visible: boolean;
  children: ReactNode;
}) {
  const {
    expoUI: { AnimatedVisibility, EnterTransition, ExitTransition },
  } = requireExpoUI(
    "Stack.Toolbar on Android requires '@expo/ui'. Install it with `npx expo install @expo/ui` and rebuild your app."
  );

  // Track whether this is the first render. On initial mount we skip the enter
  // animation so the button is immediately tappable. After the component has
  // been mounted, toggling `hidden` plays the normal scale+expand animation.
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
  }, []);

  if (!mountedRef.current) {
    // Pre-mount: render directly so there is no animation blocking touch.
    return visible ? <>{children}</> : null;
  }

  return (
    <AnimatedVisibility
      // As mentioned in the docs, `scaleIn` does not animate layout, so we need to combine it with `expandIn` to get the layout animation as well. The same applies to `scaleOut` and `shrinkOut`.
      // https://developer.android.com/reference/kotlin/androidx/compose/animation/package-summary#scaleOut(androidx.compose.animation.core.FiniteAnimationSpec,kotlin.Float,androidx.compose.ui.graphics.TransformOrigin)
      enterTransition={EnterTransition.scaleIn().plus(EnterTransition.expandIn())}
      exitTransition={ExitTransition.scaleOut().plus(ExitTransition.shrinkOut())}
      visible={visible}>
      {children}
    </AnimatedVisibility>
  );
}
