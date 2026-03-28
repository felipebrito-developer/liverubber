import { Suspense, lazy } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAtomValue } from "jotai";
import { isAuthenticatedAtom } from "@/stores/authStore";
import { colors } from "@/theme";
import type { RootStackParamList } from "./types";

// ─── Lazy Load Screens to break circular/initialization loops ────────────────
const WelcomeScreen = lazy(() => import("@/features/auth/WelcomeScreen").then(m => ({ default: m.WelcomeScreen })));
const LoginScreen = lazy(() => import("@/features/auth/LoginScreen").then(m => ({ default: m.LoginScreen })));
const RegisterScreen = lazy(() => import("@/features/auth/RegisterScreen").then(m => ({ default: m.RegisterScreen })));
const AuthenticatedNavigator = lazy(() => import("./AuthenticatedNavigator"));

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
	const isAuthenticated = useAtomValue(isAuthenticatedAtom);

	return (
		<NavigationContainer>
			<Suspense fallback={null}>
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
			</Suspense>
		</NavigationContainer>
	);
}
