import type { NewTask, Task } from "@liverubber/shared";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	ScrollView,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/atoms/Button";
import { FAB } from "@/components/atoms/FAB";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { ScreenHeader } from "@/components/molecules/ScreenHeader";
import type { StrategicTabScreenProps } from "@/navigation/types";
import {
	createTaskAction,
	deleteTaskAction,
	isTasksLoadedAtom,
	loadTasksAction,
	type TaskFilter,
	taskFilterAtom,
	tasksAtom,
	updateTaskAction,
} from "@/stores/tasksStore";
import { colors, radius, spacing } from "@/theme";
import { TaskCreationModal } from "../../components/organisms/TaskCreationModal";

const FILTERS: { key: TaskFilter; label: string }[] = [
	{ key: "all", label: "All" },
	{ key: "todo", label: "To Do" },
	{ key: "in_progress", label: "In Progress" },
	{ key: "done", label: "Done" },
];

function statusColor(status: string | null) {
	switch (status) {
		case "done":
			return colors.success;
		case "in_progress":
			return colors.warning;
		default:
			return colors.muted;
	}
}

function TaskItem({
	task,
	onEdit,
	onDelete,
	onToggleToday,
}: {
	task: Task;
	onEdit: (task: Task) => void;
	onDelete: (task: Task) => void;
	onToggleToday: (task: Task) => void;
}) {
	const status = task.status ?? "todo";
	const isToday = !!task.isForToday;

	return (
		<Card elevated style={styles.taskCard}>
			<View style={styles.taskContent}>
				<View style={styles.taskHeader}>
					<View style={styles.taskTitleContainer}>
						<Typography variant="h3" style={styles.taskTitle}>
							{task.title}
						</Typography>
						{task.goal?.name && (
							<Typography variant="caption" color={colors.primary}>
								Goal: {task.goal.name}
							</Typography>
						)}
					</View>

					<View style={styles.taskActions}>
						<TouchableOpacity
							onPress={() => onToggleToday(task)}
							style={[styles.taskActionBtn, isToday && styles.todayActive]}
						>
							<Typography style={{ fontSize: 14 }}>{isToday ? "🌙" : "☀️"}</Typography>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => onEdit(task)}
							style={styles.taskActionBtn}
						>
							<Typography color={colors.primary}>✎</Typography>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => onDelete(task)}
							style={styles.taskActionBtn}
						>
							<Typography color={colors.error}>✕</Typography>
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.statusRow}>
					<View
						style={[
							styles.statusBadge,
							{ backgroundColor: `${statusColor(status)}20` },
						]}
					>
						<Typography
							variant="caption"
							style={{
								color: statusColor(status),
								fontSize: 10,
								fontWeight: "700",
							}}
						>
							{status.replace("_", " ").toUpperCase()}
						</Typography>
					</View>
					<Typography variant="caption" color={colors.muted}>
						Priority: {(task.priority || "medium").toUpperCase()}
					</Typography>
				</View>

				{task.description ? (
					<Typography
						variant="bodySmall"
						color={colors.muted}
						numberOfLines={2}
						style={styles.taskDesc}
					>
						{task.description}
					</Typography>
				) : null}
			</View>
		</Card>
	);
}

