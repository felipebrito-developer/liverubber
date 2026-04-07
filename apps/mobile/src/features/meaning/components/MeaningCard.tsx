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
		<View style={styles.container}>
			<TouchableOpacity
				activeOpacity={0.9}
				onPress={() => setExpanded((v) => !v)}
				onLongPress={() => onLongPress(meaning)}
				accessibilityRole="button"
			>
				<Card elevated={expanded} style={[styles.meaningCard, expanded && styles.cardExpanded]}>
					<View style={styles.meaningHeader}>
						<View
							style={[
								styles.categoryIndicator,
								{
									backgroundColor:
										meaning.category?.categoryColor || colors.primary,
								},
							]}
						/>
						<View style={styles.meaningText}>
							<Typography variant="h3" style={styles.title}>{meaning.name}</Typography>
							<Typography
								variant="bodySmall"
								color={colors.muted}
								numberOfLines={expanded ? undefined : 2}
							>
								{meaning.description}
							</Typography>
						</View>
						<View style={[styles.arrowBg, expanded && styles.arrowBgActive]}>
							<Typography variant="caption" style={expanded ? { color: colors.onPrimary } : { color: colors.muted }}>
								{expanded ? "−" : "+"}
							</Typography>
						</View>
					</View>

					{expanded && (
						<View style={styles.goalsSection}>
							<View style={styles.divider} />
							<View style={styles.goalsHeaderRow}>
								<Typography variant="label" style={styles.goalsLabel}>
									STRATEGIC GOALS ({goals.length})
								</Typography>
								<TouchableOpacity
									onPress={() => onAddGoal(meaning.id)}
									style={styles.inlineAddBtn}
								>
									<Typography variant="label" color={colors.primary}>
										+ NEW
									</Typography>
								</TouchableOpacity>
							</View>
							
							<View style={styles.goalsList}>
								{goals.length === 0 ? (
									<Typography variant="caption" color={colors.muted} align="center" style={styles.emptyText}>
										No goals anchored to this purpose.
									</Typography>
								) : (
									goals.map((g) => (
										<GoalRow key={g.id} goal={g} onLongPress={onGoalLongPress} />
									))
								)}
							</View>
						</View>
					)}
				</Card>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: spacing.md,
	},
	meaningCard: {
		padding: spacing.md,
		borderWidth: 1,
		borderColor: "transparent",
	},
	cardExpanded: {
		borderColor: colors.border,
		backgroundColor: colors.surface,
	},
	meaningHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.md,
	},
	categoryIndicator: {
		width: 4,
		height: 32,
		borderRadius: radius.sm,
	},
	meaningText: {
		flex: 1,
		gap: 2,
	},
	title: {
		fontSize: 18,
		fontWeight: "600",
	},
	arrowBg: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: colors.surface,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: colors.border,
	},
	arrowBgActive: {
		backgroundColor: colors.primary,
		borderColor: colors.primary,
	},
	goalsSection: {
		marginTop: spacing.md,
	},
	goalsHeaderRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginVertical: spacing.sm,
	},
	goalsLabel: {
		letterSpacing: 1,
		opacity: 0.7,
		fontSize: 10,
	},
	inlineAddBtn: {
		padding: 4,
	},
	goalsList: {
		gap: spacing.xs,
	},
	divider: {
		height: 1,
		backgroundColor: colors.border,
		opacity: 0.5,
	},
	emptyText: {
		paddingVertical: spacing.md,
	}
});
