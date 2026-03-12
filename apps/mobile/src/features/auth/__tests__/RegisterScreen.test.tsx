import type { AnyType } from "@liverubber/shared";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { api } from "@/services/api";
import { RegisterScreen } from "../RegisterScreen";

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

describe("RegisterScreen", () => {
	const mockNavigation = {
		navigate: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders register form correctly", () => {
		const { getByPlaceholderText, getAllByText } = render(
			<RegisterScreen
				navigation={mockNavigation as AnyType}
				route={{} as AnyType}
			/>,
		);

		expect(getAllByText("Create Account").length).toBeGreaterThan(0);
		expect(getByPlaceholderText("Jane Doe")).toBeTruthy();
	});

	it("shows validation errors for invalid input", async () => {
		const { getByText, getByPlaceholderText, getAllByText } = render(
			<RegisterScreen
				navigation={mockNavigation as AnyType}
				route={{} as AnyType}
			/>,
		);

		fireEvent.changeText(getByPlaceholderText("Jane Doe"), "J");
		fireEvent.changeText(getByPlaceholderText("you@example.com"), "invalid");
		fireEvent.changeText(getByPlaceholderText("••••••••"), "123");
		fireEvent.press(
			getAllByText("Create Account")[1] || getAllByText("Create Account")[0],
		);

		await waitFor(() => {
			expect(getByText("Name must be at least 2 characters.")).toBeTruthy();
			expect(getByText("Enter a valid email address.")).toBeTruthy();
			expect(getByText("Password must be 6+ characters.")).toBeTruthy();
		});
	});

	it("calls api correctly and navigates on valid registration", async () => {
		(api.post as jest.Mock).mockResolvedValueOnce({
			user: { id: "1", name: "Jane" },
			token: "abc",
		});

		const { getByPlaceholderText, getAllByText } = render(
			<RegisterScreen
				navigation={mockNavigation as AnyType}
				route={{} as AnyType}
			/>,
		);

		fireEvent.changeText(getByPlaceholderText("Jane Doe"), "Jane Doe");
		fireEvent.changeText(
			getByPlaceholderText("you@example.com"),
			"jane@test.com",
		);
		fireEvent.changeText(getByPlaceholderText("••••••••"), "securepass");
		fireEvent.press(
			getAllByText("Create Account")[1] || getAllByText("Create Account")[0],
		);

		await waitFor(() => {
			expect(api.post).toHaveBeenCalledWith("/auth/register", {
				name: "Jane Doe",
				email: "jane@test.com",
				password: "securepass",
			});
			expect(mockNavigation.navigate).toHaveBeenCalledWith("MainTab");
		});
	});
});
