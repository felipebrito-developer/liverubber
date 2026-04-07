import type { AnyType } from "@liverubber/shared";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { api } from "@/services/api";
import { LoginScreen } from "../LoginScreen";

jest.mock("@/stores/authStore", () => ({
	userAtom: "userAtom",
}));

jest.mock("jotai", () => ({
	useSetAtom: () => jest.fn(),
}));

jest.mock("@/services/api", () => ({
	api: {
		post: jest.fn(),
	},
}));

describe("LoginScreen", () => {
	const mockNavigation = {
		navigate: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders login form correctly", () => {
		const { getByText, getByPlaceholderText } = render(
			<LoginScreen
				navigation={mockNavigation as AnyType}
				route={{} as AnyType}
			/>,
		);

		expect(getByText("Welcome back")).toBeTruthy();
		expect(getByPlaceholderText("you@example.com")).toBeTruthy();
		expect(getByPlaceholderText("••••••••")).toBeTruthy();
	});

	it("shows validation errors for invalid input", async () => {
		const { getByText, getByPlaceholderText } = render(
			<LoginScreen
				navigation={mockNavigation as AnyType}
				route={{} as AnyType}
			/>,
		);

		const emailInput = getByPlaceholderText("you@example.com");
		const passwordInput = getByPlaceholderText("••••••••");
		const submitButton = getByText("Sign In");

		fireEvent.changeText(emailInput, "invalidemail");
		fireEvent.changeText(passwordInput, "123");
		fireEvent.press(submitButton);

		await waitFor(() => {
			expect(getByText("Enter a valid email address.")).toBeTruthy();
			expect(getByText("Password must be 6+ characters.")).toBeTruthy();
		});
	});

	it("calls api correctly on valid input", async () => {
		(api.post as jest.Mock).mockResolvedValueOnce({
			user: { id: "1", name: "Test" },
			token: "abc",
		});

		const { getByText, getByPlaceholderText } = render(
			<LoginScreen
				navigation={mockNavigation as AnyType}
				route={{} as AnyType}
			/>,
		);

		fireEvent.changeText(
			getByPlaceholderText("you@example.com"),
			"test@example.com",
		);
		fireEvent.changeText(getByPlaceholderText("••••••••"), "password123");
		fireEvent.press(getByText("Sign In"));

		await waitFor(() => {
			expect(api.post).toHaveBeenCalledWith("/auth/login", {
				email: "test@example.com",
				password: "password123",
			});
		});
	});
});
