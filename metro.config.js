const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Disable unstable package exports to resolve RxJS and GetStream module resolution errors on Windows
config.resolver.unstable_enablePackageExports = false;

module.exports = withNativewind(config);
