import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import type { UIResourceStore } from "@/stores/resourcesStore";
import { colors, radius, spacing } from "@/theme";

interface StorageItemCardProps {
	store: UIResourceStore;
	onAdjust: (amount: number) => void;
	onEdit: () => void;
}

export function StorageItemCard({
	store,
	onAdjust,
	onEdit,
}: StorageItemCardProps) {
	return (
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
				<View style={styles.amountContainer}>
					<Typography variant="h1" color={colors.primary} style={styles.amount}>
						{store.amount}
					</Typography>
				</View>
			</View>

			<View style={styles.actionSection}>
				<TouchableOpacity
					onPress={onEdit}
					style={[styles.smallBtn, styles.btnOutline]}
				>
					<Typography variant="h3">✎</Typography>
				</TouchableOpacity>

				<View style={styles.quickAdjust}>
					<TouchableOpacity
						onPress={() => onAdjust(-1)}
						style={[styles.smallBtn, styles.btnOutline]}
					>
						<Typography variant="h2" color={colors.onSurface} align="center">
							−
						</Typography>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => onAdjust(1)}
						style={[styles.smallBtn, styles.btnPrimary]}
					>
						<Typography variant="h2" color={colors.onPrimary} align="center">
							+
						</Typography>
					</TouchableOpacity>
				</View>
			</View>
		</Card>
	);
}

const styles = StyleSheet.create({
	storeCard: {
		padding: spacing.md,
		gap: spacing.sm,
		marginBottom: spacing.xs,
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
	amountContainer: {
		alignItems: "flex-end",
	},
	amount: {
		fontSize: 36,
		fontWeight: "800",
		lineHeight: 40,
	},
	actionSection: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: spacing.sm,
		paddingTop: spacing.sm,
		borderTopWidth: 1,
		borderTopColor: colors.border,
	},
	quickAdjust: {
		flexDirection: "row",
		gap: spacing.md,
	},
	smallBtn: {
		width: 50,
		height: 50,
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
		elevation: 4,
		shadowColor: colors.primary,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
	},
});
