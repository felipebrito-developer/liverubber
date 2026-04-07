import type { Meaning } from "@liverubber/shared";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { colors, radius, spacing } from "@/theme";

interface MeaningCardProps {
	meaning: Meaning;
	onEdit: () => void;
	onDelete: () => void;
}

export function MeaningCard({ meaning, onEdit, onDelete }: MeaningCardProps) {
	return (
		<Card elevated style={styles.card}>
			<View style={styles.header}>
				<View
					style={[
						styles.indicator,
						{
							backgroundColor:
								meaning.category?.categoryColor || colors.primary,
						},
					]}
				/>
				<View style={styles.content}>
					<Typography variant="h3" style={styles.title}>
						{meaning.name}
					</Typography>
					{meaning.category?.name && (
						<Typography variant="caption" color={colors.muted}>
							Category: {meaning.category.name}
						</Typography>
					)}
				</View>

				<View style={styles.actions}>
					<TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
						<Typography color={colors.primary}>✎</Typography>
					</TouchableOpacity>
					<TouchableOpacity onPress={onDelete} style={styles.actionBtn}>
						<Typography color={colors.error}>✕</Typography>
					</TouchableOpacity>
				</View>
			</View>

			<Typography
				variant="bodySmall"
				color={colors.muted}
				style={styles.description}
			>
				{meaning.description}
			</Typography>
		</Card>
	);
}

const styles = StyleSheet.create({
	card: {
		padding: spacing.md,
		gap: spacing.sm,
	},
	header: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: spacing.sm,
	},
	indicator: {
		width: 4,
		height: 32,
		borderRadius: radius.sm,
		marginTop: 4,
	},
	content: {
		flex: 1,
		gap: 2,
	},
	title: {
		fontSize: 18,
		fontWeight: "600",
	},
	actions: {
		flexDirection: "row",
		gap: spacing.xs,
	},
	actionBtn: {
		width: 32,
		height: 32,
		borderRadius: radius.sm,
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		justifyContent: "center",
		alignItems: "center",
	},
	description: {
		opacity: 0.9,
		lineHeight: 20,
	},
});
