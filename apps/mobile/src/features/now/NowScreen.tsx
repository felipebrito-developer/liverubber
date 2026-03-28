import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
	Alert,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSequence,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { ScreenHeader } from "@/components/molecules/ScreenHeader";
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

	// Win celebration animation
	const celebrateScale = useSharedValue(1);
	const celebrateStyle = useAnimatedStyle(() => ({
		transform: [{ scale: celebrateScale.value }],
	}));

	useEffect(() => {
		if (!isTasksLoaded) loadTasks();
	}, [isTasksLoaded, loadTasks]);

	const task = tasks.find((t) => t.id === selectedTaskId) || tasks[0];

	const timer = useCountdown(25 * 60); // Default to 25 min pomodoro

	function handleComplete() {
		timer.reset();
		setCompleted(true);
		celebrateScale.value = withSequence(
			withSpring(1.08, { damping: 8, stiffness: 300 }),
			withSpring(1, { damping: 12, stiffness: 200 }),
		);
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

	// ── Empty state ───────────────────────────────────────────────────────────
	if (!task) {
		return (
			<SafeAreaView style={styles.safe}>
				<ScreenHeader
					title="Now"
					subtitle="Focus on the present moment."
					onDrawerOpen={() => navigation.openDrawer()}
				/>
				<View style={styles.centeredContainer}>
					<Typography variant="h1" align="center" style={{ fontSize: 48 }}>
						🎯
					</Typography>
					<Typography variant="h3" align="center">
						No task selected yet
					</Typography>
					<Typography align="center" color={colors.muted}>
						Pick a task from the Action Hub to start your focus session.
					</Typography>
					<Button
						label="Go to Action Hub →"
						onPress={() => navigation.navigate("ActionHub" as never)}
						style={styles.emptyStateCta}
					/>
				</View>
			</SafeAreaView>
		);
	}

	// ── Completion / win screen ───────────────────────────────────────────────
	if (completed) {
		return (
			<SafeAreaView style={styles.safe}>
				<StatusBar
					barStyle="light-content"
					backgroundColor={colors.background}
				/>
				<Animated.View style={[styles.completedContainer, celebrateStyle]}>
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
									activityId: "manual_focus",
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
				</Animated.View>
			</SafeAreaView>
		);
	}

	// ── Main focus screen ─────────────────────────────────────────────────────
	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />

			<PreflightModal
				visible={!preflightDone}
				onConfirm={() => setPreflightDone(true)}
			/>

			<View style={styles.nowContainer}>
				<ScreenHeader
					title="Now"
					subtitle="Focus on the present moment."
					onDrawerOpen={() => navigation.openDrawer()}
				/>

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

					{/* Animated progress track — fights time blindness */}
					<View style={styles.timerTrack}>
						<Animated.View
							style={[
								styles.timerFill,
								{
									width: withTiming(
										`${timer.progress * 100}%` as `${number}%`,
										{ duration: 500 },
									),
								},
							]}
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
		gap: spacing.xl,
	},
	centeredContainer: {
		flex: 1,
		paddingHorizontal: spacing.xl,
		justifyContent: "center",
		alignItems: "center",
		gap: spacing.md,
	},
	emptyStateCta: {
		marginTop: spacing.sm,
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
		width: "85%",
		height: 12,
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
		paddingHorizontal: spacing.xl,
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
