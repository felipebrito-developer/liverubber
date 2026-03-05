import { useAtom } from "jotai";
import {
	ActivityIndicator,
	FlatList,
	SafeAreaView,
	StatusBar,
	StyleSheet,
	View,
} from "react-native";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import type { TasksScreenProps } from "@/navigation/types";
import { useTasks } from "@/services/tasksService";
import {
	type Task,
	type TaskFilter,
	taskFilterAtom,
} from "@/stores/tasksStore";
import { colors, radius, spacing } from "@/theme";

const FILTERS: { key: TaskFilter; label: string }[] = [
	{ key: "all", label: "All" },
	{ key: "todo", label: "To Do" },
	{ key: "in_progress", label: "In Progress" },
	{ key: "done", label: "Done" },
];

function statusColor(status: Task["status"]) {
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
				{task.status.replace("_", " ").toUpperCase()}
			</Typography>
		</Card>
	);
}

export function TasksScreen({ navigation }: TasksScreenProps) {
	const [filter, setFilter] = useAtom(taskFilterAtom);
	const { data: tasks, isLoading, isError, refetch } = useTasks();

	const filtered =
		filter === "all"
			? (tasks ?? [])
			: (tasks ?? []).filter((t) => t.status === filter);

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />

			{/* Header */}
			<View style={styles.header}>
				<Typography variant="h2">Tasks</Typography>
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
			{isLoading ? (
				<View style={styles.center}>
					<ActivityIndicator color={colors.primary} size="large" />
				</View>
			) : isError ? (
				<View style={styles.center}>
					<Typography color={colors.error} align="center">
						Failed to load tasks.
					</Typography>
					<Button
						label="Retry"
						variant="ghost"
						onPress={() => refetch()}
						style={{ marginTop: spacing.md }}
					/>
				</View>
			) : filtered.length === 0 ? (
				<View style={styles.center}>
					<Typography color={colors.muted} align="center">
						No tasks yet.{"\n"}Start by creating one!
					</Typography>
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
});
