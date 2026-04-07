import type { Goal } from "@liverubber/shared";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { colors, radius, spacing } from "@/theme";

interface GoalCardProps {
	goal: Goal;
	onEdit: () => void;
	onDelete: () => void;
}

export function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
	return (
		<Card elevated style={styles.card}>
			<View style={styles.header}>
				<View
					style={[
						styles.statusDot,
						{
							backgroundColor:
								goal.status === "active" ? colors.success : colors.muted,
						},
					]}
				/>
				<View style={styles.titleContainer}>
					<Typography variant="h3" style={styles.name}>
						{goal.name}
					</Typography>
					{goal.meaning?.name && (
						<Typography variant="caption" color={colors.primary}>
							Anchor: {goal.meaning.name}
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

			{goal.description ? (
				<Typography
					variant="bodySmall"
					color={colors.muted}
					style={styles.description}
				>
					{goal.description}
				</Typography>
			) : null}

			<View style={styles.progressSection}>
				<View style={styles.progressHeader}>
					<Typography variant="label">Progress</Typography>
					<Typography variant="label">{goal.progress}%</Typography>
				</View>
				<View style={styles.progressTrack}>
					<View style={[styles.progressFill, { width: `${goal.progress}%` }]} />
				</View>
			</View>
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
	statusDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		marginTop: 6,
	},
	titleContainer: {
		flex: 1,
		gap: 2,
	},
	name: {
		fontSize: 16,
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
		opacity: 0.8,
	},
	progressSection: {
		marginTop: spacing.xs,
		gap: 4,
	},
	progressHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	progressTrack: {
		height: 6,
		backgroundColor: colors.border,
		borderRadius: radius.full,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		backgroundColor: colors.primary,
		borderRadius: radius.full,
	},
});
