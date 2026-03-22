import type { NewTask, Task } from "@liverubber/shared";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, FAB, Typography } from "@/components/atoms";
import { Card } from "@/components/molecules/Card";
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
	onLongPress,
}: {
	task: Task;
	onLongPress: (task: Task) => void;
}) {
	return (
		<TouchableOpacity activeOpacity={0.7} onLongPress={() => onLongPress(task)}>
			<Card elevated style={styles.taskCard}>
				<View style={styles.taskHeader}>
					<View
						style={[
							styles.statusDot,
							{ backgroundColor: statusColor(task.status) },
						]}
					/>
					<Typography variant="label" style={styles.taskTitle}>
						{task.title}
					</Typography>
				</View>
				{task.description ? (
					<Typography
						variant="bodySmall"
						color={colors.muted}
						style={styles.taskDesc}
					>
						{task.description}
					</Typography>
				) : null}
				<Typography variant="caption" style={styles.taskStatus}>
					{(task.status ?? "todo").replace("_", " ").toUpperCase()}
				</Typography>
			</Card>
		</TouchableOpacity>
	);
}

export function TasksScreen({
	navigation,
}: StrategicTabScreenProps<"TasksBacklog">) {
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

	const handleOptionsPress = (task: Task) => {
		Alert.alert(
			"Task Options",
			`What would you like to do with "${task.title}"?`,
			[
				{ text: "Edit", onPress: () => handleEditPress(task) },
				{ text: "Remove / Prune", onPress: () => handleDeletePress(task) },
				{ text: "Cancel", style: "cancel" },
			],
		);
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

			{/* Header */}
			<View style={styles.header}>
				<View style={styles.headerRow}>
					<View style={{ flex: 1 }}>
						<Typography variant="h2">Backlog</Typography>
						<Typography variant="bodySmall" color={colors.muted}>
							Strategic task decomposition.
						</Typography>
					</View>
					<TouchableOpacity
						onPress={() => navigation.openDrawer()}
						style={styles.drawerBtn}
					>
						<Typography variant="h3">≡</Typography>
					</TouchableOpacity>
					<Button
						label="+"
						onPress={() => setIsModalVisible(true)}
						style={styles.addBtn}
					/>
				</View>
			</View>

			{/* Filter Pills */}
			<View style={styles.filterRow}>
				{FILTERS.map((f) => (
					<Button
						key={f.key}
						label={f.label}
						variant={filter === f.key ? "primary" : "outline"}
						onPress={() => setFilter(f.key)}
						style={styles.pill}
					/>
				))}
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
						<TaskItem task={item} onLongPress={handleOptionsPress} />
					)}
					contentContainerStyle={styles.list}
					showsVerticalScrollIndicator={false}
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
	header: {
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.xl,
		paddingBottom: spacing.sm,
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	addBtn: {
		width: 44,
		height: 44,
		borderRadius: radius.full,
	},
	drawerBtn: {
		width: 44,
		height: 44,
		borderRadius: radius.sm,
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		alignItems: "center",
		justifyContent: "center",
		marginRight: spacing.sm,
	},
	filterRow: {
		flexDirection: "row",
		paddingHorizontal: spacing.xl,
		gap: spacing.sm,
		marginBottom: spacing.md,
		flexWrap: "wrap",
	},
	pill: {
		height: 36,
		paddingHorizontal: spacing.sm,
		minWidth: 64,
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: spacing.xl,
	},
	list: {
		paddingHorizontal: spacing.xl,
		paddingBottom: spacing.xl,
		gap: spacing.sm,
	},
	taskCard: {
		gap: spacing.xs,
	},
	taskHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	statusDot: {
		width: 8,
		height: 8,
		borderRadius: radius.full,
	},
	taskTitle: {
		flex: 1,
	},
	taskDesc: {
		marginLeft: spacing.lg,
	},
	taskStatus: {
		marginLeft: spacing.lg,
		letterSpacing: 0.5,
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
