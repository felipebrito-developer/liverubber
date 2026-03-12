import type { AnyType } from "@liverubber/shared";
import { render } from "@testing-library/react-native";
import { useTasks } from "@/services/tasksService";
import { HomeScreen } from "../HomeScreen";

jest.mock("@/stores/authStore", () => ({
	userAtom: "userAtom",
}));

jest.mock("jotai", () => ({
	useAtomValue: () => ({ name: "Jane Doe" }),
	useSetAtom: () => jest.fn(),
}));

jest.mock("@/services/tasksService", () => ({
	useTasks: jest.fn(),
}));

describe("HomeScreen", () => {
	const mockNavigation = {
		navigate: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders greeting dynamically based on user", () => {
		(useTasks as jest.Mock).mockReturnValue({ data: [] });

		const { getByText } = render(
			<HomeScreen
				navigation={mockNavigation as AnyType}
				route={{} as AnyType}
			/>,
		);
		expect(getByText("Hello, Jane 👋")).toBeTruthy();
	});

	it("calculates active and completed tasks correctly", () => {
		const mockTasks = [
			{ id: "1", title: "Task 1", status: "done" },
			{ id: "2", title: "Task 2", status: "in_progress" },
			{ id: "3", title: "Task 3", status: "todo" },
		];

		(useTasks as jest.Mock).mockReturnValue({ data: mockTasks });

		const { getByText } = render(
			<HomeScreen
				navigation={mockNavigation as AnyType}
				route={{} as AnyType}
			/>,
		);

		// Total Active is 'in_progress' + 'todo' = 2
		// Total Completed is 'done' = 1
		// The screen renders the numbers directly inside Typography components.

		// We check for "2" which represents active tasks
		expect(getByText("2")).toBeTruthy();
		// We check for "1" which represents completed tasks
		expect(getByText("1")).toBeTruthy();
	});
});
