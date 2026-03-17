import type { Task } from "@liverubber/shared";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Modal,
	StatusBar,
	StyleSheet,
	TextInput,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import type { TasksScreenProps } from "@/navigation/types";
import {
	createTaskAction,
	isTasksLoadedAtom,
	loadTasksAction,
	type TaskFilter,
	taskFilterAtom,
	tasksAtom,
} from "@/stores/tasksStore";
import { colors, radius, spacing } from "@/theme";

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

function TaskItem({ task }: { task: Task }) {
	return (
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
	);
}

export function TasksScreen(_props: TasksScreenProps) {
	const [filter, setFilter] = useAtom(taskFilterAtom);
	const tasks = useAtomValue(tasksAtom);
	const isTasksLoaded = useAtomValue(isTasksLoadedAtom);
	const loadTasks = useSetAtom(loadTasksAction);
	const createTask = useSetAtom(createTaskAction);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [newTitle, setNewTitle] = useState("");
	const [newDesc, setNewDesc] = useState("");

	useEffect(() => {
		if (!isTasksLoaded) {
			loadTasks();
		}
	}, [isTasksLoaded, loadTasks]);

	const handleCreate = async () => {
		if (!newTitle.trim()) return;
		await createTask({
			title: newTitle,
			description: newDesc,
			status: "todo",
			priority: "medium",
		});
		setNewTitle("");
		setNewDesc("");
		setIsModalVisible(false);
	};

	const filtered =
		filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />

			{/* Header */}
			<View style={styles.header}>
				<View style={styles.headerRow}>
					<Typography variant="h2">Tasks</Typography>
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
					renderItem={({ item }) => <TaskItem task={item} />}
					contentContainerStyle={styles.list}
					showsVerticalScrollIndicator={false}
				/>
			)}

			<Modal visible={isModalVisible} animationType="slide" transparent>
				<View style={styles.modalOverlay}>
					<Card style={styles.modalCard}>
						<Typography variant="h3">New Task</Typography>
						<TextInput
							placeholder="Title"
							placeholderTextColor={colors.muted}
							value={newTitle}
							onChangeText={setNewTitle}
							style={styles.input}
						/>
						<TextInput
							placeholder="Description"
							placeholderTextColor={colors.muted}
							value={newDesc}
							onChangeText={setNewDesc}
							multiline
							style={[styles.input, styles.textArea]}
						/>
						<View style={styles.modalActions}>
							<Button
								label="Cancel"
								variant="outline"
								onPress={() => setIsModalVisible(false)}
								style={{ flex: 1 }}
							/>
							<Button label="Save" onPress={handleCreate} style={{ flex: 1 }} />
						</View>
					</Card>
				</View>
			</Modal>

			{/* Floating Action Button */}
			<TouchableOpacity
				style={styles.fab}
				onPress={() => setIsModalVisible(true)}
				activeOpacity={0.8}
			>
				<Typography variant="h2" style={styles.fabText}>
					+
				</Typography>
			</TouchableOpacity>
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
	fab: {
		position: "absolute",
		bottom: spacing.xl,
		right: spacing.xl,
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: colors.primary,
		justifyContent: "center",
		alignItems: "center",
		elevation: 4,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	fabText: {
		color: colors.onPrimary,
		fontSize: 32,
		lineHeight: 36,
		marginTop: -2,
	},
});
