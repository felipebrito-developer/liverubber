import type { Habit, Task } from "@liverubber/shared";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "@/components/atoms/Typography";
import { Accordion } from "@/components/molecules/Accordion";
import { ScreenHeader } from "@/components/molecules/ScreenHeader";
import type { FocusTabScreenProps } from "@/navigation/types";
import {
	goalsAtom,
	isGoalsLoadedAtom,
	loadGoalsAction,
} from "@/stores/goalsStore";
import { habitsAtom, loadHabitsAndRewardsAction } from "@/stores/habitsStore";
import {
	isMeaningsLoadedAtom,
	loadMeaningsAction,
	meaningsAtom,
} from "@/stores/meaningsStore";
import {
	isTasksLoadedAtom,
	loadTasksAction,
	selectedTaskIdAtom,
	tasksAtom,
} from "@/stores/tasksStore";
import { colors, spacing } from "@/theme";
import { ActivityCard } from "./components/ActivityCard";
import { EnergyToggle } from "./components/EnergyToggle";
import { PreflightModal } from "./components/PreflightModal";

// ─── Energy Level ──────────────────────────────────────────────────────────────
export type EnergyLevel =
	| "tag-low-energy"
	| "tag-balanced-energy"
	| "tag-high-energy";

type ActivityWithResources = (Task | Habit) & { resources?: string[] };

export const energyLevelAtom = atom<EnergyLevel>("tag-balanced-energy");

/**
 * 🎯 ADHD Filtering Logic:
 * - Urgent tasks always show regardless of energy.
 * - Low energy hides high/medium priority non-urgent tasks.
 */
function activityPassesEnergy(level: EnergyLevel, item: Task | Habit) {
	// If it's a task and urgent, it's always visible
	const task = item as Task;
	if (task.priority === "urgent") return true;

	// If the item has the energy tag explicitly, show it
	const itemTags = (item as Task).tags || [];
	if (itemTags.some((t) => t.id === level)) return true;

	if (level === "tag-low-energy") {
		// Low energy hides High/Medium priority tasks
		const priority = task.priority;
		return priority === "low" || priority === undefined || priority === null;
	}

	if (level === "tag-high-energy") {
		// High energy allows everything
		return true;
	}

	// Balanced allows moderate + low
	return (item as Task).priority !== "high";
}

