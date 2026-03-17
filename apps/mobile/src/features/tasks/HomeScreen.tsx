import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import type { HomeScreenProps } from "@/navigation/types";
import { userAtom } from "@/stores/authStore";
import {
	isTasksLoadedAtom,
	loadTasksAction,
	tasksAtom,
} from "@/stores/tasksStore";
import { colors, spacing } from "@/theme";

export function HomeScreen({ navigation }: HomeScreenProps) {
	const user = useAtomValue(userAtom);
	const setUser = useSetAtom(userAtom);

	const tasks = useAtomValue(tasksAtom);
	const isTasksLoaded = useAtomValue(isTasksLoadedAtom);
	const loadTasks = useSetAtom(loadTasksAction);

	useEffect(() => {
		if (!isTasksLoaded) {
			loadTasks();
		}
	}, [isTasksLoaded, loadTasks]);

	function handleLogout() {
		setUser(null);
		navigation.navigate("Welcome");
	}

	const greeting = user?.name
		? `Hello, ${user.name.split(" ")[0]} 👋`
		: "Hello 👋";

	const activeCount = tasks.filter((t) => t.status !== "done").length;
	const completedCount = tasks.filter((t) => t.status === "done").length;

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<View style={styles.container}>
				{/* Header */}
				<View style={styles.header}>
					<View>
						<Typography variant="h2">{greeting}</Typography>
						<Typography variant="bodySmall" color={colors.muted}>
							What would you like to accomplish today?
						</Typography>
					</View>
					<TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
						<Typography variant="bodySmall" color={colors.error}>
							Sign out
						</Typography>
					</TouchableOpacity>
				</View>

				{/* Quick Stats */}
				<View style={styles.statsRow}>
					<Card elevated style={styles.statCard}>
						<Typography variant="h2" color={colors.primary}>
							{activeCount}
						</Typography>
						<Typography variant="caption">Active Tasks</Typography>
					</Card>
					<Card elevated style={styles.statCard}>
						<Typography variant="h2" color={colors.success}>
							{completedCount}
						</Typography>
						<Typography variant="caption">Completed</Typography>
					</Card>
					<Card elevated style={styles.statCard}>
						<Typography variant="h2" color={colors.secondary}>
							0
						</Typography>
						<Typography variant="caption">AI Insights</Typography>
					</Card>
				</View>

				{/* Navigate to Tasks */}
				<Card style={styles.tasksCard}>
					<Typography variant="h3" style={{ marginBottom: spacing.xs }}>
						Your Tasks
					</Typography>
					<Typography
						variant="bodySmall"
						color={colors.muted}
						style={{ marginBottom: spacing.md }}
					>
						View and manage all your tasks in one place.
					</Typography>
					<Button
						label="Open Tasks"
						onPress={() => navigation.navigate("Tasks")}
						fullWidth
					/>
				</Card>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
		backgroundColor: colors.background,
	},
	container: {
		flex: 1,
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.xl,
		gap: spacing.xl,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
	},
	statsRow: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	statCard: {
		flex: 1,
		alignItems: "center",
		gap: spacing.xs,
	},
	tasksCard: {
		gap: 0,
	},
});
