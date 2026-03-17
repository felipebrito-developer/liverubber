import type { AnyType } from "@liverubber/shared";
import { useState } from "react";
import {
	ScrollView,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { colors, radius, spacing } from "@/theme";
import { formatDate } from "@/utils";

// ─── Placeholder data ──────────────────────────────────────────────────────────

interface LogEntry {
	date: string; // ISO date
	tasksCompleted: number;
	moodScore: number; // 1-5
	activities: string[];
}

const LOG_DATA: LogEntry[] = [
	{
		date: "2026-03-05",
		tasksCompleted: 3,
		moodScore: 4,
		activities: ["Morning stretch", "Deep work session"],
	},
	{
		date: "2026-03-04",
		tasksCompleted: 1,
		moodScore: 2,
		activities: ["Gratitude journal"],
	},
	{
		date: "2026-03-03",
		tasksCompleted: 5,
		moodScore: 5,
		activities: ["Cold shower", "Morning stretch", "Deep read"],
	},
	{
		date: "2026-03-02",
		tasksCompleted: 2,
		moodScore: 3,
		activities: ["Morning stretch"],
	},
	{
		date: "2026-03-01",
		tasksCompleted: 4,
		moodScore: 4,
		activities: ["Morning stretch", "30-min deep read"],
	},
	{ date: "2026-02-28", tasksCompleted: 0, moodScore: 1, activities: [] },
	{
		date: "2026-02-27",
		tasksCompleted: 3,
		moodScore: 4,
		activities: ["Morning stretch", "Gratitude journal"],
	},
];

// ─── Mini bar-chart helpers ────────────────────────────────────────────────────

const MAX_TASKS = Math.max(...LOG_DATA.map((d) => d.tasksCompleted), 1);

function moodColor(score: number): string {
	if (score >= 4) return colors.success;
	if (score === 3) return colors.secondary;
	if (score === 2) return colors.warning;
	return colors.overdueColor;
}

function moodEmoji(score: number): string {
	return ["😞", "😕", "😐", "🙂", "😄"][score - 1] ?? "😐";
}

// ─── Correlation bar chart ─────────────────────────────────────────────────────

function CorrelationChart() {
	return (
		<Card style={styles.chartCard}>
			<Typography variant="h3" style={styles.chartTitle}>
				Tasks ↔ Mood Correlation
			</Typography>
			<Typography
				variant="caption"
				color={colors.muted}
				style={styles.chartSub}
			>
				Each column = one day. Green bar = tasks done, dot = mood.
			</Typography>

			<View style={styles.chart}>
				{LOG_DATA.slice()
					.reverse()
					.map((entry) => (
						<View key={entry.date} style={styles.chartColumn}>
							{/* Mood dot */}
							<View
								style={[
									styles.moodDot,
									{ backgroundColor: moodColor(entry.moodScore) },
								]}
							/>

							{/* Task bar */}
							<View style={styles.barTrack}>
								<View
									style={[
										styles.barFill,
										{
											height:
												`${(entry.tasksCompleted / MAX_TASKS) * 100}%` as AnyType,
										},
									]}
								/>
							</View>

							{/* Day label */}
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

// ─── Log Entry Card ────────────────────────────────────────────────────────────

function LogEntryCard({
	entry,
	expanded,
	onToggle,
}: {
	entry: LogEntry;
	expanded: boolean;
	onToggle: () => void;
}) {
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

// ─── Screen ────────────────────────────────────────────────────────────────────

export function ReflectionLogScreen() {
	const [expandedId, setExpandedId] = useState<string | null>(null);

	function toggle(date: string) {
		setExpandedId((prev) => (prev === date ? null : date));
	}

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<ScrollView
				contentContainerStyle={styles.scroll}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.header}>
					<Typography variant="h2">Reflection Log</Typography>
					<Typography variant="bodySmall" color={colors.muted}>
						Action leads to better mood. This is the proof.
					</Typography>
				</View>

				<CorrelationChart />

				<View style={styles.logSection}>
					<Typography variant="h3" style={styles.logSectionTitle}>
						Activity History
					</Typography>
					{LOG_DATA.map((entry) => (
						<LogEntryCard
							key={entry.date}
							entry={entry}
							expanded={expandedId === entry.date}
							onToggle={() => toggle(entry.date)}
						/>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
		backgroundColor: colors.background,
	},
	scroll: {
		paddingBottom: spacing.xl,
		gap: spacing.lg,
	},
	header: {
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.xl,
		gap: spacing.xs,
	},
	// Chart
	chartCard: {
		marginHorizontal: spacing.xl,
		gap: spacing.md,
	},
	chartTitle: {},
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
		borderRadius: radius.full,
	},
	barTrack: {
		width: "100%",
		flex: 1,
		backgroundColor: colors.border,
		borderRadius: radius.sm,
		overflow: "hidden",
		justifyContent: "flex-end",
	},
	barFill: {
		width: "100%",
		backgroundColor: colors.primary,
		borderRadius: radius.sm,
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
		borderRadius: radius.full,
	},
	// Log entries
	logSection: {
		paddingHorizontal: spacing.xl,
		gap: spacing.sm,
	},
	logSectionTitle: {
		marginBottom: spacing.xs,
	},
	logCard: {
		gap: spacing.sm,
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
