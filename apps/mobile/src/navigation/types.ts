import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

// ─── Root stack (auth → main app) ─────────────────────────────────────────────
export type RootStackParamList = {
	Welcome: undefined;
	Login: undefined;
	Register: undefined;
	/** Entry point into the main tab app */
	MainTab: undefined;
	// Legacy screens kept for backwards compat during migration
	Home: undefined;
	Tasks: undefined;
};

// ─── Main bottom-tab navigator ─────────────────────────────────────────────────
export type MainTabParamList = {
	/** Entry screen per Neuro-Flow spec */
	ActionHub: undefined;
	MeaningDashboard: undefined;
	Now: undefined;
	Reflection: undefined;
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
export type HomeScreenProps = NativeStackScreenProps<
	RootStackParamList,
	"Home"
>;
export type TasksScreenProps = NativeStackScreenProps<
	RootStackParamList,
	"Tasks"
>;

// ─── Tab typed props ───────────────────────────────────────────────────────────
export type ActionHubScreenProps = BottomTabScreenProps<
	MainTabParamList,
	"ActionHub"
>;
export type MeaningDashboardScreenProps = BottomTabScreenProps<
	MainTabParamList,
	"MeaningDashboard"
>;
export type NowScreenProps = BottomTabScreenProps<MainTabParamList, "Now">;
export type ReflectionScreenProps = BottomTabScreenProps<
	MainTabParamList,
	"Reflection"
>;
