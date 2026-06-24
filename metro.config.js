const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable package exports globally so that Tailwind/Nativewind CSS resolving works
config.resolver.unstable_enablePackageExports = true;

// Custom resolver to bypass exports validation for RxJS on Windows while keeping it active globally
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const isRxjs =
    moduleName.startsWith("rxjs") ||
    (context.originModulePath &&
      context.originModulePath.replace(/\\/g, "/").includes("node_modules/rxjs"));

  if (isRxjs) {
    // Disable package exports selectively for RxJS to bypass Windows path resolution bugs
    const modifiedContext = {
      ...context,
      unstable_enablePackageExports: false,
    };
    return modifiedContext.resolveRequest(
      modifiedContext,
      moduleName,
      platform
    );
  }

  // Fallback to default Metro resolver for all other packages
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativewind(config);
