import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import {
	Alert,
	Modal,
	SafeAreaView,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { logActivityAction } from "@/stores/logsStore";
import {
	isTasksLoadedAtom,
	loadTasksAction,
	selectedTaskIdAtom,
	tasksAtom,
} from "@/stores/tasksStore";
import { colors, radius, spacing } from "@/theme";

// ─── Preflight checklist items ─────────────────────────────────────────────────

const PREFLIGHT_ITEMS = [
	"Do you have a quiet space to focus?",
	"Do you have water or a drink nearby?",
	"Have you silenced notifications?",
];

// ─── Preflight Modal ────────────────────────────────────────────────────────────

function PreflightModal({
	visible,
	onConfirm,
}: {
	visible: boolean;
	onConfirm: () => void;
}) {
	const [checked, setChecked] = useState<boolean[]>(
		PREFLIGHT_ITEMS.map(() => false),
	);
	const allChecked = checked.every(Boolean);

	function toggle(i: number) {
		setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
	}

	return (
		<Modal visible={visible} transparent animationType="fade">
			<View style={styles.overlay}>
				<Card style={styles.preflightCard}>
					<Typography variant="h3" align="center">
						Pre-flight Check ✈️
					</Typography>
					<Typography
						variant="bodySmall"
						color={colors.muted}
						align="center"
						style={styles.preflightSub}
					>
						A moment of preparation prevents flow interruptions.
					</Typography>

					<View style={styles.checkList}>
						{PREFLIGHT_ITEMS.map((item, i) => (
							<TouchableOpacity
								key={item}
								onPress={() => toggle(i)}
								style={styles.checkRow}
								activeOpacity={0.8}
								accessibilityRole="checkbox"
								accessibilityState={{ checked: checked[i] }}
							>
								<View
									style={[styles.checkbox, checked[i] && styles.checkboxDone]}
								>
									{checked[i] && (
										<Typography
											variant="caption"
											style={{ color: colors.onPrimary }}
										>
											✓
										</Typography>
									)}
								</View>
								<Typography variant="bodySmall" style={styles.checkLabel}>
									{item}
								</Typography>
							</TouchableOpacity>
						))}
					</View>

					<Button
						label={allChecked ? "Let's go!" : "Check all items first"}
						fullWidth
						disabled={!allChecked}
						onPress={onConfirm}
						style={styles.goBtn}
					/>
				</Card>
			</View>
		</Modal>
	);
}

// ─── Timer ─────────────────────────────────────────────────────────────────────

function useCountdown(durationSec: number) {
	const [remaining, setRemaining] = useState(durationSec);
	const [running, setRunning] = useState(false);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		setRemaining(durationSec);
	}, [durationSec]);

	useEffect(() => {
		if (running) {
			intervalRef.current = setInterval(() => {
				setRemaining((r) => {
					if (r <= 1) {
						clearInterval(intervalRef.current!);
						setRunning(false);
						return 0;
					}
					return r - 1;
				});
			}, 1000);
		}
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [running]);

	function toggle() {
		setRunning((v) => !v);
	}

	function reset() {
		setRunning(false);
		setRemaining(durationSec);
	}

	const minutes = Math.floor(remaining / 60);
	const seconds = remaining % 60;
	const progress = 1 - remaining / durationSec;
	const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

	return { display, running, toggle, reset, progress };
}

// ─── Screen ────────────────────────────────────────────────────────────────────

export function NowScreen() {
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
	// Pre-flight
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.7)",
		justifyContent: "center",
		alignItems: "center",
		padding: spacing.xl,
	},
	preflightCard: {
		width: "100%",
		gap: spacing.md,
	},
	preflightSub: {
		marginTop: spacing.xs,
	},
	checkList: {
		gap: spacing.md,
	},
	checkRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.md,
	},
	checkbox: {
		width: 24,
		height: 24,
		borderRadius: radius.sm,
		borderWidth: 1.5,
		borderColor: colors.border,
		justifyContent: "center",
		alignItems: "center",
	},
	checkboxDone: {
		backgroundColor: colors.primary,
		borderColor: colors.primary,
	},
	checkLabel: {
		flex: 1,
	},
	goBtn: {
		marginTop: spacing.sm,
	},
	// Focus mode
	nowContainer: {
		flex: 1,
		paddingHorizontal: spacing.xl,
		paddingVertical: spacing.xxl,
		justifyContent: "space-between",
		gap: spacing.xl,
	},
	taskInfo: {
		gap: spacing.xs,
		alignItems: "center",
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
	// Completion
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
