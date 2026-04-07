import { useAtomValue } from "jotai";
import { FlatList, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "@/components/atoms/Typography";
import { ScreenHeader } from "@/components/molecules/ScreenHeader";
import { TaskCard } from "@/features/action/components/TaskCard";
import type { FitnessTabScreenProps } from "@/navigation/types";
import { tasksAtom } from "@/stores/tasksStore";
import { colors, radius, spacing } from "@/theme";

export function FitnessPlanningScreen({
	navigation,
}: FitnessTabScreenProps<"FitnessPlanning">) {
	const tasks = useAtomValue(tasksAtom);

	// Filter tasks that are body-maintenance related
	const fitnessKeywords = [
		"walk",
		"run",
		"meditat",
		"pilates",
		"gym",
		"stretch",
		"yoga",
		"exercise",
		"treinar",
		"caminhar",
	];
	const fitnessTasks = tasks.filter((t) =>
		fitnessKeywords.some((kw) => t.title.toLowerCase().includes(kw)),
	);

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<ScreenHeader
				title="Body Strategy"
				subtitle="Structure your physical maintenance routines."
				onDrawerOpen={() => navigation.openDrawer()}
			/>

			<View style={styles.filterContainer}>
				{["ALL", "UPPER", "LOWER", "CORE", "CARDIO"].map((f) => (
					<View
						key={f}
						style={[styles.filterPill, f === "ALL" && styles.filterPillActive]}
					>
						<Typography
							variant="caption"
							style={{
								color: f === "ALL" ? colors.onPrimary : colors.muted,
								fontWeight: "700",
							}}
						>
							{f}
						</Typography>
					</View>
				))}
			</View>

			<FlatList
				data={fitnessTasks}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<TaskCard
						task={item}
						onFocus={() => {
							navigation.navigate("Now" as never);
						}}
					/>
				)}
				contentContainerStyle={styles.list}
				showsVerticalScrollIndicator={false}
				ListFooterComponent={<View style={{ height: 120 }} />}
				ListEmptyComponent={
					<View style={styles.empty}>
						<Typography color={colors.muted} align="center">
							No body-maintenance tasks identified.{"\n"}Try adding 'Walk' or
							'Yoga' to your backlog.
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
		gap: spacing.sm,
		marginTop: spacing.sm,
		marginBottom: spacing.md,
	},
	filterPill: {
		paddingHorizontal: spacing.md,
		paddingVertical: 6,
		borderRadius: radius.full,
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.surface,
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
