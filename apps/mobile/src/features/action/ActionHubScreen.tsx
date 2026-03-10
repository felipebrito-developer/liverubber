import { atom, useAtom } from "jotai";
import {
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
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

// ─── Placeholder data ──────────────────────────────────────────────────────────

interface HabitItem {
	id: string;
	name: string;
	durationMin: number;
	difficulty: "low" | "medium" | "high";
	streakCount: number;
}

interface TaskItem {
	id: string;
	title: string;
	description?: string;
	priority: "low" | "medium" | "high" | "urgent";
	meaningTag?: string;
	difficulty: "low" | "medium" | "high";
}

const HABITS: HabitItem[] = [
	{
		id: "h1",
		name: "Morning stretch",
		durationMin: 5,
		difficulty: "low",
		streakCount: 4,
	},
	{
		id: "h2",
		name: "Gratitude journal",
		durationMin: 10,
		difficulty: "low",
		streakCount: 7,
	},
	{
		id: "h3",
		name: "30-min deep read",
		durationMin: 30,
		difficulty: "medium",
		streakCount: 2,
	},
	{
		id: "h4",
		name: "Cold shower",
		durationMin: 5,
		difficulty: "high",
		streakCount: 1,
	},
];

const TASKS: TaskItem[] = [
	{
		id: "t1",
		title: "Review PR #42",
		priority: "urgent",
		difficulty: "medium",
		meaningTag: "Deep Work",
	},
	{
		id: "t2",
		title: "Write daily note",
		priority: "medium",
		difficulty: "low",
		meaningTag: "Health & Vitality",
	},
	{
		id: "t3",
		title: "Plan sprint backlog",
		priority: "high",
		difficulty: "high",
		meaningTag: "Deep Work",
	},
	{
		id: "t4",
		title: "Call a friend",
		priority: "medium",
		difficulty: "low",
		meaningTag: "Relationships",
	},
];

// ─── Energy Filter logic ───────────────────────────────────────────────────────
function energyPassesHabit(
	level: EnergyLevel,
	difficulty: HabitItem["difficulty"],
) {
	if (level === "low") return difficulty === "low";
	if (level === "hyperfocus") return true;
	return true; // balanced shows all
}

function energyPassesTask(
	level: EnergyLevel,
	difficulty: TaskItem["difficulty"],
) {
	if (level === "low") return difficulty === "low";
	if (level === "hyperfocus")
		return difficulty === "high" || difficulty === "medium";
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

function HabitCard({ habit }: { habit: HabitItem }) {
	return (
		<Card elevated style={styles.itemCard}>
			<View style={styles.itemRow}>
				<View style={styles.itemInfo}>
					<Typography variant="label">{habit.name}</Typography>
					<Typography variant="caption" color={colors.muted}>
						{habit.durationMin} min · 🔥 {habit.streakCount} day streak
					</Typography>
				</View>
				<View
					style={[
						styles.difficultyBadge,
						{ backgroundColor: difficultyColor(habit.difficulty) },
					]}
				>
					<Typography variant="caption" style={{ color: colors.onPrimary }}>
						{habit.difficulty}
					</Typography>
				</View>
			</View>
		</Card>
	);
}

function TaskCard({ task }: { task: TaskItem }) {
	return (
		<Card elevated style={styles.itemCard}>
			<View style={styles.itemRow}>
				<View style={styles.itemInfo}>
					<Typography variant="label">{task.title}</Typography>
					{task.meaningTag ? (
						<Typography variant="meaning" style={styles.meaningTag}>
							✦ {task.meaningTag}
						</Typography>
					) : null}
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
						{task.priority}
					</Typography>
				</View>
			</View>
		</Card>
	);
}

function difficultyColor(d: HabitItem["difficulty"]): string {
	if (d === "low") return colors.success;
	if (d === "medium") return colors.secondary;
	return colors.overdueColor;
}

function priorityColor(p: TaskItem["priority"]): string {
	if (p === "urgent") return colors.overdueColor;
	if (p === "high") return colors.warning;
	if (p === "medium") return colors.secondary;
	return colors.muted;
}

// ─── Screen ────────────────────────────────────────────────────────────────────

export function ActionHubScreen() {
	const [energy, setEnergy] = useAtom(energyLevelAtom);

	const visibleHabits = HABITS.filter((h) =>
		energyPassesHabit(energy, h.difficulty),
	);
	const visibleTasks = TASKS.filter((t) =>
		energyPassesTask(energy, t.difficulty),
	);

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<ScrollView
				contentContainerStyle={styles.scroll}
				showsVerticalScrollIndicator={false}
			>
				{/* Header */}
				<View style={styles.header}>
					<Typography variant="h2">Action Hub</Typography>
					<Typography variant="bodySmall" color={colors.muted}>
						How is your energy right now?
					</Typography>
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
							All habits hidden for low energy mode. Rest is productive too.
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
							No tasks match your current energy. That's okay.
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
