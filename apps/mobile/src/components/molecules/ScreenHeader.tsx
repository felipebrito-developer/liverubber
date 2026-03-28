import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Typography } from "@/components/atoms/Typography";
import { colors, radius, spacing } from "@/theme";

interface ScreenHeaderProps {
	title: string;
	subtitle?: string;
	onDrawerOpen: () => void;
}

export function ScreenHeader({
	title,
	subtitle,
	onDrawerOpen,
}: ScreenHeaderProps) {
	return (
		<View style={styles.header}>
			<View style={styles.headerRow}>
				<View style={{ flex: 1 }}>
					<Typography variant="h2">{title}</Typography>
					{subtitle ? (
						<Typography variant="bodySmall" color={colors.muted}>
							{subtitle}
						</Typography>
					) : null}
				</View>
				<TouchableOpacity
					onPress={onDrawerOpen}
					style={styles.drawerBtn}
					accessibilityRole="button"
					accessibilityLabel="Open menu"
				>
					<Typography variant="h3">≡</Typography>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.xl,
		paddingBottom: spacing.md,
		gap: spacing.xs,
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "space-between",
	},
	drawerBtn: {
		width: 44,
		height: 44,
		borderRadius: radius.sm,
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		alignItems: "center",
		justifyContent: "center",
	},
});
