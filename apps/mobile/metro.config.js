const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 */
const config = {
	watchFolders: [monorepoRoot],
	resolver: {
		nodeModulesPaths: [
			path.resolve(projectRoot, "node_modules"),
			path.resolve(monorepoRoot, "node_modules"),
		],
	},
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
