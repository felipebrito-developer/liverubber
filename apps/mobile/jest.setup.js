import "@testing-library/jest-native/extend-expect";

// Mock React Navigation
jest.mock("@react-navigation/native", () => {
	const actualNav = jest.requireActual("@react-navigation/native");
	return {
		...actualNav,
		useNavigation: () => ({
			navigate: jest.fn(),
			goBack: jest.fn(),
		}),
	};
});

// Mock Safe Area Context
jest.mock("react-native-safe-area-context", () => {
	const inset = { top: 0, right: 0, bottom: 0, left: 0 };
	return {
		SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
		SafeAreaConsumer: jest
			.fn()
			.mockImplementation(({ children }) => children(inset)),
		SafeAreaView: jest.fn().mockImplementation(({ children }) => children),
		useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
	};
});
