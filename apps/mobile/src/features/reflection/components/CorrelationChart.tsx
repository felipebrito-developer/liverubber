import { StyleSheet, View } from "react-native";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { colors, spacing } from "@/theme";

interface LogEntry {
	date: string;
	tasksCompleted: number;
	moodScore: number;
	activities: string[];
}

interface CorrelationChartProps {
	data: LogEntry[];
}

function moodColor(score: number): string {
	if (score >= 4) return colors.success;
	if (score === 3) return colors.secondary;
	if (score === 2) return colors.warning;
	return colors.overdueColor;
}

export function CorrelationChart({ data }: CorrelationChartProps) {
	const maxTasks = Math.max(...data.map((d) => d.tasksCompleted), 1);

	return (
		<Card style={styles.chartCard}>
			<Typography variant="h3">Tasks ↔ Mood Correlation</Typography>
			<Typography
				variant="caption"
				color={colors.muted}
				style={styles.chartSub}
			>
				Each column = one day. Bar = tasks done, dot = mood.
			</Typography>

			<View style={styles.chart}>
				{data
					.slice()
					.reverse()
					.map((entry) => (
						<View key={entry.date} style={styles.chartColumn}>
							<View
								style={[
									styles.moodDot,
									{ backgroundColor: moodColor(entry.moodScore) },
								]}
							/>
							<View style={styles.barTrack}>
								<View
									style={[
										styles.barFill,
										{
											height:
												`${(entry.tasksCompleted / maxTasks) * 100}%` as `${number}%`,
										},
									]}
								/>
							</View>
							<Typography
								variant="caption"
								color={colors.muted}
								style={styles.dayLabel}
							>
								{new Date(`${entry.date}T12:00:00`)
									.toLocaleDateString(undefined, { weekday: "short" })
									.slice(0, 1)}
							</Typography>
						</View>
					))}
			</View>

			<View style={styles.legend}>
				<View style={styles.legendItem}>
					<View
						style={[styles.legendDot, { backgroundColor: colors.primary }]}
					/>
					<Typography variant="caption" color={colors.muted}>
						Tasks completed
					</Typography>
				</View>
				<View style={styles.legendItem}>
					<View
						style={[styles.legendDot, { backgroundColor: colors.success }]}
					/>
					<Typography variant="caption" color={colors.muted}>
						Mood score
					</Typography>
				</View>
			</View>
		</Card>
	);
}

const styles = StyleSheet.create({
	chartCard: {
		marginHorizontal: spacing.xl,
		gap: spacing.md,
	},
	chartSub: {
		marginTop: -spacing.xs,
	},
	chart: {
		flexDirection: "row",
		alignItems: "flex-end",
		height: 100,
		gap: spacing.xs,
		paddingTop: spacing.sm,
	},
	chartColumn: {
		flex: 1,
		alignItems: "center",
		gap: spacing.xs,
		height: "100%",
		justifyContent: "flex-end",
	},
	moodDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	barTrack: {
		width: "100%",
		flex: 1,
		backgroundColor: colors.border,
		borderRadius: 4,
		overflow: "hidden",
		justifyContent: "flex-end",
	},
	barFill: {
		width: "100%",
		backgroundColor: colors.primary,
		borderRadius: 4,
	},
	dayLabel: {
		fontSize: 10,
	},
	legend: {
		flexDirection: "row",
		gap: spacing.md,
	},
	legendItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
	},
	legendDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
});
