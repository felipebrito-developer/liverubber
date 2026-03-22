import type { Habit, TagType, Task } from "@liverubber/shared";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
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
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { logoutAction } from "@/stores/authStore";
import {
	createHabitAction,
	deleteHabitAction,
	habitsAtom,
	loadHabitsAndRewardsAction,
	updateHabitAction,
} from "@/stores/habitsStore";
import { 
	meaningsAtom, 
	loadMeaningsAction, 
	isMeaningsLoadedAtom 
} from "@/stores/meaningsStore";
import {
	isTasksLoadedAtom,
	loadTasksAction,
	tasksAtom,
} from "@/stores/tasksStore";
import { tagsAtom, loadTagsAction, isTagsLoadedAtom } from "@/stores/tagsStore";
import { colors, radius, spacing } from "@/theme";
import { useEffect } from "react";

// ─── Energy Level ──────────────────────────────────────────────────────────────

export type EnergyLevel = "tag-low-energy" | "tag-balanced-energy" | "tag-high-energy";

export const energyLevelAtom = atom<EnergyLevel>("tag-balanced-energy");

// ─── Energy Filter logic ───────────────────────────────────────────────────────
function energyPassesHabit(level: EnergyLevel, _habit: Habit) {
	return true;
}

function energyPassesTask(level: EnergyLevel, task: Task) {
	// 1. Primary: Check if the task has the explicit energy tag
	if (task.tags && task.tags.some(t => t.id === level)) {
		return true;
	}

	// 2. Secondary: If no relevant energy tag is present, fallback to priority heuristic
	// This helps with legacy tasks or those not specifically tagged.
	if (level === "tag-low-energy")
		return task.priority !== "high" && task.priority !== "urgent";
	if (level === "tag-high-energy")
		return task.priority === "high" || task.priority === "urgent";
	
	// Balanced shows everything unless specifically tagged otherwise
	return true;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function EnergyToggle({
	value,
	onChange,
	tags,
}: {
	value: EnergyLevel;
	onChange: (v: EnergyLevel) => void;
	tags: TagType[];
}) {
	const energyTags = tags.filter(t => t.id.includes("energy"));
	
	return (
		<View style={styles.energyRow}>
			{energyTags.map((tag) => {
				const active = value === tag.id;
				const description = tag.id === "tag-low-energy" ? "Small wins only" : 
				                    tag.id === "tag-balanced-energy" ? "Regular tasks" : "Deep work mode";
				return (
					<TouchableOpacity
						key={tag.id}
						onPress={() => onChange(tag.id as EnergyLevel)}
						activeOpacity={0.8}
						style={[
							styles.energyBtn,
							active && { backgroundColor: tag.colorHex, borderColor: tag.colorHex },
						]}
						accessibilityRole="button"
						accessibilityLabel={`${tag.name}: ${description}`}
					>
						<Typography
							variant="label"
							style={{ color: active ? colors.onPrimary : colors.muted }}
						>
							{tag.name}
						</Typography>
						<Typography
							variant="caption"
							style={{ color: active ? colors.onPrimary : colors.muted }}
						>
							{description}
						</Typography>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}

function HabitCard({
	habit,
	onLongPress,
}: {
	habit: Habit;
	onLongPress: (habit: Habit) => void;
}) {
	return (
		<TouchableOpacity
			activeOpacity={0.7}
			onLongPress={() => onLongPress(habit)}
		>
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
		</TouchableOpacity>
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
	const loadTasks = useSetAtom(loadTasksAction);
	const isTasksLoaded = useAtomValue(isTasksLoadedAtom);

	const habits = useAtomValue(habitsAtom);
	const loadHabits = useSetAtom(loadHabitsAndRewardsAction);
	const createHabit = useSetAtom(createHabitAction);
	const updateHabit = useSetAtom(updateHabitAction);
	const deleteHabit = useSetAtom(deleteHabitAction);
	const meanings = useAtomValue(meaningsAtom);
	const loadMeanings = useSetAtom(loadMeaningsAction);
	const isMeaningsLoaded = useAtomValue(isMeaningsLoadedAtom);
	
	const tags = useAtomValue(tagsAtom);
	const loadTags = useSetAtom(loadTagsAction);
	const isTagsLoaded = useAtomValue(isTagsLoadedAtom);

	const logout = useSetAtom(logoutAction);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
	const [name, setName] = useState("");
	const [meaningId, setMeaningId] = useState<string | null>(null);

	useEffect(() => {
		if (!isTasksLoaded) loadTasks();
		if (!isTagsLoaded) loadTags();
		if (!isMeaningsLoaded) loadMeanings();
		loadHabits(); // Always refresh habits for streak/status
	}, [isTasksLoaded, isTagsLoaded, isMeaningsLoaded, loadTasks, loadTags, loadMeanings, loadHabits]);

	const handleSaveHabit = async () => {
		if (!name.trim()) return;

		if (editingHabit) {
			await updateHabit({
				id: editingHabit.id,
				data: { name, meaningId },
			});
		} else {
			await createHabit({
				name,
				meaningId,
				streakCount: 0,
				startDate: new Date().toISOString(),
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				isSynced: false,
				lastSyncedAt: null,
			});
		}

		handleCloseModal();
	};

	const handleEditPress = (habit: Habit) => {
		setEditingHabit(habit);
		setName(habit.name);
		setMeaningId(habit.meaningId);
		setIsModalVisible(true);
	};

	const handleDeletePress = (habit: Habit) => {
		Alert.alert(
			"Prune Habit",
			"Are you sure you want to let this habit go? You can always reset your routine later.",
			[
				{ text: "Keep it", style: "cancel" },
				{
					text: "Remove",
					style: "destructive",
					onPress: async () => {
						await deleteHabit(habit.id);
					},
				},
			],
		);
	};

	const handleOptionsPress = (habit: Habit) => {
		Alert.alert("Habit Options", `Manage "${habit.name}"`, [
			{ text: "Edit Details", onPress: () => handleEditPress(habit) },
			{
				text: "Archive / Remove",
				style: "destructive",
				onPress: () => handleDeletePress(habit),
			},
			{ text: "Cancel", style: "cancel" },
		]);
	};

	const handleCloseModal = () => {
		setIsModalVisible(false);
		setEditingHabit(null);
		setName("");
		setMeaningId(null);
	};

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
				<EnergyToggle value={energy} onChange={setEnergy} tags={tags} />

				{/* Habits Section */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Typography variant="h3">Habits for Today</Typography>
						<TouchableOpacity
							onPress={() => setIsModalVisible(true)}
							style={styles.addBtnSmall}
						>
							<Typography color={colors.primary}>+ Add</Typography>
						</TouchableOpacity>
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
								onLongPress={handleOptionsPress}
							/>
						))
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

			<Modal visible={isModalVisible} animationType="slide" transparent>
				<View style={styles.modalOverlay}>
					<Card style={styles.modalCard}>
						<Typography variant="h3">
							{editingHabit ? "Edit Habit" : "New Habit"}
						</Typography>
						<TextInput
							placeholder="Condition your brain (e.g. Morning Walk)"
							placeholderTextColor={colors.muted}
							value={name}
							onChangeText={setName}
							style={styles.input}
						/>

						<Typography variant="label" style={{ marginTop: spacing.sm }}>
							Anchor to Meaning (Optional)
						</Typography>
						<ScrollView horizontal showsHorizontalScrollIndicator={false}>
							<View style={styles.meaningPicker}>
								{meanings.map((m) => {
									const active = meaningId === m.id;
									return (
										<TouchableOpacity
											key={m.id}
											onPress={() => setMeaningId(active ? null : m.id)}
											style={[
												styles.meaningTag,
												active && {
													backgroundColor: m.category?.categoryColor || colors.primary,
													borderColor: m.category?.categoryColor || colors.primary,
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
								onPress={handleCloseModal}
								style={{ flex: 1 }}
							/>
							<Button
								label="Save"
								onPress={handleSaveHabit}
								style={{ flex: 1 }}
							/>
						</View>
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
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: spacing.xs,
	},
	addBtnSmall: {
		padding: spacing.xs,
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
		paddingHorizontal: spacing.sm,
		paddingVertical: 4,
		borderRadius: radius.full,
		borderWidth: 1,
		borderColor: colors.border,
		marginRight: spacing.xs,
	},
	meaningPicker: {
		flexDirection: "row",
		marginTop: spacing.xs,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "flex-end",
	},
	modalCard: {
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		paddingBottom: 40,
		gap: spacing.md,
	},
	input: {
		backgroundColor: colors.surface,
		borderRadius: radius.md,
		padding: spacing.md,
		color: colors.onBackground,
		fontSize: 16,
		borderWidth: 1,
		borderColor: colors.border,
	},
	modalActions: {
		flexDirection: "row",
		gap: spacing.md,
		marginTop: spacing.sm,
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