export function ActionHubScreen({
	navigation,
}: FocusTabScreenProps<"ActionHub">) {
	const [energy, setEnergy] = useAtom(energyLevelAtom);
	const [preflightItem, setPreflightItem] = useState<{
		id: string;
		title: string;
		resources: string[];
	} | null>(null);

	const tasks = useAtomValue(tasksAtom);
	const isTasksLoaded = useAtomValue(isTasksLoadedAtom);
	const loadTasks = useSetAtom(loadTasksAction);
	const setSelectedTaskId = useSetAtom(selectedTaskIdAtom);

	const habits = useAtomValue(habitsAtom);
	const loadHabits = useSetAtom(loadHabitsAndRewardsAction);

	const goals = useAtomValue(goalsAtom);
	const isGoalsLoaded = useAtomValue(isGoalsLoadedAtom);
	const loadGoals = useSetAtom(loadGoalsAction);

	const meanings = useAtomValue(meaningsAtom);
	const isMeaningsLoaded = useAtomValue(isMeaningsLoadedAtom);
	const loadMeanings = useSetAtom(loadMeaningsAction);

	useEffect(() => {
		if (!isTasksLoaded) loadTasks();
		loadHabits();
		if (!isGoalsLoaded) loadGoals();
		if (!isMeaningsLoaded) loadMeanings();
	}, [
		isTasksLoaded,
		loadTasks,
		loadHabits,
		isGoalsLoaded,
		loadGoals,
		isMeaningsLoaded,
		loadMeanings,
	]);

	const handleFocusPress = (id: string) => {
		const activity = [...tasks, ...habits].find((a) => a.id === id) as
			| Task
			| (Habit & { resources?: string[] })
			| undefined;
		if (activity) {
			const isTask = "title" in activity;
			setPreflightItem({
				id: activity.id,
				title: isTask ? (activity as Task).title : (activity as Habit).name,
				resources: (activity as ActivityWithResources).resources || [],
			});
		}
	};

	const startFocusSession = () => {
		if (preflightItem) {
			setSelectedTaskId(preflightItem.id);
			setPreflightItem(null);
			navigation.navigate("Now");
		}
	};

	// ─── Grouping & Filtering Logic ──────────────────────────────────────────
	const filteredTasks = useMemo(
		() =>
			tasks.filter(
				(t) =>
					!!t.isForToday &&
					t.status !== "done" &&
					activityPassesEnergy(energy, t),
			),
		[tasks, energy],
	);

	const filteredHabits = useMemo(
		() => habits.filter((h) => activityPassesEnergy(energy, h)),
		[habits, energy],
	);

	const dailyActivities = useMemo(() => {
		const dailyHabits = filteredHabits.filter(
			(h) =>
				h.frequencyId === "freq-daily" || h.frequencyId === "freq-workdays",
		);
		return [...filteredTasks, ...dailyHabits];
	}, [filteredTasks, filteredHabits]);

	const weeklyHabits = useMemo(
		() => filteredHabits.filter((h) => h.frequencyId === "freq-weekly"),
		[filteredHabits],
	);

	const monthlyHabits = useMemo(
		() => filteredHabits.filter((h) => h.frequencyId === "freq-monthly"),
		[filteredHabits],
	);

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />

			<ScreenHeader
				layout="left"
				title="Action Hub"
				subtitle="Your strategic execution plan for today."
				onDrawerOpen={() => navigation.openDrawer()}
			/>

			{/* Sticky Energy Filter */}
			<View style={styles.stickyFilter}>
				<EnergyToggle value={energy} onChange={setEnergy} />
			</View>

			<ScrollView
				contentContainerStyle={styles.scroll}
				showsVerticalScrollIndicator={false}
			>
				<Accordion title="DAILY ROUTINE" icon="🟢" initialExpanded={true}>
					{dailyActivities.length === 0 ? (
						<Typography
							variant="bodySmall"
							color={colors.muted}
							style={styles.emptyAccordion}
						>
							No activities match your current energy.
						</Typography>
					) : (
						dailyActivities.map((item) => {
							const isTask = "title" in item;
							const task = item as Task;
							const habit = item as Habit;
							return (
								<ActivityCard
									key={item.id}
									activity={item}
									type={isTask ? "task" : "habit"}
									goalName={
										isTask
											? goals.find((g) => g.id === task.goalId)?.name
											: undefined
									}
									meaningName={
										!isTask
											? meanings.find((m) => m.id === habit.meaningId)?.name
											: undefined
									}
									resources={(item as ActivityWithResources).resources}
									onFocus={handleFocusPress}
									onDetails={() => {}}
								/>
							);
						})
					)}
				</Accordion>

				<Accordion title="WEEKLY HABITS" icon="🟠" initialExpanded={false}>
					{weeklyHabits.length === 0 ? (
						<Typography
							variant="bodySmall"
							color={colors.muted}
							style={styles.emptyAccordion}
						>
							No weekly habits scheduled or energetic enough.
						</Typography>
					) : (
						weeklyHabits.map((item) => (
							<ActivityCard
								key={item.id}
								activity={item}
								type="habit"
								meaningName={
									meanings.find((m) => m.id === item.meaningId)?.name
								}
								resources={(item as ActivityWithResources).resources}
								onFocus={handleFocusPress}
								onDetails={() => {}}
							/>
						))
					)}
				</Accordion>

				<Accordion title="MONTHLY CHECK-INS" icon="🔵" initialExpanded={false}>
					{monthlyHabits.length === 0 ? (
						<Typography
							variant="bodySmall"
							color={colors.muted}
							style={styles.emptyAccordion}
						>
							No monthly check-ins for now.
						</Typography>
					) : (
						monthlyHabits.map((item) => (
							<ActivityCard
								key={item.id}
								activity={item}
								type="habit"
								meaningName={
									meanings.find((m) => m.id === item.meaningId)?.name
								}
								resources={(item as ActivityWithResources).resources}
								onFocus={handleFocusPress}
								onDetails={() => {}}
							/>
						))
					)}
				</Accordion>
			</ScrollView>

			<PreflightModal
				visible={!!preflightItem}
				title={preflightItem?.title || ""}
				resources={preflightItem?.resources || []}
				onClose={() => setPreflightItem(null)}
				onConfirm={startFocusSession}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
		backgroundColor: colors.background,
	},
	stickyFilter: {
		zIndex: 10,
		backgroundColor: colors.background,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	scroll: {
		paddingBottom: 120,
		paddingTop: spacing.md,
	},
	emptyAccordion: {
		paddingVertical: spacing.md,
		textAlign: "center",
		fontStyle: "italic",
	},
});
