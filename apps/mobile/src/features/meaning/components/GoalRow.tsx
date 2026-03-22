import type { Goal } from "@liverubber/shared";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Typography } from "@/components/atoms/Typography";
import { colors, radius, spacing } from "@/theme";

interface GoalRowProps {
	goal: Goal;
	onLongPress: (goal: Goal) => void;
}

export function GoalRow({ goal, onLongPress }: GoalRowProps) {
	return (
		<TouchableOpacity activeOpacity={0.7} onLongPress={() => onLongPress(goal)}>
			<View style={styles.goalRow}>
				<View style={styles.goalHeader}>
					<View
						style={[
							styles.goalDot,
							{
								backgroundColor:
									goal.status === "active" ? colors.success : colors.muted,
							},
						]}
					/>
					<Typography variant="bodySmall" style={styles.goalName}>
						{goal.name}
					</Typography>
					<Typography variant="caption" color={colors.muted}>
						{goal.progress}%
					</Typography>
				</View>
				{/* Progress bar */}
				<View style={styles.progressTrack}>
					<View style={[styles.progressFill, { width: `${goal.progress}%` }]} />
				</View>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	goalRow: {
		gap: spacing.xs,
		marginBottom: spacing.xs,
	},
	goalHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	goalDot: {
		width: 7,
		height: 7,
		borderRadius: radius.full,
	},
	goalName: {
		flex: 1,
	},
	progressTrack: {
		height: 4,
		backgroundColor: colors.border,
		borderRadius: radius.full,
		marginLeft: spacing.lg,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		backgroundColor: colors.primary,
		borderRadius: radius.full,
	},
});
