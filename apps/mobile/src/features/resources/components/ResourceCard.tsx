import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import type { UIResourceStore } from "@/stores/resourcesStore";
import { colors, radius, spacing } from "@/theme";

interface ResourceCardProps {
	store: UIResourceStore;
	onAdjust: (amount: number) => void;
	onLongPress: (store: UIResourceStore) => void;
}

export function ResourceCard({
	store,
	onAdjust,
	onLongPress,
}: ResourceCardProps) {
	return (
		<TouchableOpacity
			activeOpacity={0.8}
			onLongPress={() => onLongPress(store)}
			style={styles.container}
		>
			<Card elevated style={styles.storeCard}>
				<View style={styles.headerRow}>
					<View style={styles.infoWrapper}>
						<Typography variant="h3">{store.name}</Typography>
						{store.categoryId && (
							<View style={styles.categoryPill}>
								<Typography variant="caption" color={colors.muted}>
									{store.categoryId.replace("cat-", "").toUpperCase()}
								</Typography>
							</View>
						)}
					</View>
					<Typography variant="h1" color={colors.primary} style={styles.amount}>
						{store.amount}
					</Typography>
				</View>

				<View style={styles.actionSection}>
					<View style={styles.quickAdjust}>
						<TouchableOpacity
							onPress={() => onAdjust(-1)}
							style={[styles.smallBtn, styles.btnOutline]}
						>
							<Typography variant="h3" color={colors.onSurface} align="center">
								−
							</Typography>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => onAdjust(1)}
							style={[styles.smallBtn, styles.btnPrimary]}
						>
							<Typography variant="h3" color={colors.onPrimary} align="center">
								+
							</Typography>
						</TouchableOpacity>
					</View>
					{/* Space for future details or logs */}
				</View>
			</Card>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: spacing.sm,
	},
	storeCard: {
		padding: spacing.md,
		gap: spacing.sm,
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
	},
	infoWrapper: {
		flex: 1,
		gap: spacing.xs,
	},
	categoryPill: {
		alignSelf: "flex-start",
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.full,
		paddingHorizontal: spacing.sm,
		paddingVertical: 2,
	},
	amount: {
		fontSize: 32,
		fontWeight: "700",
		marginLeft: spacing.md,
	},
	actionSection: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
		marginTop: spacing.xs,
	},
	quickAdjust: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	smallBtn: {
		width: 44,
		height: 44,
		borderRadius: radius.md,
		justifyContent: "center",
		alignItems: "center",
	},
	btnOutline: {
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
	},
	btnPrimary: {
		backgroundColor: colors.primary,
	},
});
