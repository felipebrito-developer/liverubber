import type { Goal, Meaning } from "@liverubber/shared";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { colors, radius, spacing } from "@/theme";
import { GoalRow } from "./GoalRow";

interface MeaningCardProps {
	meaning: Meaning;
	goals: Goal[];
	onAddGoal: (meaningId: string) => void;
	onLongPress: (meaning: Meaning) => void;
	onGoalLongPress: (goal: Goal) => void;
}

export function MeaningCard({
	meaning,
	goals,
	onAddGoal,
	onLongPress,
	onGoalLongPress,
}: MeaningCardProps) {
	const [expanded, setExpanded] = useState(false);

	return (
		<View>
			<TouchableOpacity
				activeOpacity={0.85}
				onPress={() => setExpanded((v) => !v)}
				onLongPress={() => onLongPress(meaning)}
				accessibilityRole="button"
				accessibilityLabel={`${meaning.name} — ${expanded ? "collapse" : "expand"} goals`}
			>
				<Card elevated style={styles.meaningCard}>
					{/* Header */}
					<View style={styles.meaningHeader}>
						<View
							style={[
								styles.categoryDot,
								{
									backgroundColor:
										meaning.category?.categoryColor || colors.primary,
								},
							]}
						/>
						<View style={styles.meaningText}>
							<Typography variant="h3">{meaning.name}</Typography>
							<Typography
								variant="bodySmall"
								color={colors.muted}
								style={styles.meaningDesc}
							>
								{meaning.description}
							</Typography>
						</View>
						<Typography variant="caption" color={colors.muted}>
							{expanded ? "▲" : "▼"}
						</Typography>
					</View>

					{/* Accordion — Goals */}
					{expanded && (
						<View style={styles.goalsContainer}>
							<View style={styles.divider} />
							<View style={styles.goalsHeaderRow}>
								<Typography variant="meaning" style={styles.goalsLabel}>
									Goals attached to this meaning
								</Typography>
								<TouchableOpacity
									onPress={() => onAddGoal(meaning.id)}
									style={styles.inlineAddBtn}
								>
									<Typography variant="label" color={colors.primary}>
										+ Add Goal
									</Typography>
								</TouchableOpacity>
							</View>
							{goals.length === 0 ? (
								<Typography variant="caption" color={colors.muted}>
									No goals attached yet.
								</Typography>
							) : (
								goals.map((g) => (
									<GoalRow key={g.id} goal={g} onLongPress={onGoalLongPress} />
								))
							)}
						</View>
					)}
				</Card>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	meaningCard: {
		gap: spacing.sm,
	},
	meaningHeader: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: spacing.md,
	},
	categoryDot: {
		width: 14,
		height: 14,
		borderRadius: radius.full,
		marginTop: 4,
		flexShrink: 0,
	},
	meaningText: {
		flex: 1,
		gap: spacing.xs,
	},
	meaningDesc: {
		lineHeight: 20,
	},
	goalsContainer: {
		gap: spacing.sm,
	},
	goalsHeaderRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: spacing.xs,
	},
	inlineAddBtn: {
		paddingVertical: 4,
		paddingHorizontal: 8,
	},
	divider: {
		height: 1,
		backgroundColor: colors.border,
		marginVertical: spacing.xs,
	},
	goalsLabel: {
		marginBottom: spacing.xs,
	},
});
