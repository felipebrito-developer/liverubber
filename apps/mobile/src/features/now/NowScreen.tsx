import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
	Alert,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import type { FocusTabScreenProps } from "@/navigation/types";
import { logActivityAction } from "@/stores/logsStore";
import {
	isTasksLoadedAtom,
	loadTasksAction,
	selectedTaskIdAtom,
	tasksAtom,
} from "@/stores/tasksStore";
import { colors, radius, spacing } from "@/theme";
import { PreflightModal } from "./components/PreflightModal";
import { useCountdown } from "./hooks/useCountdown";

export function NowScreen({ navigation }: FocusTabScreenProps<"Now">) {
	const selectedTaskId = useAtomValue(selectedTaskIdAtom);

	const tasks = useAtomValue(tasksAtom);
	const isTasksLoaded = useAtomValue(isTasksLoadedAtom);
	const loadTasks = useSetAtom(loadTasksAction);
	const logActivity = useSetAtom(logActivityAction);

	const [preflightDone, setPreflightDone] = useState(false);
	const [moodRating, setMoodRating] = useState<number | null>(null);
	const [completed, setCompleted] = useState(false);

	useEffect(() => {
		if (!isTasksLoaded) loadTasks();
	}, [isTasksLoaded, loadTasks]);

	const task = tasks.find((t) => t.id === selectedTaskId) || tasks[0];

	const timer = useCountdown(25 * 60); // Default to 25 min pomodoro

	function handleComplete() {
		timer.reset();
		setCompleted(true);
	}

	function handleRecalibrate() {
		Alert.alert(
			"Recalibrate",
			"No problem. What would you like to do?",
			[
				{ text: "Reset timer", onPress: () => timer.reset() },
				{ text: "Change task", style: "cancel" },
				{ text: "Rest — I need a break", style: "destructive" },
			],
			{ cancelable: true },
		);
	}

	if (!task) {
		return (
			<SafeAreaView style={styles.safe}>
				<View style={styles.nowContainer}>
					<Typography variant="h2" align="center">
						No active task
					</Typography>
					<Typography align="center" color={colors.muted}>
						Start by selecting or creating a task in the hub.
					</Typography>
				</View>
			</SafeAreaView>
		);
	}

	if (completed) {
		return (
			<SafeAreaView style={styles.safe}>
				<StatusBar
					barStyle="light-content"
					backgroundColor={colors.background}
				/>
				<View style={styles.completedContainer}>
					<Typography variant="h2" align="center" style={styles.winText}>
						Your future self is proud. 🌿
					</Typography>
					<Typography
						variant="meaning"
						align="center"
						style={styles.meaningAnchor}
					>
						✦ You just finished: {task.title}
					</Typography>

					<Card style={styles.moodCard}>
						<Typography variant="h3" align="center" style={styles.moodTitle}>
							How do you feel now?
						</Typography>
						<View style={styles.moodRow}>
							{[1, 2, 3, 4, 5].map((n) => (
								<TouchableOpacity
									key={n}
									onPress={() => setMoodRating(n)}
									style={[
										styles.moodBtn,
										moodRating === n && styles.moodBtnActive,
									]}
								>
									<Typography
										variant="h3"
										style={{
											color:
												moodRating === n
													? colors.onPrimary
													: colors.onBackground,
										}}
									>
										{["😞", "😕", "😐", "🙂", "😄"][n - 1]}
									</Typography>
									<Typography
										variant="caption"
										style={{
											color: moodRating === n ? colors.onPrimary : colors.muted,
										}}
									>
										{n}
									</Typography>
								</TouchableOpacity>
							))}
						</View>
					</Card>

					{moodRating && (
						<Button
							label="Log & return to Action Hub"
							fullWidth
							onPress={() => {
								logActivity({
									activityId: "manual_focus", // Placeholder
									taskId: task.id,
									moodRating: moodRating || 3,
									amountAchieved: 1.0,
									completedAt: new Date().toISOString(),
								});
								setCompleted(false);
								setMoodRating(null);
								setPreflightDone(false);
							}}
						/>
					)}
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />

			<PreflightModal
				visible={!preflightDone}
				onConfirm={() => setPreflightDone(true)}
			/>

			<View style={styles.nowContainer}>
				{/* Header */}
				<View style={styles.header}>
					<View style={styles.headerRow}>
						<View style={{ flex: 1 }}>
							<Typography variant="h2">Now</Typography>
							<Typography variant="bodySmall" color={colors.muted}>
								Focus on the present moment.
							</Typography>
						</View>
						<TouchableOpacity
							onPress={() => navigation.openDrawer()}
							style={styles.drawerBtn}
						>
							<Typography variant="h3">≡</Typography>
						</TouchableOpacity>
					</View>
				</View>

				{/* Task info */}
				<View style={styles.taskInfo}>
					<Typography variant="h1" align="center" style={styles.taskTitle}>
						{task.title}
					</Typography>
					<Typography variant="body" align="center" color={colors.muted}>
						{task.description}
					</Typography>
				</View>

				{/* Timer display */}
				<View style={styles.timerContainer}>
					<Typography variant="h1" align="center" style={styles.timerText}>
						{timer.display}
					</Typography>

					{/* Visual progress bar — combats Time Blindness */}
					<View style={styles.timerTrack}>
						<View
							style={[styles.timerFill, { width: `${timer.progress * 100}%` }]}
						/>
					</View>
				</View>

				{/* Actions */}
				<View style={styles.actions}>
					<Button
						label={timer.running ? "Pause" : "Start Focus"}
						fullWidth
						onPress={timer.toggle}
					/>
					<Button
						label="Recalibrate"
						variant="outline"
						fullWidth
						onPress={handleRecalibrate}
						style={styles.recalibrateBtn}
					/>
					<Button
						label="Mark Complete ✓"
						variant="ghost"
						fullWidth
						onPress={handleComplete}
					/>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
		backgroundColor: colors.background,
	},
	nowContainer: {
		flex: 1,
		paddingVertical: spacing.xl,
		gap: spacing.xl,
	},
	header: {
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.xs,
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	drawerBtn: {
		width: 44,
		height: 44,
		borderRadius: radius.sm,
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		alignItems: "center",
		justifyContent: "center",
	},
	taskInfo: {
		gap: spacing.xs,
		alignItems: "center",
		paddingHorizontal: spacing.xl,
	},
	taskTitle: {
		marginTop: spacing.sm,
	},
	timerContainer: {
		gap: spacing.lg,
		alignItems: "center",
	},
	timerText: {
		fontSize: 72,
		letterSpacing: 4,
		color: colors.primary,
	},
	timerTrack: {
		width: "100%",
		height: 6,
		backgroundColor: colors.border,
		borderRadius: radius.full,
		overflow: "hidden",
	},
	timerFill: {
		height: "100%",
		backgroundColor: colors.primary,
		borderRadius: radius.full,
	},
	actions: {
		gap: spacing.sm,
	},
	recalibrateBtn: {
		borderColor: colors.muted,
	},
	completedContainer: {
		flex: 1,
		paddingHorizontal: spacing.xl,
		paddingVertical: spacing.xxl,
		justifyContent: "center",
		gap: spacing.xl,
	},
	winText: {
		color: colors.winLoop,
	},
	meaningAnchor: {
		marginTop: -spacing.sm,
	},
	moodCard: {
		gap: spacing.md,
	},
	moodTitle: {
		marginBottom: spacing.xs,
	},
	moodRow: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	moodBtn: {
		alignItems: "center",
		padding: spacing.sm,
		borderRadius: radius.md,
		gap: 4,
		minWidth: 48,
	},
	moodBtnActive: {
		backgroundColor: colors.primary,
	},
});
