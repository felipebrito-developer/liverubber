import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import {
	FlatList,
	ScrollView,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "@/components/atoms/Typography";
import { ScreenHeader } from "@/components/molecules/ScreenHeader";
import { TaskCard } from "@/features/action/components/TaskCard";
import type { FitnessTabScreenProps } from "@/navigation/types";
import { tasksAtom } from "@/stores/tasksStore";
import { colors, radius, spacing } from "@/theme";

// Filter tasks that are body-maintenance related
const fitnessKeywords: Record<string, string[]> = {
	ALL: [
		"walk",
		"run",
		"meditat",
		"pilates",
		"gym",
		"stretch",
		"yoga",
		"exercise",
		"push",
		"pull",
		"squat",
		"bench",
	],
	UPPER: ["push", "pull", "bench", "shoulder", "arm", "back", "chest"],
	LOWER: ["squat", "leg", "run", "walk", "calf", "glute"],
	CORE: ["abs", "core", "plank", "situp"],
	CARDIO: ["run", "walk", "cycle", "jump", "hiit"],
};

export function FitnessPlanningScreen({
	navigation,
}: FitnessTabScreenProps<"FitnessPlanning">) {
	const tasks = useAtomValue(tasksAtom);
	const [activeFilter, setActiveFilter] = useState("ALL");

	const fitnessTasks = useMemo(() => {
		const keywords = fitnessKeywords[activeFilter] || fitnessKeywords.ALL;
		return tasks.filter((t) =>
			keywords.some((kw) => t.title.toLowerCase().includes(kw)),
		);
	}, [tasks, activeFilter]);

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<ScreenHeader
				title="Body Strategy"
				subtitle="Structure your physical maintenance routines."
				onDrawerOpen={() => navigation.openDrawer()}
			/>

			<View style={styles.filterContainer}>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					{["ALL", "UPPER", "LOWER", "CORE", "CARDIO"].map((f) => (
						<TouchableOpacity
							key={f}
							onPress={() => setActiveFilter(f)}
							style={[
								styles.filterPill,
								f === activeFilter && styles.filterPillActive,
							]}
						>
							<Typography
								variant="caption"
								style={{
									color: f === activeFilter ? colors.onPrimary : colors.muted,
									fontWeight: "700",
								}}
							>
								{f}
							</Typography>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>

			<FlatList
				data={fitnessTasks}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<TaskCard
						task={item}
						onFocus={() => {
							navigation.navigate("FitnessExecution");
						}}
					/>
				)}
				contentContainerStyle={styles.list}
				showsVerticalScrollIndicator={false}
				ListFooterComponent={<View style={{ height: 120 }} />}
				ListEmptyComponent={
					<View style={styles.empty}>
						<Typography color={colors.muted} align="center">
							{activeFilter === "ALL"
								? "No body-maintenance tasks identified.\nTry adding 'Walk' or 'Bench Press' to your backlog."
								: `No tasks found for ${activeFilter} category.`}
						</Typography>
					</View>
				}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
		backgroundColor: colors.background,
	},
	filterContainer: {
		flexDirection: "row",
		paddingHorizontal: spacing.xl,
		marginTop: spacing.sm,
		marginBottom: spacing.md,
	},
	filterPill: {
		paddingHorizontal: spacing.md,
		paddingVertical: 8,
		borderRadius: radius.full,
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.surface,
		marginRight: spacing.sm,
	},
	filterPillActive: {
		backgroundColor: colors.primary,
		borderColor: colors.primary,
	},
	list: {
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.md,
		gap: spacing.sm,
	},
	empty: {
		marginTop: spacing.xxl,
		alignItems: "center",
		paddingHorizontal: spacing.xl,
	},
});
