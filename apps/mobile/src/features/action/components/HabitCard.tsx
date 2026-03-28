import type { Habit } from "@liverubber/shared";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { colors, radius, spacing } from "@/theme";

interface HabitCardProps {
	habit: Habit;
	onLongPress: (habit: Habit) => void;
}

/** Habit formation baseline: 21 days to establish a new habit */
const STREAK_GOAL = 21;

export function HabitCard({ habit, onLongPress }: HabitCardProps) {
	const streakProgress = Math.min(habit.streakCount / STREAK_GOAL, 1);
	const streakColor =
		streakProgress >= 1
			? colors.accent
			: streakProgress >= 0.5
				? colors.winLoop
				: colors.primary;

	return (
		<TouchableOpacity
			activeOpacity={0.7}
			onLongPress={() => onLongPress(habit)}
		>
			<Card elevated style={styles.card}>
				<View style={styles.row}>
					<View style={{ flex: 1, gap: 2 }}>
						<Typography variant="label">{habit.name}</Typography>
						<Typography variant="caption" color={colors.muted}>
							🔥 {habit.streakCount} day streak
							{streakProgress >= 1 ? " 🏆" : ` / ${STREAK_GOAL}`}
						</Typography>
					</View>
					{habit.streakCount > 0 && (
						<View style={[styles.streakBadge, { borderColor: streakColor }]}>
							<Typography
								variant="caption"
								style={{ color: streakColor, fontWeight: "700" }}
							>
								{habit.streakCount}🔥
							</Typography>
						</View>
					)}
				</View>

				{/* Streak progress bar — 21-day goal baseline */}
				<View style={styles.track}>
					<View
						style={[
							styles.fill,
							{
								width: `${streakProgress * 100}%` as `${number}%`,
								backgroundColor: streakColor,
							},
						]}
					/>
				</View>
			</Card>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	card: {
		marginBottom: 8,
		gap: spacing.sm,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		gap: 16,
	},
	streakBadge: {
		paddingHorizontal: spacing.xs,
		paddingVertical: 2,
		borderRadius: radius.full,
		borderWidth: 1,
		alignItems: "center",
	},
	track: {
		height: 5,
		backgroundColor: colors.border,
		borderRadius: radius.full,
		overflow: "hidden",
	},
	fill: {
		height: "100%",
		borderRadius: radius.full,
		opacity: 0.85,
	},
});
