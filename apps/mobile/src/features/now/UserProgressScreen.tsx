import type { Task } from "@liverubber/shared";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
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
import { ProgressPizza } from "@/components/molecules/ProgressPizza";
import { ScreenHeader } from "@/components/molecules/ScreenHeader";
import type { FocusTabScreenProps } from "@/navigation/types";
import { goalsAtom } from "@/stores/goalsStore";
import {
	activityLogsAtom,
	loadLogsAction,
	logActivityAction,
} from "@/stores/logsStore";
import { meaningsAtom } from "@/stores/meaningsStore";
import { tasksAtom } from "@/stores/tasksStore";
import { colors, radius, spacing } from "@/theme";

export function UserProgressScreen({
	navigation,
}: FocusTabScreenProps<"UserProgress">) {
	const goals = useAtomValue(goalsAtom);
	const tasks = useAtomValue(tasksAtom);
	const meanings = useAtomValue(meaningsAtom);
	const logs = useAtomValue(activityLogsAtom);
	const loadLogs = useSetAtom(loadLogsAction);
	const logActivity = useSetAtom(logActivityAction);

	const [moodRating, setMoodRating] = useState<number | null>(null);

	useEffect(() => {
		loadLogs();
	}, [loadLogs]);

	// Identity Anchor: becoming the most recently updated Meaning
	const identityMeaning = meanings[0];

	const completedTasks = tasks.filter((t: Task) => t.status === "done").length;

	const totalGoals = goals.length || 1;
	const goalProgress = Math.round((completedTasks / totalGoals) * 100);

	const fitnessTasks = tasks.filter((t: Task) => {
		const taskGoal = goals.find((g) => g.id === t.goalId);
		return taskGoal?.categoryId === "cat-fitness";
	});
	const completedFitness = fitnessTasks.filter(
		(t: Task) => t.status === "done",
	).length;
	const totalFitness = fitnessTasks.length || 1;
	const fitnessProgress = Math.round((completedFitness / totalFitness) * 100);

	const todayTasks = tasks.filter(
		(t: Task) => !!t.isForToday && t.status !== "done",
	);

	const handleMoodSelect = async (n: number) => {
		setMoodRating(n);
		await logActivity({
			activityId: "mood_check",
			moodRating: n,
			amountAchieved: 0,
			completedAt: new Date().toISOString(),
		});
	};

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<ScrollView contentContainerStyle={styles.scroll}>
				<ScreenHeader
					title="Your Progress"
					subtitle="Proof of your trajectory and success."
					onDrawerOpen={() => navigation.openDrawer()}
				/>

				{/* ── Section: DAILY IDENTITY ANCHOR ───────────────────────── */}
				<View style={styles.section}>
					<Typography variant="label" style={styles.microLabel}>
						IDENTITY ANCHOR
					</Typography>
					<Card elevated style={styles.anchorCard}>
						<Typography variant="body" align="center">
							"Today I am becoming:{" "}
							<Typography variant="meaning">
								{identityMeaning?.name || "Auto suficiente"}
							</Typography>
							"
						</Typography>
					</Card>
				</View>

				{/* ── Progress Visualization ───────────────────────────────── */}
				<View style={styles.pizzasRow}>
					<ProgressPizza percentage={goalProgress} label="Goal Progress" />
					<ProgressPizza
						percentage={fitnessProgress}
						label="Fitness Progress"
						color={colors.secondary}
					/>
				</View>

				{/* ── Today's Events Summary ───────────────────────────────── */}
				<View style={styles.section}>
					<Typography variant="label" style={styles.microLabel}>
						TODAY'S EVENTS SUMMARY
					</Typography>
					<Card elevated style={styles.summaryCard}>
						{todayTasks.length === 0 ? (
							<Typography variant="caption" color={colors.muted} align="center">
								No pending events for today.
							</Typography>
						) : (
							todayTasks.slice(0, 3).map((t) => (
								<View key={t.id} style={styles.summaryItem}>
									<Typography variant="bodySmall" style={{ flex: 1 }}>
										• {t.title}
									</Typography>
									{t.estimatedTime && (
										<Typography variant="caption" color={colors.muted}>
											{t.estimatedTime}m
										</Typography>
									)}
								</View>
							))
						)}
					</Card>
				</View>

				{/* ── Section: MOOD TRACKER (Minimalist) ────────────────────── */}
				<View style={styles.section}>
					<Typography variant="label" style={styles.microLabel}>
						CURRENT BASELINE
					</Typography>
					<Card style={styles.moodCard}>
						<Typography variant="bodySmall" color={colors.muted} align="center">
							How is your mental clarity right now?
						</Typography>
						<View style={styles.moodRow}>
							{[1, 2, 3, 4, 5].map((n) => (
								<TouchableOpacity
									key={n}
									onPress={() => handleMoodSelect(n)}
									style={[
										styles.moodBtn,
										moodRating === n && styles.moodBtnActive,
									]}
								>
									<Typography variant="h2">
										{["🌑", "🌘", "🌗", "🌖", "🌕"][n - 1]}
									</Typography>
								</TouchableOpacity>
							))}
						</View>
					</Card>
				</View>

				{/* ── Section: TRAJECTORY SUMMARY ─────────────────────────── */}
				<View style={styles.section}>
					<Typography variant="label" style={styles.microLabel}>
						DAILY TRAJECTORY
					</Typography>
					<Card elevated>
						<View style={styles.trajectoryRow}>
							<View style={styles.statBox}>
								<Typography variant="h3">{completedTasks}</Typography>
								<Typography variant="caption">Wins</Typography>
							</View>
							<View style={styles.statSeparator} />
							<View style={styles.statBox}>
								<Typography variant="h3">{logs.length}</Typography>
								<Typography variant="caption">Logs</Typography>
							</View>
							<View style={styles.statSeparator} />
							<View style={styles.statBox}>
								<Typography variant="h3" color={colors.accent}>
									{totalGoals}
								</Typography>
								<Typography variant="caption">Goals</Typography>
							</View>
						</View>
					</Card>
				</View>

				<View style={[styles.section, { paddingBottom: 40 }]}>
					<Typography variant="label" style={styles.microLabel}>
						LATEST LOGS
					</Typography>
					{logs.length === 0 ? (
						<Typography variant="caption" color={colors.muted} align="center">
							No recent activities logged.
						</Typography>
					) : (
						logs.slice(0, 3).map((log) => (
							<View key={log.id} style={styles.logItem}>
								<Typography variant="bodySmall">
									✦ {log.activityId.replace("_", " ")}
								</Typography>
								<Typography variant="caption" color={colors.muted}>
									{new Date(log.completedAt).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</Typography>
							</View>
						))
					)}
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
	pizzasRow: {
		flexDirection: "row",
		justifyContent: "space-around",
		paddingHorizontal: spacing.xl,
		marginTop: spacing.md,
	},
	pizzaContainer: {
		alignItems: "center",
	},
	pizzaOuter: {
		width: 110,
		height: 110,
		borderRadius: 55,
		backgroundColor: colors.surface,
		borderWidth: 3,
		overflow: "hidden",
		justifyContent: "flex-end",
		alignItems: "center",
		shadowColor: colors.primary,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 10,
		elevation: 8,
	},
	pizzaBase: {
		width: "100%",
		height: "100%",
		backgroundColor: "#2c2c2e", // Darker pizza oven background
		justifyContent: "flex-end",
	},
	pizzaInner: {
		width: "100%",
		opacity: 0.4,
		/** backgroundColor and animated style (height) applied via props */
	},
	pizzaOverlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "transparent",
	},
	toppings: {
		...StyleSheet.absoluteFillObject,
		opacity: 0.15,
	},
	topping: {
		position: "absolute",
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "#fff",
	},
	pizzaText: {
		color: colors.onBackground,
		textShadowColor: "rgba(0,0,0,0.5)",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 3,
	},
	section: {
		paddingHorizontal: spacing.xl,
		gap: spacing.sm,
	},
	microLabel: {
		fontSize: 10,
		letterSpacing: 2,
		color: colors.muted,
		marginBottom: spacing.xs,
	},
	anchorCard: {
		borderColor: colors.accent,
		borderWidth: 1,
		backgroundColor: "rgba(212, 175, 55, 0.05)",
		paddingVertical: spacing.lg,
	},
	moodCard: {
		gap: spacing.md,
		paddingVertical: spacing.md,
	},
	moodRow: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	moodBtn: {
		padding: spacing.sm,
		borderRadius: radius.md,
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
	},
	moodBtnActive: {
		backgroundColor: colors.primary,
		borderColor: colors.primary,
	},
	trajectoryRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: spacing.sm,
	},
	statBox: {
		flex: 1,
		alignItems: "center",
		gap: 2,
	},
	statSeparator: {
		width: 1,
		height: "60%",
		backgroundColor: colors.border,
	},
	logItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: spacing.sm,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	summaryCard: {
		paddingVertical: spacing.md,
		backgroundColor: "rgba(168, 181, 162, 0.05)",
		borderColor: colors.primary,
		borderWidth: 0.5,
	},
	summaryItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		paddingVertical: spacing.xs,
		paddingHorizontal: spacing.sm,
	},
});
