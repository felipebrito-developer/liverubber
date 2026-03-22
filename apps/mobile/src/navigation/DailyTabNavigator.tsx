import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { ActionHubScreen } from "@/features/action/ActionHubScreen";
import { NowScreen } from "@/features/now/NowScreen";
import { UserProgressScreen } from "@/features/now/UserProgressScreen";
import { colors, radius, spacing } from "@/theme";
import type { FocusTabParamList } from "./types";

const Tab = createBottomTabNavigator<FocusTabParamList>();

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
	return (
		<Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>{icon}</Text>
	);
}

export function DailyTabNavigator() {
	return (
		<Tab.Navigator
			initialRouteName="UserProgress"
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
				name="UserProgress"
				component={UserProgressScreen}
				options={{
					tabBarLabel: "Progress",
					tabBarIcon: ({ focused }) => <TabIcon icon="📈" focused={focused} />,
				}}
			/>
			<Tab.Screen
				name="ActionHub"
				component={ActionHubScreen}
				options={{
					tabBarLabel: "Daily",
					tabBarIcon: ({ focused }) => <TabIcon icon="⚡" focused={focused} />,
				}}
			/>
			<Tab.Screen
				name="Now"
				component={NowScreen}
				options={{
					tabBarLabel: "Focus",
					tabBarIcon: ({ focused }) => <TabIcon icon="🎯" focused={focused} />,
				}}
			/>
		</Tab.Navigator>
	);
}
