import type { Habit, Task } from "@liverubber/shared";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
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
import { logoutAction } from "@/stores/authStore";
import { habitsAtom, loadHabitsAndRewardsAction } from "@/stores/habitsStore";
import {
	isTasksLoadedAtom,
	loadTasksAction,
	tasksAtom,
} from "@/stores/tasksStore";
import { colors, radius, spacing } from "@/theme";

// ─── Energy Level ──────────────────────────────────────────────────────────────

export type EnergyLevel = "low" | "balanced" | "hyperfocus";

export const energyLevelAtom = atom<EnergyLevel>("balanced");

const ENERGY_OPTIONS: {
	key: EnergyLevel;
	label: string;
	description: string;
	color: string;
}[] = [
	{
		key: "low",
		label: "Low Energy",
		description: "Small wins only",
		color: colors.overdueColor,
	},
	{
		key: "balanced",
		label: "Balanced",
		description: "Regular tasks",
		color: colors.primary,
	},
	{
		key: "hyperfocus",
		label: "Hyperfocus",
		description: "Deep work mode",
		color: colors.secondary,
	},
];

// ─── Energy Filter logic ───────────────────────────────────────────────────────
function energyPassesHabit(level: EnergyLevel, habit: Habit) {
	// For now, let's assume low energy only shows habits with low effort or specific tag if we had one
	// Since we don't have a difficulty field in DB yet (it was in the mockup), let's show all or simple ones if name suggests
	if (level === "low") return true;
	return true;
}

