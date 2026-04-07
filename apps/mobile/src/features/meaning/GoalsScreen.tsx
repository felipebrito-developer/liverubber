import type { Goal, NewGoal } from "@liverubber/shared";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { Alert, FlatList, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FAB } from "@/components/atoms/FAB";
import { Typography } from "@/components/atoms/Typography";
import { ScreenHeader } from "@/components/molecules/ScreenHeader";
import { GoalCreationModal } from "@/components/organisms";
import type { StrategicTabScreenProps } from "@/navigation/types";
import {
	createGoalAction,
	deleteGoalAction,
	goalsAtom,
	isGoalsLoadedAtom,
	loadGoalsAction,
	updateGoalAction,
} from "@/stores/goalsStore";
import { colors, spacing } from "@/theme";
import { GoalCard } from "./components";

export function GoalsScreen({ navigation }: StrategicTabScreenProps<"Goals">) {
	const goals = useAtomValue(goalsAtom);
	const isGoalsLoaded = useAtomValue(isGoalsLoadedAtom);
	const loadGoals = useSetAtom(loadGoalsAction);
	const createGoal = useSetAtom(createGoalAction);
	const updateGoal = useSetAtom(updateGoalAction);
	const deleteGoal = useSetAtom(deleteGoalAction);

	const [isGoalModalVisible, setIsGoalModalVisible] = useState(false);
	const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

	useEffect(() => {
		if (!isGoalsLoaded) loadGoals();
	}, [isGoalsLoaded, loadGoals]);

	const handleSaveGoal = async (payload: Omit<NewGoal, "id">) => {
		if (editingGoal) {
			await updateGoal({
				id: editingGoal.id,
				data: payload,
			});
		} else {
			await createGoal(payload);
		}

		handleCloseGoalModal();
	};

	const handleEditPress = (goal: Goal) => {
		setEditingGoal(goal);
		setIsGoalModalVisible(true);
	};

	const handleDeletePress = (goal: Goal) => {
		Alert.alert(
			"Prune Goal",
			"Are you sure you want to let this goal go for now?",
			[
				{ text: "Keep it", style: "cancel" },
				{
					text: "Remove",
					style: "destructive",
					onPress: async () => {
						await deleteGoal(goal.id);
					},
				},
			],
		);
	};

	const handleCloseGoalModal = () => {
		setIsGoalModalVisible(false);
		setEditingGoal(null);
	};

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<ScreenHeader
				title="Goals"
				subtitle="Concrete milestones toward your meanings."
				onDrawerOpen={() => navigation.openDrawer()}
			/>

			<FlatList
				data={goals}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<GoalCard
						goal={item}
						onEdit={() => handleEditPress(item)}
						onDelete={() => handleDeletePress(item)}
					/>
				)}
				contentContainerStyle={styles.list}
				showsVerticalScrollIndicator={false}
				ListFooterComponent={<View style={{ height: 100 }} />}
				ListEmptyComponent={
					isGoalsLoaded ? (
						<View style={styles.empty}>
							<Typography color={colors.muted} align="center">
								No goals found.{"\n"}Set a milestone and start moving!
							</Typography>
						</View>
					) : null
				}
			/>

			<FAB onPress={() => setIsGoalModalVisible(true)} variant="primary" />

			<GoalCreationModal
				visible={isGoalModalVisible}
				onClose={handleCloseGoalModal}
				onSave={handleSaveGoal}
				editingGoal={editingGoal}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
		backgroundColor: colors.background,
	},
	list: {
		paddingHorizontal: spacing.xl,
		paddingBottom: spacing.xl,
		gap: spacing.md,
	},
	empty: {
		marginTop: spacing.xxl,
		alignItems: "center",
	},
});
