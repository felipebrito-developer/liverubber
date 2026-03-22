import type { Habit, NewTask, Task } from "@liverubber/shared";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
	Alert,
	Modal,
	ScrollView,
	StatusBar,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/atoms/Button";
import { FAB } from "@/components/atoms/FAB";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { TaskCreationModal } from "@/components/organisms/TaskCreationModal";
import type { FocusTabScreenProps } from "@/navigation/types";
import {
	createHabitAction,
	deleteHabitAction,
	habitsAtom,
	loadHabitsAndRewardsAction,
	updateHabitAction,
} from "@/stores/habitsStore";
import { loadMeaningsAction, meaningsAtom } from "@/stores/meaningsStore";
import { isTagsLoadedAtom, loadTagsAction, tagsAtom } from "@/stores/tagsStore";
import {
	createTaskAction,
	isTasksLoadedAtom,
	loadTasksAction,
	tasksAtom,
} from "@/stores/tasksStore";
import { colors, radius, spacing } from "@/theme";
import { EnergyToggle } from "./components/EnergyToggle";
import { HabitCard } from "./components/HabitCard";
import { TaskCard } from "./components/TaskCard";

// ─── Energy Level ──────────────────────────────────────────────────────────────
export type EnergyLevel =
	| "tag-low-energy"
	| "tag-balanced-energy"
	| "tag-high-energy";

export const energyLevelAtom = atom<EnergyLevel>("tag-balanced-energy");

// ─── Energy Filter logic ───────────────────────────────────────────────────────
function energyPassesHabit(_level: EnergyLevel, _habit: Habit) {
	return true;
}

function energyPassesTask(level: EnergyLevel, task: Task) {
	if (task.tags?.some((t) => t.id === level)) {
		return true;
	}
	if (level === "tag-low-energy")
		return task.priority !== "high" && task.priority !== "urgent";
	if (level === "tag-high-energy")
		return task.priority === "high" || task.priority === "urgent";
	return true;
}

// ─── Screen ────────────────────────────────────────────────────────────────────

