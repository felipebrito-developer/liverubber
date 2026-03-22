import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAtomValue } from "jotai";
import { LoginScreen } from "@/features/auth/LoginScreen";
import { RegisterScreen } from "@/features/auth/RegisterScreen";
import { WelcomeScreen } from "@/features/auth/WelcomeScreen";
import { isAuthenticatedAtom } from "@/stores/authStore";
import { colors } from "@/theme";
import AuthenticatedNavigator from "./AuthenticatedNavigator";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
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
					<Stack.Screen
						name="AppDrawer"
						component={AuthenticatedNavigator}
						options={{ animation: "fade" }}
					/>
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
