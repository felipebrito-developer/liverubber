import {
	type StyleProp,
	StyleSheet,
	TouchableOpacity,
	type ViewStyle,
} from "react-native";
import { colors, shadow, spacing } from "../../theme";
import { Typography } from "./Typography";

interface FABProps {
	onPress: () => void;
	icon?: string;
	label?: string;
	style?: StyleProp<ViewStyle>;
	variant?: "primary" | "secondary" | "surface";
}

export function FAB({
	onPress,
	icon = "+",
	label,
	style,
	variant = "primary",
}: FABProps) {
	const backgroundColor =
		variant === "primary"
			? colors.primary
			: variant === "secondary"
				? colors.secondary
				: colors.surface;

	const textColor =
		variant === "primary" || variant === "secondary"
			? colors.onPrimary
			: colors.primary;

	return (
		<TouchableOpacity
			style={[styles.fab, { backgroundColor }, style]}
			onPress={onPress}
			activeOpacity={0.8}
		>
			<Typography variant="h3" style={{ color: textColor }}>
				{icon}
			</Typography>
			{label && (
				<Typography variant="label" style={{ color: textColor }}>
					{label}
				</Typography>
			)}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	fab: {
		position: "absolute",
		bottom: spacing.xl,
		right: spacing.xl,
		minWidth: 56,
		minHeight: 56,
		borderRadius: 28,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: spacing.md,
		gap: spacing.xs,
		...shadow.md,
	},
});
