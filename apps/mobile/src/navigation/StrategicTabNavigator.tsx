import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { WIPScreen } from "@/components/organisms/WIPScreen";
import { MeaningDashboardScreen } from "@/features/meaning/MeaningDashboardScreen";
import { ReflectionLogScreen } from "@/features/reflection/ReflectionLogScreen";
import { TasksScreen } from "@/features/tasks/TasksScreen";
import { colors, radius, spacing } from "@/theme";
import type { StrategicTabParamList } from "./types";

const Tab = createBottomTabNavigator<StrategicTabParamList>();

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
	return (
		<Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>{icon}</Text>
	);
}

export function StrategicTabNavigator() {
	return (
		<Tab.Navigator
			initialRouteName="GoalsDashboard"
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
				name="GoalsDashboard"
				component={MeaningDashboardScreen}
				options={{
					tabBarLabel: "Goals",
					tabBarIcon: ({ focused }) => <TabIcon icon="🎯" focused={focused} />,
				}}
			/>
			<Tab.Screen
				name="TasksBacklog"
				component={TasksScreen}
				options={{
					tabBarLabel: "Tasks",
					tabBarIcon: ({ focused }) => <TabIcon icon="📋" focused={focused} />,
				}}
			/>

			<Tab.Screen
				name="GoalsBacklog"
				options={{
					tabBarLabel: "Audit",
					tabBarIcon: ({ focused }) => <TabIcon icon="🔍" focused={focused} />,
				}}
			>
				{() => <WIPScreen name="Goals Backlog" />}
			</Tab.Screen>
			<Tab.Screen
				name="Reflection"
				component={ReflectionLogScreen}
				options={{
					tabBarLabel: "Reflect",
					tabBarIcon: ({ focused }) => <TabIcon icon="🧘" focused={focused} />,
				}}
			/>
		</Tab.Navigator>
	);
}
