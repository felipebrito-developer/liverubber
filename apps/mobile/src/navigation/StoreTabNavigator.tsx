import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { ResourceDashboardScreen } from "@/features/resources/ResourceDashboardScreen";
import { ResourcesScreen } from "@/features/resources/ResourcesScreen";
import { ResourceAuditScreen } from "@/features/resources/ResourceAuditScreen";
import { colors, radius, spacing } from "@/theme";
import type { StoreTabParamList } from "./types";

const Tab = createBottomTabNavigator<StoreTabParamList>();

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
	return (
		<Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>{icon}</Text>
	);
}

export function StoreTabNavigator() {
	return (
		<Tab.Navigator
			initialRouteName="StoreManagement"
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
				name="StoreDashboard"
				component={ResourceDashboardScreen}
				options={{
					tabBarLabel: "Status",
					tabBarIcon: ({ focused }) => <TabIcon icon="📊" focused={focused} />,
				}}
			/>
			<Tab.Screen
				name="StoreManagement"
				component={ResourcesScreen}
				options={{
					tabBarLabel: "Assets",
					tabBarIcon: ({ focused }) => <TabIcon icon="💎" focused={focused} />,
				}}
			/>
			<Tab.Screen
				name="StoreAudit"
				component={ResourceAuditScreen}
				options={{
					tabBarLabel: "Audit",
					tabBarIcon: ({ focused }) => <TabIcon icon="📜" focused={focused} />,
				}}
			/>
		</Tab.Navigator>
	);
}
