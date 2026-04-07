import type { Habit, Task } from "@liverubber/shared";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import {
	ScrollView,
	StatusBar,
	StyleSheet,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "@/components/atoms/Typography";
import { EmptyState } from "@/components/molecules/EmptyState";
import { ScreenHeader } from "@/components/molecules/ScreenHeader";
import type { FocusTabScreenProps } from "@/navigation/types";
import {
	habitsAtom,
	loadHabitsAndRewardsAction,
} from "@/stores/habitsStore";
import { isTagsLoadedAtom, loadTagsAction, tagsAtom } from "@/stores/tagsStore";
import {
	isTasksLoadedAtom,
	loadTasksAction,
	selectedTaskIdAtom,
	tasksAtom,
} from "@/stores/tasksStore";
import { colors, spacing } from "@/theme";
import { EnergyToggle } from "./components/EnergyToggle";
import { HabitCard } from "./components/HabitCard";
import { TaskCard } from "./components/TaskCard";

// ─── Energy Level ──────────────────────────────────────────────────────────────
export type EnergyLevel =
	| "tag-low-energy"
	| "tag-balanced-energy"
	| "tag-high-energy";

export const energyLevelAtom = atom<EnergyLevel>("tag-balanced-energy");

function energyPassesTask(level: EnergyLevel, task: Task) {
	if (task.tags?.some((t) => t.id === level)) {
		return true;
	}
	if (level === "tag-low-energy") {
		return task.priority !== "urgent" && task.priority !== "high";
	}
	if (level === "tag-high-energy") {
		return task.priority === "urgent" || task.priority === "high";
	}
	return true;
}

export function ActionHubScreen({
	navigation,
}: FocusTabScreenProps<"ActionHub">) {
	const [energy, setEnergy] = useAtom(energyLevelAtom);

	const tasks = useAtomValue(tasksAtom);
	const isTasksLoaded = useAtomValue(isTasksLoadedAtom);
	const loadTasks = useSetAtom(loadTasksAction);
	const setSelectedTaskId = useSetAtom(selectedTaskIdAtom);

	const habits = useAtomValue(habitsAtom);
	const loadHabits = useSetAtom(loadHabitsAndRewardsAction);

	const tags = useAtomValue(tagsAtom);
	const loadTags = useSetAtom(loadTagsAction);
	const isTagsLoaded = useAtomValue(isTagsLoadedAtom);

	useEffect(() => {
		if (!isTasksLoaded) loadTasks();
		loadHabits();
		if (!isTagsLoaded) loadTags();
	}, [
		isTasksLoaded,
		loadTasks,
		loadHabits,
		isTagsLoaded,
		loadTags,
	]);

	const handleFocusPress = (id: string) => {
		setSelectedTaskId(id);
		navigation.navigate("Now");
	};

	const todayTasks = tasks.filter(t => !!t.isForToday && t.status !== "done");
	const visibleTasks = todayTasks.filter((t) => energyPassesTask(energy, t));
	const visibleHabits = habits;

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
				<ScreenHeader
					title="Action Hub"
					subtitle="Your strategic execution plan for today."
					onDrawerOpen={() => navigation.openDrawer()}
				/>

				<EnergyToggle value={energy} onChange={setEnergy} tags={tags} />

				<View style={styles.section}>
					<Typography variant="h3">Habits for Today</Typography>
					{visibleHabits.length === 0 ? (
						<EmptyState
							emoji="⚡"
							title="No habits active"
							subtitle="Habits are the compound interest of self-development."
							ctaLabel="Go to Backlog"
							onCta={() => navigation.navigate("TasksBacklog" as never)}
						/>
					) : (
						visibleHabits.slice(0, 3).map((h) => (
							<HabitCard
								key={h.id}
								habit={h}
								onLongPress={() => {}}
							/>
						))
					)}
				</View>

				<View style={styles.section}>
					<Typography variant="h3" style={styles.sectionTitle}>
						Focus Tasks
					</Typography>
					{visibleTasks.length === 0 ? (
						<EmptyState
							emoji="🎯"
							title={todayTasks.length === 0 ? "No tasks for today" : "Energy Mismatch"}
							subtitle={todayTasks.length === 0 
								? "Promote tasks from your strategic backlog to start focusing." 
								: "None of today's tasks fit your current energy level. Recalibrate?"}
							ctaLabel={todayTasks.length === 0 ? "Open Backlog" : undefined}
							onCta={() => navigation.navigate("TasksBacklog" as never)}
						/>
					) : (
						visibleTasks.map((t) => (
							<TaskCard 
								key={t.id} 
								task={t} 
								onFocus={handleFocusPress}
							/>
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
		paddingBottom: 120,
	},
	section: {
		paddingHorizontal: spacing.xl,
		marginTop: spacing.md,
		gap: spacing.sm,
	},
	sectionTitle: {
		marginBottom: spacing.xs,
	},
});
