import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
	Alert,
	Modal,
	ScrollView,
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
	updateTaskAction,
} from "@/stores/tasksStore";
import { colors, radius, spacing } from "@/theme";
import { PreflightModal } from "./components/PreflightModal";
import { useCountdown } from "./hooks/useCountdown";

export function NowScreen({ navigation }: FocusTabScreenProps<"Now">) {
	const selectedTaskId = useAtomValue(selectedTaskIdAtom);
	const setSelectedTaskId = useSetAtom(selectedTaskIdAtom);
	const tasks = useAtomValue(tasksAtom);
	const isTasksLoaded = useAtomValue(isTasksLoadedAtom);
	const loadTasks = useSetAtom(loadTasksAction);
	const logActivity = useSetAtom(logActivityAction);
	const updateTask = useSetAtom(updateTaskAction);

	const [preflightDone, setPreflightDone] = useState(false);
	const [moodRating, setMoodRating] = useState<number | null>(null);
	const [completed, setCompleted] = useState(false);
	const [isPickerVisible, setIsPickerVisible] = useState(false);

	// Filter tasks for today that aren't done
	const todayTasks = tasks.filter(t => !!t.isForToday && t.status !== "done");

	// Win celebration animation
	const celebrateScale = useSharedValue(1);
	const celebrateStyle = useAnimatedStyle(() => ({
		transform: [{ scale: celebrateScale.value }],
	}));

	useEffect(() => {
		if (!isTasksLoaded) loadTasks();
	}, [isTasksLoaded, loadTasks]);

	const task = tasks.find((t) => t.id === selectedTaskId) || todayTasks[0];

	const timer = useCountdown(25 * 60); // Default to 25 min pomodoro

	function handleComplete() {
		timer.reset();
		setCompleted(true);
		celebrateScale.value = withSequence(
			withSpring(1.08, { damping: 8, stiffness: 300 }),
			withSpring(1, { damping: 12, stiffness: 200 }),
		);
	}

	async function handleLogAndFinish() {
		if (!task) return;
		
		await logActivity({
			activityId: "manual_focus",
			taskId: task.id,
			moodRating: moodRating || 3,
			amountAchieved: 1.0,
			completedAt: new Date().toISOString(),
		});

		// Mark task as done
		await updateTask({
			id: task.id,
			data: { status: "done" }
		});

		setCompleted(false);
		setMoodRating(null);
		setPreflightDone(false);
		navigation.navigate("ActionHub");
	}

	function handleRecalibrate() {
		Alert.alert(
			"Recalibrate",
			"No problem. What would you like to do?",
			[
				{ text: "Reset timer", onPress: () => timer.reset() },
				{ text: "Choose different task", onPress: () => setIsPickerVisible(true) },
				{ text: "Rest — I need a break", style: "destructive", onPress: () => navigation.navigate("ActionHub") },
			],
			{ cancelable: true },
		);
	}

	// ── Empty state ───────────────────────────────────────────────────────────
	if (!task) {
		return (
			<SafeAreaView style={styles.safe}>
				<ScreenHeader
					title="Focus"
					subtitle="Strategic presence."
					onDrawerOpen={() => navigation.openDrawer()}
				/>
				<View style={styles.centeredContainer}>
					<Typography variant="h1" align="center" style={{ fontSize: 48 }}>
						🎯
					</Typography>
					<Typography variant="h3" align="center">
						No task selected
					</Typography>
					<Typography align="center" color={colors.muted}>
						Promote a task from the backlog to "Today" in the Action Hub to start focusing.
					</Typography>
					<Button
						label="Go to Action Hub →"
						onPress={() => navigation.navigate("ActionHub")}
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
						Flow Accomplished. 🌿
					</Typography>
					<Typography
						variant="meaning"
						align="center"
						style={styles.meaningAnchor}
					>
						✦ {task.title}
					</Typography>

					<Card style={styles.moodCard}>
						<Typography variant="h3" align="center" style={styles.moodTitle}>
							Rate your mental clarity:
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
							label="Log Win & Continue"
							fullWidth
							onPress={handleLogAndFinish}
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
					title="Focus"
					subtitle="Protect your attention."
					onDrawerOpen={() => navigation.openDrawer()}
				/>

				{/* Task info w/ Change button */}
				<View style={styles.taskInfoContainer}>
					<TouchableOpacity 
						style={styles.taskSelector} 
						onPress={() => setIsPickerVisible(true)}
						activeOpacity={0.7}
					>
						<Typography variant="caption" color={colors.primary} style={styles.selectorLabel}>
							TARGETING:
						</Typography>
						<Typography variant="h2" align="center" style={styles.taskTitle}>
							{task.title}
						</Typography>
						<Typography variant="caption" color={colors.muted}>
							Tap to switch task (Today's Plan)
						</Typography>
					</TouchableOpacity>
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
						label={timer.running ? "Hold" : "Engage Focus"}
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
						label="Mission Accomplished ✓"
						variant="ghost"
						fullWidth
						onPress={handleComplete}
					/>
				</View>
			</View>

			{/* Task Picker Modal */}
			<Modal visible={isPickerVisible} transparent animationType="slide">
				<View style={styles.modalOverlay}>
					<Card style={styles.pickerCard}>
						<Typography variant="h3">Shift Focus</Typography>
						<Typography variant="bodySmall" color={colors.muted}>
							Which task from your daily plan will you tackle next?
						</Typography>
						
						<ScrollView style={styles.pickerList}>
							{todayTasks.map((t) => (
								<TouchableOpacity 
									key={t.id}
									style={[
										styles.pickerItem, 
										t.id === task.id && styles.pickerItemActive
									]}
									onPress={() => {
										setSelectedTaskId(t.id);
										setIsPickerVisible(false);
									}}
								>
									<Typography style={t.id === task.id ? { color: colors.onPrimary } : {}}>
										{t.title}
									</Typography>
								</TouchableOpacity>
							))}
						</ScrollView>
						
						<Button label="Close" onPress={() => setIsPickerVisible(false)} variant="outline" />
					</Card>
				</View>
			</Modal>
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
	taskInfoContainer: {
		paddingHorizontal: spacing.xl,
		alignItems: "center",
	},
	taskSelector: {
		alignItems: "center",
		backgroundColor: colors.surface,
		padding: spacing.lg,
		borderRadius: radius.md,
		width: "100%",
		borderWidth: 1,
		borderColor: colors.border,
	},
	selectorLabel: {
		fontWeight: "bold",
		letterSpacing: 2,
		marginBottom: spacing.xs,
	},
	taskTitle: {
		marginBottom: 4,
	},
	timerContainer: {
		gap: spacing.lg,
		alignItems: "center",
	},
	timerText: {
		fontSize: 84, // Even bigger for focus
		fontWeight: "200", // Sleeker, more premium look
		letterSpacing: 4,
		color: colors.primary,
	},
	timerTrack: {
		width: "75%",
		height: 8,
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
		marginTop: "auto",
		paddingBottom: 40,
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
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.6)",
		justifyContent: "flex-end",
	},
	pickerCard: {
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		paddingTop: spacing.xl,
		paddingBottom: 40,
		gap: spacing.md,
		maxHeight: "70%",
	},
	pickerList: {
		marginTop: spacing.sm,
	},
	pickerItem: {
		padding: spacing.md,
		borderRadius: radius.md,
		marginBottom: spacing.xs,
		borderWidth: 1,
		borderColor: colors.border,
	},
	pickerItemActive: {
		backgroundColor: colors.primary,
		borderColor: colors.primary,
	},
});
