import {
	ActivityIndicator,
	StyleSheet,
	TouchableOpacity,
	type TouchableOpacityProps,
	type ViewStyle,
} from "react-native";
import { colors, radius, spacing } from "@/theme";
import { Typography } from "./Typography";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps extends TouchableOpacityProps {
	label: string;
	variant?: ButtonVariant;
	loading?: boolean;
	fullWidth?: boolean;
}

export function Button({
	label,
	variant = "primary",
	loading = false,
	fullWidth = false,
	disabled,
	style,
	...rest
}: ButtonProps) {
	const isDisabled = disabled || loading;

	return (
		<TouchableOpacity
			activeOpacity={0.75}
			disabled={isDisabled}
			style={[
				styles.base,
				styles[variant],
				fullWidth && styles.fullWidth,
				isDisabled && styles.disabled,
				style as ViewStyle,
			]}
			{...rest}
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
		</TouchableOpacity>
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
