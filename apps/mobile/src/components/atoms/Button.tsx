import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	type ViewStyle,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { colors, radius, spacing } from "@/theme";
import { Typography } from "./Typography";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps {
	label: string;
	variant?: ButtonVariant;
	loading?: boolean;
	fullWidth?: boolean;
	disabled?: boolean;
	style?: ViewStyle;
	onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
	label,
	variant = "primary",
	loading = false,
	fullWidth = false,
	disabled,
	style,
	onPress,
}: ButtonProps) {
	const isDisabled = disabled || loading;
	const scale = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	return (
		<AnimatedPressable
			onPress={onPress}
			disabled={isDisabled}
			onPressIn={() => {
				scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
			}}
			onPressOut={() => {
				scale.value = withSpring(1, { damping: 15, stiffness: 400 });
			}}
			style={[
				styles.base,
				styles[variant],
				fullWidth && styles.fullWidth,
				isDisabled && styles.disabled,
				style,
				animatedStyle,
			]}
		>
			{loading ? (
				<ActivityIndicator
					color={variant === "primary" ? colors.onPrimary : colors.primary}
					size="small"
				/>
			) : (
				<Typography
					variant="label"
					style={[
						styles.label,
						variant === "outline" || variant === "ghost"
							? { color: colors.primary }
							: { color: colors.onPrimary },
					]}
				>
					{label}
				</Typography>
			)}
		</AnimatedPressable>
	);
}

const styles = StyleSheet.create({
	base: {
		height: 52,
		borderRadius: radius.md,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: spacing.lg,
	},
	primary: {
		backgroundColor: colors.primary,
	},
	secondary: {
		backgroundColor: colors.secondary,
	},
	outline: {
		backgroundColor: "transparent",
		borderWidth: 1.5,
		borderColor: colors.primary,
	},
	ghost: {
		backgroundColor: "transparent",
	},
	fullWidth: {
		width: "100%",
	},
	disabled: {
		opacity: 0.45,
	},
	label: {
		fontWeight: "600",
		letterSpacing: 0.5,
	},
});