export function ActionHubScreen({
	navigation,
}: FocusTabScreenProps<"ActionHub">) {
	const [energy, setEnergy] = useAtom(energyLevelAtom);

	const tasks = useAtomValue(tasksAtom);
	const isTasksLoaded = useAtomValue(isTasksLoadedAtom);
	const loadTasks = useSetAtom(loadTasksAction);
	const createTask = useSetAtom(createTaskAction);

	const habits = useAtomValue(habitsAtom);
	const meanings = useAtomValue(meaningsAtom);
	const loadHabits = useSetAtom(loadHabitsAndRewardsAction);
	const loadMeanings = useSetAtom(loadMeaningsAction);

	const tags = useAtomValue(tagsAtom);
	const loadTags = useSetAtom(loadTagsAction);
	const isTagsLoaded = useAtomValue(isTagsLoadedAtom);

	const createHabit = useSetAtom(createHabitAction);
	const updateHabit = useSetAtom(updateHabitAction);
	const deleteHabit = useSetAtom(deleteHabitAction);

	// Modals State
	const [isHabitModalVisible, setIsHabitModalVisible] = useState(false);
	const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
	const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);

	const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
	const [habitName, setHabitName] = useState("");
	const [meaningId, setMeaningId] = useState<string | null>(null);

	useEffect(() => {
		if (!isTasksLoaded) loadTasks();
		loadHabits();
		loadMeanings();
		if (!isTagsLoaded) loadTags();
	}, [
		isTasksLoaded,
		loadTasks,
		loadHabits,
		loadMeanings,
		isTagsLoaded,
		loadTags,
	]);

	// --- Habit Handlers ---
	const handleSaveHabit = async () => {
		if (!habitName.trim()) return;

		if (editingHabit) {
			await updateHabit({
				id: editingHabit.id,
				data: { name: habitName, meaningId },
			});
		} else {
			await createHabit({
				name: habitName,
				meaningId,
				streakCount: 0,
				startDate: new Date().toISOString(),
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				isSynced: false,
				lastSyncedAt: null,
			});
		}

		handleCloseHabitModal();
	};

	const handleEditHabitPress = (habit: Habit) => {
		setEditingHabit(habit);
		setHabitName(habit.name);
		setMeaningId(habit.meaningId);
		setIsHabitModalVisible(true);
	};

	const handleDeleteHabitPress = (habit: Habit) => {
		Alert.alert(
			"Shelve Habit",
			"Are you sure you want to stop tracking this habit for now?",
			[
				{ text: "Keep it", style: "cancel" },
				{
					text: "Shelve / Remove",
					style: "destructive",
					onPress: async () => {
						await deleteHabit(habit.id);
					},
				},
			],
		);
	};

	const handleHabitOptionsPress = (habit: Habit) => {
		Alert.alert("Habit Options", `Manage your connection to "${habit.name}"`, [
			{ text: "Edit Details", onPress: () => handleEditHabitPress(habit) },
			{
				text: "Archive / Remove",
				style: "destructive",
				onPress: () => handleDeleteHabitPress(habit),
			},
			{ text: "Cancel", style: "cancel" },
		]);
	};

	const handleCloseHabitModal = () => {
		setIsHabitModalVisible(false);
		setEditingHabit(null);
		setHabitName("");
		setMeaningId(null);
	};

	// --- Task Handlers ---
	const handleSaveTask = async (
		payload: Omit<NewTask, "id">,
		selectedTagIds: string[],
	) => {
		await createTask({ payload, tagIds: selectedTagIds });
		setIsTaskModalVisible(false);
	};

	const visibleHabits = habits.filter((h) => energyPassesHabit(energy, h));
	const visibleTasks = tasks.filter((t) => energyPassesTask(energy, t));

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<ScrollView contentContainerStyle={styles.scroll}>
				<View style={styles.header}>
					<View style={styles.headerRow}>
						<View style={{ flex: 1 }}>
							<Typography variant="h2">Action Hub</Typography>
							<Typography variant="bodySmall" color={colors.muted}>
								How is your energy right now?
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

				<EnergyToggle value={energy} onChange={setEnergy} tags={tags} />

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Typography variant="h3">Habits for Today</Typography>
					</View>
					{visibleHabits.length === 0 ? (
						<Typography color={colors.muted} align="center">
							No habits match your energy or none created yet.
						</Typography>
					) : (
						visibleHabits.map((h) => (
							<HabitCard
								key={h.id}
								habit={h}
								onLongPress={handleHabitOptionsPress}
							/>
						))
					)}
				</View>

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

			<FAB
				label="+"
				onPress={() => setIsActionMenuVisible(true)}
				style={styles.fab}
			/>

			{/* Action Menu Modal */}
			<Modal
				visible={isActionMenuVisible}
				transparent
				animationType="fade"
				onRequestClose={() => setIsActionMenuVisible(false)}
			>
				<TouchableOpacity
					style={styles.menuOverlay}
					activeOpacity={1}
					onPress={() => setIsActionMenuVisible(false)}
				>
					<Card style={styles.menuCard}>
						<Typography variant="h3" align="center">
							Quick Action
						</Typography>
						<View style={styles.menuOptions}>
							<Button
								label="⚡ New Habit"
								onPress={() => {
									setIsActionMenuVisible(false);
									setIsHabitModalVisible(true);
								}}
								fullWidth
							/>
							<Button
								label="✅ New Task"
								variant="outline"
								onPress={() => {
									setIsActionMenuVisible(false);
									setIsTaskModalVisible(true);
								}}
								fullWidth
							/>
						</View>
					</Card>
				</TouchableOpacity>
			</Modal>

			{/* Habit Modal */}
			<Modal visible={isHabitModalVisible} animationType="slide" transparent>
				<View style={styles.modalOverlay}>
					<Card style={styles.modalCard}>
						<Typography variant="h3">
							{editingHabit ? "Edit Habit" : "New Habit"}
						</Typography>
						<TextInput
							placeholder="Condition your brain (e.g. Morning Walk)"
							placeholderTextColor={colors.muted}
							value={habitName}
							onChangeText={setHabitName}
							style={styles.input}
						/>

						<Typography variant="label" style={{ marginTop: spacing.sm }}>
							Anchor to Meaning (Optional)
						</Typography>
						<ScrollView horizontal showsHorizontalScrollIndicator={false}>
							<View style={styles.pickerRow}>
								<TouchableOpacity
									onPress={() => setMeaningId(null)}
									style={[
										styles.pickerBtn,
										!meaningId && {
											backgroundColor: colors.muted,
											borderColor: colors.muted,
										},
									]}
								>
									<Typography
										variant="caption"
										style={{
											color: !meaningId
												? colors.onPrimary
												: colors.onBackground,
										}}
									>
										NONE
									</Typography>
								</TouchableOpacity>
								{meanings.map((m) => {
									const active = meaningId === m.id;
									return (
										<TouchableOpacity
											key={m.id}
											onPress={() => setMeaningId(m.id)}
											disabled={active}
											style={[
												styles.pickerBtn,
												active && {
													backgroundColor:
														m.category?.categoryColor || colors.primary,
													borderColor:
														m.category?.categoryColor || colors.primary,
												},
											]}
										>
											<Typography
												variant="caption"
												style={{
													color: active
														? colors.onPrimary
														: colors.onBackground,
												}}
											>
												{m.name}
											</Typography>
										</TouchableOpacity>
									);
								})}
							</View>
						</ScrollView>

						<View style={styles.modalActions}>
							<Button
								label="Cancel"
								variant="outline"
								onPress={handleCloseHabitModal}
								style={{ flex: 1 }}
							/>
							<Button
								label="Save Habit"
								onPress={handleSaveHabit}
								style={{ flex: 1 }}
							/>
						</View>
					</Card>
				</View>
			</Modal>

			{/* Task Modal */}
			<TaskCreationModal
				visible={isTaskModalVisible}
				onClose={() => setIsTaskModalVisible(false)}
				onSave={handleSaveTask}
			/>
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
	},
	header: {
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.xl,
		paddingBottom: spacing.md,
		gap: spacing.xs,
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "space-between",
	},
	drawerBtn: {
		padding: spacing.xs,
		borderRadius: radius.sm,
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		width: 44,
		height: 44,
		alignItems: "center",
		justifyContent: "center",
	},
	section: {
		paddingHorizontal: spacing.xl,
		marginTop: spacing.md,
		gap: spacing.sm,
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	sectionTitle: {
		marginBottom: spacing.xs,
	},
	fab: {
		position: "absolute",
		bottom: spacing.xl,
		right: spacing.xl,
	},
	// Menu styles
	menuOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.6)",
		justifyContent: "center",
		alignItems: "center",
		padding: spacing.xl,
	},
	menuCard: {
		width: "80%",
		gap: spacing.lg,
		paddingVertical: spacing.xl,
	},
	menuOptions: {
		gap: spacing.md,
	},
	// Modal styles
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		padding: spacing.xl,
	},
	modalCard: {
		gap: spacing.md,
	},
	input: {
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.md,
		padding: spacing.md,
		color: colors.onBackground,
	},
	pickerRow: {
		flexDirection: "row",
		gap: spacing.xs,
		paddingBottom: spacing.xs,
	},
	pickerBtn: {
		paddingHorizontal: spacing.md,
		paddingVertical: 6,
		borderRadius: radius.full,
		borderWidth: 1,
		borderColor: colors.border,
	},
	modalActions: {
		flexDirection: "row",
		gap: spacing.sm,
		marginTop: spacing.sm,
	},
});
