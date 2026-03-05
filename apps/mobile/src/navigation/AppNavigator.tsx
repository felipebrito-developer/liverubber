import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "@/features/auth/LoginScreen";
import { RegisterScreen } from "@/features/auth/RegisterScreen";

// Screens
import { WelcomeScreen } from "@/features/auth/WelcomeScreen";
import { HomeScreen } from "@/features/tasks/HomeScreen";
import { TasksScreen } from "@/features/tasks/TasksScreen";
import { colors } from "@/theme";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName="Welcome"
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: colors.background },
					animation: "slide_from_right",
				}}
			>
				<Stack.Screen name="Welcome" component={WelcomeScreen} />
				<Stack.Screen name="Login" component={LoginScreen} />
				<Stack.Screen name="Register" component={RegisterScreen} />
				<Stack.Screen name="Home" component={HomeScreen} />
				<Stack.Screen name="Tasks" component={TasksScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
