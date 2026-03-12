module.exports = {
	preset: "react-native",
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	transformIgnorePatterns: [
		"node_modules/(?!(jest-)?react-native|@react-native(-community)?|@react-navigation|jotai)/",
	],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
};
