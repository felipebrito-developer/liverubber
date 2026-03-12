/**
 * React Native configuration for the monorepo.
 * The android.packageName field is required by the React Native Gradle Plugin (RNGP)
 * for autolinking to work correctly — especially in a monorepo context.
 */
module.exports = {
	project: {
		android: {
			packageName: "com.liverubber",
			sourceDir: "./android",
		},
	},
};
