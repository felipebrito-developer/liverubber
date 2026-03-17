import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { ActionHubScreen } from "@/features/action/ActionHubScreen";
import { MeaningDashboardScreen } from "@/features/meaning/MeaningDashboardScreen";
import { NowScreen } from "@/features/now/NowScreen";
import { ReflectionLogScreen } from "@/features/reflection/ReflectionLogScreen";
import { ResourcesScreen } from "@/features/resources/ResourcesScreen";
import { colors, radius, spacing } from "@/theme";
import type { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
	return (
		<Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>{icon}</Text>
	);
}

export function MainTabNavigator() {
	return (
		<Tab.Navigator
			initialRouteName="ActionHub"
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
					fontSize: 11,
					fontWeight: "600",
					marginTop: 2,
				},
				tabBarItemStyle: {
					borderRadius: radius.md,
				},
				tabBarIcon: ({ focused }: { focused: boolean }) => (
					<TabIcon icon="⚡" focused={focused} />
				),
			}}
		>
			<Tab.Screen
				name="ActionHub"
				component={ActionHubScreen}
				options={{
					tabBarLabel: "Today",
					tabBarIcon: ({ focused }: { focused: boolean }) => (
						<TabIcon icon="⚡" focused={focused} />
					),
				}}
			/>
			<Tab.Screen
				name="MeaningDashboard"
				component={MeaningDashboardScreen}
				options={{
					tabBarLabel: "Meanings",
					tabBarIcon: ({ focused }: { focused: boolean }) => (
						<TabIcon icon="🌿" focused={focused} />
					),
				}}
			/>
			<Tab.Screen
				name="Now"
				component={NowScreen}
				options={{
					tabBarLabel: "Focus",
					tabBarIcon: ({ focused }: { focused: boolean }) => (
						<TabIcon icon="🎯" focused={focused} />
					),
				}}
			/>
			<Tab.Screen
				name="Resources"
				component={ResourcesScreen}
				options={{
					tabBarLabel: "Assets",
					tabBarIcon: ({ focused }: { focused: boolean }) => (
						<TabIcon icon="💎" focused={focused} />
					),
				}}
			/>
			<Tab.Screen
				name="Reflection"
				component={ReflectionLogScreen}
				options={{
					tabBarLabel: "Reflect",
					tabBarIcon: ({ focused }: { focused: boolean }) => (
						<TabIcon icon="📊" focused={focused} />
					),
				}}
			/>
		</Tab.Navigator>
	);
}
