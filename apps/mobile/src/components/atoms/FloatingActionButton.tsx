import { StyleSheet, TouchableOpacity } from "react-native";
import { Typography } from "./Typography";
import { colors, radius, spacing } from "../../theme";

interface FABProps {
	onPress: () => void;
	label?: string;
}

export function FloatingActionButton({ onPress, label = "+" }: FABProps) {
	return (
		<TouchableOpacity
			style={styles.fab}
			onPress={onPress}
			activeOpacity={0.8}
			accessibilityRole="button"
			accessibilityLabel={label === "+" ? "Add new item" : label}
		>
			<Typography variant="h2" style={styles.fabText}>
				{label}
			</Typography>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	fab: {
		position: "absolute",
		bottom: spacing.xl,
		right: spacing.xl,
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: colors.primary,
		justifyContent: "center",
		alignItems: "center",
		elevation: 6,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.3,
		shadowRadius: 4.65,
	},
	fabText: {
		color: colors.onPrimary,
		fontSize: 32,
		lineHeight: 36,
		marginTop: -2,
	},
});
