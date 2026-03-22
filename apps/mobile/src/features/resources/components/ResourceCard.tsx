import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import type { UIResourceStore } from "@/stores/resourcesStore";
import { colors, spacing } from "@/theme";

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
		>
			<Card elevated style={styles.storeCard}>
				<View style={styles.storeHeader}>
					<View style={styles.storeInfo}>
						<Typography variant="h3">{store.name}</Typography>
					</View>
					<Typography variant="h2" color={colors.primary}>
						{store.amount}
					</Typography>
				</View>

				<View style={styles.adjustRow}>
					<Button
						label="- 1"
						variant="outline"
						onPress={() => onAdjust(-1)}
						style={styles.adjustBtn}
					/>
					<Button
						label="+ 1"
						variant="primary"
						onPress={() => onAdjust(1)}
						style={styles.adjustBtn}
					/>
				</View>
			</Card>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	storeCard: {
		gap: spacing.md,
		marginBottom: spacing.md,
	},
	storeHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	storeInfo: {
		flex: 1,
	},
	adjustRow: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	adjustBtn: {
		flex: 1,
	},
});
