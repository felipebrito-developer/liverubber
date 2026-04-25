/**
 * Polyfill for Node 18 compatibility with Metro 0.83.5+
 * ES2023 Array methods are required by recent Metro versions
 */
if (!Array.prototype.toReversed) {
	Array.prototype.toReversed = function () {
		return [...this].reverse();
	};
}
if (!Array.prototype.toSorted) {
	Array.prototype.toSorted = function (compareFn) {
		return [...this].sort(compareFn);
	};
}

const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const path = require("node:path");

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
