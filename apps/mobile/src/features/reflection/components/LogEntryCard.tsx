import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { colors, spacing } from "@/theme";
import { formatDate } from "@/utils";

interface LogEntry {
	date: string;
	tasksCompleted: number;
	moodScore: number;
	activities: string[];
}

interface LogEntryCardProps {
	entry: LogEntry;
	expanded: boolean;
	onToggle: () => void;
}

function moodColor(score: number): string {
	if (score >= 4) return colors.success;
	if (score === 3) return colors.secondary;
	if (score === 2) return colors.warning;
	return colors.overdueColor;
}

function moodEmoji(score: number): string {
	return ["😞", "😕", "😐", "🙂", "😄"][score - 1] ?? "😐";
}

export function LogEntryCard({ entry, expanded, onToggle }: LogEntryCardProps) {
	return (
		<TouchableOpacity onPress={onToggle} activeOpacity={0.85}>
			<Card elevated style={styles.logCard}>
				<View style={styles.logRow}>
					<View style={styles.logLeft}>
						<Typography variant="label">
							{formatDate(`${entry.date}T12:00:00`)}
						</Typography>
						<Typography variant="caption" color={colors.muted}>
							{entry.tasksCompleted} task{entry.tasksCompleted !== 1 ? "s" : ""}{" "}
							completed
						</Typography>
					</View>
					<View style={styles.logRight}>
						<Typography variant="h3">{moodEmoji(entry.moodScore)}</Typography>
						<Typography
							variant="caption"
							style={{ color: moodColor(entry.moodScore) }}
						>
							{entry.moodScore}/5
						</Typography>
					</View>
					<Typography variant="caption" color={colors.muted}>
						{expanded ? "▲" : "▼"}
					</Typography>
				</View>

				{expanded && entry.activities.length > 0 && (
					<View style={styles.activitiesContainer}>
						<View style={styles.divider} />
						<Typography variant="caption" color={colors.muted}>
							Activities logged:
						</Typography>
						{entry.activities.map((a) => (
							<Typography
								key={a}
								variant="bodySmall"
								style={styles.activityItem}
							>
								· {a}
							</Typography>
						))}
					</View>
				)}

				{expanded && entry.activities.length === 0 && (
					<View style={styles.activitiesContainer}>
						<View style={styles.divider} />
						<Typography variant="bodySmall" color={colors.muted}>
							No activities logged this day. That's okay — rest counts too.
						</Typography>
					</View>
				)}
			</Card>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	logCard: {
		gap: spacing.sm,
		marginBottom: spacing.sm,
	},
	logRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.md,
	},
	logLeft: {
		flex: 1,
		gap: 2,
	},
	logRight: {
		alignItems: "center",
		gap: 2,
	},
	activitiesContainer: {
		gap: spacing.xs,
	},
	divider: {
		height: 1,
		backgroundColor: colors.border,
	},
	activityItem: {
		color: colors.onSurface,
	},
});
