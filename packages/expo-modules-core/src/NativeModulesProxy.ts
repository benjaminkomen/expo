import type { ProxyNativeModule } from './NativeModulesProxy.types';

// We default to an empty object shim wherever we don't have an environment-specific implementation

/**
 * @deprecated `NativeModulesProxy` is deprecated and might be removed in the future releases.
 * Use `requireNativeModule` or `requireOptionalNativeModule` instead.
 */
export default {} as Record<string, ProxyNativeModule>;
