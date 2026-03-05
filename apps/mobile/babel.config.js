module.exports = {
	presets: ["@react-native/babel-preset"],
	plugins: [
		[
			"module-resolver",
			{
				root: ["./src"],
				extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
				alias: {
					"@": "./src",
				},
			},
		],
		// Reanimated plugin MUST be last
		"react-native-reanimated/plugin",
	],
};
