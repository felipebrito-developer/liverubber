import { createDrawerNavigator } from "@react-navigation/drawer";
import { GlobalDrawerContent } from "@/components/organisms/GlobalDrawerContent";
import { WIPScreen } from "@/components/organisms/WIPScreen";
import { colors } from "@/theme";
import { DailyTabNavigator } from "./DailyTabNavigator";
import { FitnessTabNavigator } from "./FitnessTabNavigator";
import { StoreTabNavigator } from "./StoreTabNavigator";
import { StrategicTabNavigator } from "./StrategicTabNavigator";
import type { DrawerParamList } from "./types";

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function AuthenticatedNavigator() {
	return (
		<Drawer.Navigator
			drawerContent={(props) => <GlobalDrawerContent {...props} />}
			screenOptions={{
				headerShown: false,
				drawerActiveTintColor: colors.primary,
				drawerInactiveTintColor: colors.muted,
				drawerStyle: {
					backgroundColor: colors.background,
					width: "80%",
				},
				drawerLabelStyle: {
					fontWeight: "600",
				},
			}}
		>
			<Drawer.Screen
				name="DailyTabs"
				component={DailyTabNavigator}
				options={{
					drawerLabel: "Focus (Daily)",
				}}
			/>
			<Drawer.Screen
				name="StrategicTabs"
				component={StrategicTabNavigator}
				options={{ drawerLabel: "Strategic: Goals" }}
			/>
			<Drawer.Screen
				name="StoreTabs"
				component={StoreTabNavigator}
				options={{ drawerLabel: "Logistical: Store" }}
			/>
			<Drawer.Screen
				name="FitnessTabs"
				component={FitnessTabNavigator}
				options={{ drawerLabel: "Proprioception: Fitness" }}
			/>
			<Drawer.Screen
				name="Settings"
				options={{ drawerLabel: "System: Settings" }}
			>
				{() => <WIPScreen name="Settings" />}
			</Drawer.Screen>
		</Drawer.Navigator>
	);
}