function energyPassesTask(level: EnergyLevel, task: Task) {
	if (level === "low")
		return task.priority !== "high" && task.priority !== "urgent";
	if (level === "hyperfocus")
		return task.priority === "high" || task.priority === "urgent";
	return true;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function EnergyToggle({
	value,
	onChange,
}: {
	value: EnergyLevel;
	onChange: (v: EnergyLevel) => void;
}) {
	return (
		<View style={styles.energyRow}>
			{ENERGY_OPTIONS.map((opt) => {
				const active = value === opt.key;
				return (
					<TouchableOpacity
						key={opt.key}
						onPress={() => onChange(opt.key)}
						activeOpacity={0.8}
						style={[
							styles.energyBtn,
							active && { backgroundColor: opt.color, borderColor: opt.color },
						]}
						accessibilityRole="button"
						accessibilityLabel={`${opt.label}: ${opt.description}`}
					>
						<Typography
							variant="label"
							style={{ color: active ? colors.onPrimary : colors.muted }}
						>
							{opt.label}
						</Typography>
						<Typography
							variant="caption"
							style={{ color: active ? colors.onPrimary : colors.muted }}
						>
							{opt.description}
						</Typography>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}

function HabitCard({ habit }: { habit: Habit }) {
	return (
		<Card elevated style={styles.itemCard}>
			<View style={styles.itemRow}>
				<View style={styles.itemInfo}>
					<Typography variant="label">{habit.name}</Typography>
					<Typography variant="caption" color={colors.muted}>
						🔥 {habit.streakCount} day streak
					</Typography>
				</View>
			</View>
		</Card>
	);
}

function TaskCard({ task }: { task: Task }) {
	return (
		<Card elevated style={styles.itemCard}>
			<View style={styles.itemRow}>
				<View style={styles.itemInfo}>
					<Typography variant="label">{task.title}</Typography>
				</View>
				<View
					style={[
						styles.priorityBadge,
						{ borderColor: priorityColor(task.priority) },
					]}
				>
					<Typography
						variant="caption"
						style={{ color: priorityColor(task.priority) }}
					>
						{(task.priority ?? "medium").toUpperCase()}
					</Typography>
				</View>
			</View>
		</Card>
	);
}

function priorityColor(p: string | null): string {
	if (p === "urgent") return colors.overdueColor;
	if (p === "high") return colors.warning;
	if (p === "medium") return colors.secondary;
	return colors.muted;
}

// ─── Screen ────────────────────────────────────────────────────────────────────

export function ActionHubScreen() {
	const [energy, setEnergy] = useAtom(energyLevelAtom);

	const tasks = useAtomValue(tasksAtom);
	const isTasksLoaded = useAtomValue(isTasksLoadedAtom);
	const loadTasks = useSetAtom(loadTasksAction);

	const habits = useAtomValue(habitsAtom);
	const loadHabits = useSetAtom(loadHabitsAndRewardsAction);

	const logout = useSetAtom(logoutAction);

	useEffect(() => {
		if (!isTasksLoaded) {
			loadTasks();
		}
		loadHabits();
	}, [isTasksLoaded, loadTasks, loadHabits]);

	const visibleHabits = habits.filter((h) => energyPassesHabit(energy, h));
	const visibleTasks = tasks.filter((t) => energyPassesTask(energy, t));

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<ScrollView
				contentContainerStyle={styles.scroll}
				showsVerticalScrollIndicator={false}
			>
				{/* Header */}
				<View style={styles.header}>
					<View style={styles.headerRow}>
						<View style={{ flex: 1 }}>
							<Typography variant="h2">Action Hub</Typography>
							<Typography variant="bodySmall" color={colors.muted}>
								How is your energy right now?
							</Typography>
						</View>
						<TouchableOpacity onPress={() => logout()} style={styles.logoutBtn}>
							<Typography variant="caption" color={colors.overdueColor}>
								Logout
							</Typography>
						</TouchableOpacity>
					</View>
				</View>

				{/* Energy Filter */}
				<EnergyToggle value={energy} onChange={setEnergy} />

				{/* Habits Section */}
				<View style={styles.section}>
					<Typography variant="h3" style={styles.sectionTitle}>
						Habits for Today
					</Typography>
					{visibleHabits.length === 0 ? (
						<Typography color={colors.muted} align="center">
							No habits match your energy or none created yet.
						</Typography>
					) : (
						visibleHabits.map((h) => <HabitCard key={h.id} habit={h} />)
					)}
				</View>

				{/* Tasks Section */}
				<View style={styles.section}>
					<Typography variant="h3" style={styles.sectionTitle}>
						Next Tasks
					</Typography>
					{visibleTasks.length === 0 ? (
						<Typography color={colors.muted} align="center">
							No tasks match your current energy or none created yet.
						</Typography>
					) : (
						visibleTasks.map((t) => <TaskCard key={t.id} task={t} />)
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
		gap: spacing.md,
	},
	header: {
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.xl,
		gap: spacing.xs,
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "space-between",
	},
	logoutBtn: {
		padding: spacing.xs,
		borderRadius: radius.sm,
		borderWidth: 1,
		borderColor: colors.overdueColor,
	},
	energyRow: {
		flexDirection: "row",
		paddingHorizontal: spacing.xl,
		gap: spacing.sm,
		marginTop: spacing.sm,
	},
	energyBtn: {
		flex: 1,
		borderWidth: 1.5,
		borderColor: colors.border,
		borderRadius: radius.md,
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.xs,
		alignItems: "center",
		gap: 2,
	},
	section: {
		paddingHorizontal: spacing.xl,
		gap: spacing.sm,
		marginTop: spacing.sm,
	},
	sectionTitle: {
		marginBottom: spacing.xs,
	},
	itemCard: {
		gap: spacing.xs,
	},
	itemRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.md,
	},
	itemInfo: {
		flex: 1,
		gap: 2,
	},
	meaningTag: {
		fontSize: 12,
	},
	difficultyBadge: {
		paddingHorizontal: spacing.sm,
		paddingVertical: 3,
		borderRadius: radius.sm,
		alignSelf: "flex-start",
	},
	priorityBadge: {
		paddingHorizontal: spacing.sm,
		paddingVertical: 3,
		borderRadius: radius.sm,
		borderWidth: 1,
		alignSelf: "flex-start",
	},
});
