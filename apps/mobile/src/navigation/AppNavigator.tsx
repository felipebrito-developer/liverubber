import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAtomValue } from "jotai";
import { LoginScreen } from "@/features/auth/LoginScreen";
import { RegisterScreen } from "@/features/auth/RegisterScreen";
import { WelcomeScreen } from "@/features/auth/WelcomeScreen";
import { HomeScreen } from "@/features/tasks/HomeScreen";
import { TasksScreen } from "@/features/tasks/TasksScreen";
import { isAuthenticatedAtom } from "@/stores/authStore";
import { colors } from "@/theme";
import { MainTabNavigator } from "./MainTabNavigator";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
	const isAuthenticated = useAtomValue(isAuthenticatedAtom);

	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: colors.background },
					animation: "slide_from_right",
				}}
			>
				{isAuthenticated ? (
					<>
						{/* ── Main app (tab navigator) ─────────────────────────────── */}
						<Stack.Screen
							name="MainTab"
							component={MainTabNavigator}
							options={{ animation: "fade" }}
						/>
						{/* ── Legacy screens (kept for backwards compat) ───────────── */}
						<Stack.Screen name="Home" component={HomeScreen} />
						<Stack.Screen name="Tasks" component={TasksScreen} />
					</>
				) : (
					<>
						{/* ── Auth flow ────────────────────────────────────────────── */}
						<Stack.Screen name="Welcome" component={WelcomeScreen} />
						<Stack.Screen name="Login" component={LoginScreen} />
						<Stack.Screen name="Register" component={RegisterScreen} />
					</>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
}
