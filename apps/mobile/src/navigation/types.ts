import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
	Welcome: undefined;
	Login: undefined;
	Register: undefined;
	Home: undefined;
	Tasks: undefined;
};

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
