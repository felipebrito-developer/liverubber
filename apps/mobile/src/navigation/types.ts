import type {
	BottomTabNavigationProp,
	BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";
import type {
	DrawerNavigationProp,
	DrawerScreenProps,
} from "@react-navigation/drawer";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

// ─── Root stack (auth → main app) ─────────────────────────────────────────────
export type RootStackParamList = {
	Welcome: undefined;
	Login: undefined;
	Register: undefined;
	/** Main authenticated entry point */
	AppDrawer: undefined;
};

// ─── Drawer System ─────────────────────────────────────────────────────────────
export type DrawerParamList = {
	/** Daily focus flow (Tabs) */
	DailyTabs: undefined;
	/** Strategic layer */
	StrategicTabs: undefined;
	/** Logistical layer */
	StoreTabs: undefined;
	/** Proprioception layer */
	FitnessTabs: undefined;
	/** User preferences */
	Settings: undefined;
};

// ─── Module 1: Focus (Daily) ──────────────────────────────────────────────────
export type FocusTabParamList = {
	UserProgress: undefined;
	ActionHub: undefined;
	Now: undefined;
};

// ─── Module 2: Strategic (Goals Management) ───────────────────────────────────
export type StrategicTabParamList = {
	GoalsDashboard: undefined;
	TasksBacklog: undefined;
	GoalsBacklog: undefined;
	Reflection: undefined;
};

// ─── Module 3: Logistics (Store) ──────────────────────────────────────────────
export type StoreTabParamList = {
	StoreDashboard: undefined;
	StoreManagement: undefined;
	StoreAudit: undefined;
};

// ─── Module 4: Proprioception (Fitness) ───────────────────────────────────────
export type FitnessTabParamList = {
	FitnessDashboard: undefined;
	FitnessExecution: undefined;
	FitnessPlanning: undefined;
};

// ─── Root stack typed props ────────────────────────────────────────────────────
export type WelcomeScreenProps = NativeStackScreenProps<
	RootStackParamList,
	"Welcome"
>;
export type LoginScreenProps = NativeStackScreenProps<
	RootStackParamList,
	"Login"
>;
export type RegisterScreenProps = NativeStackScreenProps<
	RootStackParamList,
	"Register"
>;

// ─── Drawer typed props ──────────────────────────────────────────────────────
export type AppDrawerScreenProps<T extends keyof DrawerParamList> =
	DrawerScreenProps<DrawerParamList, T>;

// ─── Composite navigation helper ─────────────────────────────────────────────
// React Navigation v7 introduced a stricter `preload` overload on DrawerNavigationProp
// that breaks CompositeScreenProps' NavigationHelpersCommon constraint.
// We compose using CompositeNavigationProp (navigation only) to avoid it.
type DrawerNavProp<TScreen extends keyof DrawerParamList> =
	DrawerNavigationProp<DrawerParamList, TScreen>;

// ─── Focus Tab typed props ────────────────────────────────────────────────────
export type FocusTabScreenProps<T extends keyof FocusTabParamList> =
	BottomTabScreenProps<FocusTabParamList, T> & {
		navigation: CompositeNavigationProp<
			BottomTabNavigationProp<FocusTabParamList, T>,
			DrawerNavProp<"DailyTabs">
		>;
	};

export type ActionHubScreenProps = FocusTabScreenProps<"ActionHub">;
export type NowScreenProps = FocusTabScreenProps<"Now">;

// ─── Strategic Tab typed props ────────────────────────────────────────────────
export type StrategicTabScreenProps<T extends keyof StrategicTabParamList> =
	BottomTabScreenProps<StrategicTabParamList, T> & {
		navigation: CompositeNavigationProp<
			BottomTabNavigationProp<StrategicTabParamList, T>,
			DrawerNavProp<"StrategicTabs">
		>;
	};

// ─── Logistics Tab typed props ───────────────────────────────────────────────
export type LogisticsTabScreenProps<T extends keyof StoreTabParamList> =
	BottomTabScreenProps<StoreTabParamList, T> & {
		navigation: CompositeNavigationProp<
			BottomTabNavigationProp<StoreTabParamList, T>,
			DrawerNavProp<"StoreTabs">
		>;
	};

// ─── Fitness Tab typed props ──────────────────────────────────────────────────
export type FitnessTabScreenProps<T extends keyof FitnessTabParamList> =
	BottomTabScreenProps<FitnessTabParamList, T> & {
		navigation: CompositeNavigationProp<
			BottomTabNavigationProp<FitnessTabParamList, T>,
			DrawerNavProp<"FitnessTabs">
		>;
	};

// ─── Settings Screen typed props ─────────────────────────────────────────────
export type SettingsScreenProps = AppDrawerScreenProps<"Settings">;
