import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { WIPScreen } from "@/components/organisms/WIPScreen";
import { colors, radius, spacing } from "@/theme";
import type { FitnessTabParamList } from "./types";

const Tab = createBottomTabNavigator<FitnessTabParamList>();

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
	return (
		<Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>{icon}</Text>
	);
}

export function FitnessTabNavigator() {
	return (
		<Tab.Navigator
			initialRouteName="FitnessDashboard"
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: colors.surface,
					borderTopColor: colors.border,
					paddingBottom: spacing.sm,
					paddingTop: spacing.xs,
					height: 60,
				},
				tabBarActiveTintColor: colors.primary,
				tabBarInactiveTintColor: colors.muted,
				tabBarLabelStyle: {
					fontSize: 10,
					fontWeight: "600",
					marginTop: 2,
				},
				tabBarItemStyle: {
					borderRadius: radius.md,
				},
			}}
		>
			<Tab.Screen
				name="FitnessDashboard"
				options={{
					tabBarLabel: "Today",
					tabBarIcon: ({ focused }) => <TabIcon icon="💪" focused={focused} />,
				}}
			>
				{() => <WIPScreen name="Fitness Today" />}
			</Tab.Screen>
			<Tab.Screen
				name="FitnessExecution"
				options={{
					tabBarLabel: "Execute",
					tabBarIcon: ({ focused }) => <TabIcon icon="🏃" focused={focused} />,
				}}
			>
				{() => <WIPScreen name="Fitness Execution" />}
			</Tab.Screen>
			<Tab.Screen
				name="FitnessPlanning"
				options={{
					tabBarLabel: "Plan",
					tabBarIcon: ({ focused }) => <TabIcon icon="📅" focused={focused} />,
				}}
			>
				{() => <WIPScreen name="Fitness Planning" />}
			</Tab.Screen>
		</Tab.Navigator>
	);
}