export function TasksScreen({ navigation }: StrategicTabScreenProps<"Tasks">) {
	const [filter, setFilter] = useAtom(taskFilterAtom);
	const tasks = useAtomValue(tasksAtom);
	const isTasksLoaded = useAtomValue(isTasksLoadedAtom);
	const loadTasks = useSetAtom(loadTasksAction);
	const createTask = useSetAtom(createTaskAction);
	const updateTask = useSetAtom(updateTaskAction);
	const deleteTask = useSetAtom(deleteTaskAction);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingTask, setEditingTask] = useState<Task | null>(null);

	useEffect(() => {
		if (!isTasksLoaded) {
			loadTasks();
		}
	}, [isTasksLoaded, loadTasks]);

	const handleSave = async (payload: Omit<NewTask, "id">, tagIds: string[]) => {
		if (editingTask) {
			await updateTask({
				id: editingTask.id,
				data: payload,
				tagIds,
			});
		} else {
			await createTask({ payload, tagIds });
		}

		handleCloseModal();
	};

	const handleEditPress = (task: Task) => {
		setEditingTask(task);
		setIsModalVisible(true);
	};

	const handleDeletePress = (task: Task) => {
		Alert.alert(
			"Prune Task",
			"Are you sure you want to remove this? (You can always add it later if it's still important.)",
			[
				{ text: "Keep it", style: "cancel" },
				{
					text: "Remove",
					style: "destructive",
					onPress: async () => {
						await deleteTask(task.id);
					},
				},
			],
		);
	};

	const handleToggleToday = async (task: Task) => {
		const isToday = !!task.isForToday;
		await updateTask({
			id: task.id,
			data: { isForToday: !isToday },
		});
	};

	const handleCloseModal = () => {
		setIsModalVisible(false);
		setEditingTask(null);
	};

	const filtered =
		filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<ScreenHeader
				title="Backlog"
				subtitle="Strategic task decomposition."
				onDrawerOpen={() => navigation.openDrawer()}
			/>

			{/* Filter Pills */}
			<View style={styles.filterContainer}>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.filterScroll}
				>
					{FILTERS.map((f) => (
						<TouchableOpacity
							key={f.key}
							onPress={() => setFilter(f.key)}
							style={[
								styles.pill,
								filter === f.key ? styles.pillActive : styles.pillInactive,
							]}
						>
							<Typography
								variant="label"
								style={
									filter === f.key
										? { color: colors.onPrimary }
										: { color: colors.muted }
								}
							>
								{f.label}
							</Typography>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>

			{/* Content */}
			{!isTasksLoaded ? (
				<View style={styles.center}>
					<ActivityIndicator color={colors.primary} size="large" />
				</View>
			) : filtered.length === 0 ? (
				<View style={styles.center}>
					<Typography color={colors.muted} align="center">
						{filter === "all"
							? "No tasks yet.\nStart by creating one!"
							: `No tasks with status "${filter}".`}
					</Typography>
					{filter === "all" && (
						<Button
							label="Create Task"
							variant="ghost"
							onPress={() => setIsModalVisible(true)}
							style={{ marginTop: spacing.md }}
						/>
					)}
				</View>
			) : (
				<FlatList
					data={filtered}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<TaskItem
							task={item}
							onEdit={handleEditPress}
							onDelete={handleDeletePress}
							onToggleToday={handleToggleToday}
						/>
					)}
					contentContainerStyle={styles.list}
					showsVerticalScrollIndicator={false}
					ListFooterComponent={<View style={{ height: 100 }} />}
				/>
			)}

			<TaskCreationModal
				visible={isModalVisible}
				onClose={handleCloseModal}
				onSave={handleSave}
				editingTask={editingTask}
			/>

			{/* Floating Action Button */}
			<FAB onPress={() => setIsModalVisible(true)} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
		backgroundColor: colors.background,
	},
	filterContainer: {
		marginBottom: spacing.md,
	},
	filterScroll: {
		paddingHorizontal: spacing.xl,
		gap: spacing.sm,
	},
	pill: {
		height: 38,
		paddingHorizontal: spacing.lg,
		borderRadius: radius.full,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
	},
	pillActive: {
		backgroundColor: colors.primary,
		borderColor: colors.primary,
	},
	pillInactive: {
		backgroundColor: colors.surface,
		borderColor: colors.border,
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: spacing.xl,
	},
	list: {
		paddingHorizontal: spacing.xl,
		paddingBottom: spacing.sm,
		gap: spacing.sm,
	},
	taskContainer: {
		marginBottom: spacing.xs,
	},
	taskCard: {
		padding: spacing.md,
	},
	taskContent: {
		gap: spacing.xs,
	},
	taskHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		gap: spacing.sm,
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: radius.sm,
	},
	taskTitleContainer: {
		flex: 1,
		gap: 2,
	},
	taskTitle: {
		fontSize: 16,
		fontWeight: "600",
	},
	taskActions: {
		flexDirection: "row",
		gap: spacing.xs,
	},
	taskActionBtn: {
		width: 32,
		height: 32,
		borderRadius: radius.sm,
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		justifyContent: "center",
		alignItems: "center",
	},
	todayActive: {
		backgroundColor: colors.warning + "20",
		borderColor: colors.warning,
	},
	statusRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.md,
		marginTop: 2,
	},
	taskDesc: {
		marginTop: spacing.xs,
		opacity: 0.8,
	},
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
	textArea: {
		height: 100,
		textAlignVertical: "top",
	},
	modalActions: {
		flexDirection: "row",
		gap: spacing.sm,
	},
});
