import type { AnyType } from "@liverubber/shared";
import { fireEvent, render } from "@testing-library/react-native";
import { WelcomeScreen } from "../WelcomeScreen";

describe("WelcomeScreen", () => {
	const mockNavigation = {
		navigate: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders correctly with expected text", () => {
		const { getByText } = render(
			<WelcomeScreen
				navigation={mockNavigation as AnyType}
				route={{} as AnyType}
			/>,
		);

		expect(getByText("LiveRubber")).toBeTruthy();
		expect(getByText(/Your AI-powered task assistant/i)).toBeTruthy();
	});

	it("navigates to Login when Get Started is pressed", () => {
		const { getByText } = render(
			<WelcomeScreen
				navigation={mockNavigation as AnyType}
				route={{} as AnyType}
			/>,
		);

		fireEvent.press(getByText("Get Started"));
		expect(mockNavigation.navigate).toHaveBeenCalledWith("Login");
	});

	it("navigates to Register when Create an Account is pressed", () => {
		const { getByText } = render(
			<WelcomeScreen
				navigation={mockNavigation as AnyType}
				route={{} as AnyType}
			/>,
		);

		fireEvent.press(getByText("Create an Account"));
		expect(mockNavigation.navigate).toHaveBeenCalledWith("Register");
	});
});
