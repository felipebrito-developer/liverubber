import type { Goal, Meaning, NewGoal, NewMeaning } from "@liverubber/shared";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
	Alert,
	FlatList,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Typography } from "@/components/atoms";
import {
	GoalCreationModal,
	MeaningCreationModal,
} from "@/components/organisms";
import type { StrategicTabScreenProps } from "@/navigation/types";
import {
	createGoalAction,
	deleteGoalAction,
	goalsAtom,
	isGoalsLoadedAtom,
	loadGoalsAction,
	updateGoalAction,
} from "@/stores/goalsStore";
import {
	createMeaningAction,
	deleteMeaningAction,
	isMeaningsLoadedAtom,
	loadMeaningsAction,
	meaningsAtom,
	updateMeaningAction,
} from "@/stores/meaningsStore";
import { colors, radius, spacing } from "@/theme";
import { MeaningCard } from "./components/MeaningCard";

export function MeaningDashboardScreen({
	navigation,
}: StrategicTabScreenProps<"GoalsDashboard">) {
	const meanings = useAtomValue(meaningsAtom);
	const isMeaningsLoaded = useAtomValue(isMeaningsLoadedAtom);
	const loadMeanings = useSetAtom(loadMeaningsAction);
	const createMeaning = useSetAtom(createMeaningAction);
	const updateMeaning = useSetAtom(updateMeaningAction);
	const deleteMeaning = useSetAtom(deleteMeaningAction);

	const goals = useAtomValue(goalsAtom);
	const isGoalsLoaded = useAtomValue(isGoalsLoadedAtom);
	const loadGoals = useSetAtom(loadGoalsAction);
	const createGoal = useSetAtom(createGoalAction);
	const updateGoal = useSetAtom(updateGoalAction);
	const deleteGoal = useSetAtom(deleteGoalAction);

	const [isMeaningModalVisible, setIsMeaningModalVisible] = useState(false);
	const [editingMeaning, setEditingMeaning] = useState<Meaning | null>(null);

	const [isGoalModalVisible, setIsGoalModalVisible] = useState(false);
	const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
	const [selectedMeaningId, setSelectedMeaningId] = useState<string | null>(
		null,
	);

	useEffect(() => {
		if (!isMeaningsLoaded) loadMeanings();
		if (!isGoalsLoaded) loadGoals();
	}, [isMeaningsLoaded, loadMeanings, isGoalsLoaded, loadGoals]);

	const handleSaveMeaning = async (payload: Omit<NewMeaning, "id">) => {
		if (editingMeaning) {
			await updateMeaning({
				id: editingMeaning.id,
				data: payload,
			});
		} else {
			await createMeaning(payload);
		}

		handleCloseMeaningModal();
	};

	const handleEditMeaningPress = (meaning: Meaning) => {
		setEditingMeaning(meaning);
		setIsMeaningModalVisible(true);
	};

	const handleDeleteMeaningPress = (meaning: Meaning) => {
		Alert.alert(
			"Prune Meaning",
			"Are you sure? Removing this will also un-anchor its attached Goals.",
			[
				{ text: "Keep it", style: "cancel" },
				{
					text: "Remove",
					style: "destructive",
					onPress: async () => {
						await deleteMeaning(meaning.id);
					},
				},
			],
		);
	};

	const handleMeaningLongPress = (meaning: Meaning) => {
		Alert.alert("Meaning Options", `How should we handle "${meaning.name}"?`, [
			{ text: "Edit Details", onPress: () => handleEditMeaningPress(meaning) },
			{
				text: "Remove from Plan",
				style: "destructive",
				onPress: () => handleDeleteMeaningPress(meaning),
			},
			{ text: "Cancel", style: "cancel" },
		]);
	};

	const handleCloseMeaningModal = () => {
		setIsMeaningModalVisible(false);
		setEditingMeaning(null);
	};

	const handleAddGoalPress = (meaningId: string) => {
		setSelectedMeaningId(meaningId);
		setEditingGoal(null);
		setIsGoalModalVisible(true);
	};

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

	const handleEditGoalPress = (goal: Goal) => {
		setEditingGoal(goal);
		setSelectedMeaningId(goal.meaningId);
		setIsGoalModalVisible(true);
	};

	const handleDeleteGoalPress = (goal: Goal) => {
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

	const handleGoalLongPress = (goal: Goal) => {
		Alert.alert(
			"Goal Options",
			`What would you like to do with "${goal.name}"?`,
			[
				{ text: "Edit Goal", onPress: () => handleEditGoalPress(goal) },
				{
					text: "Remove / Prune",
					style: "destructive",
					onPress: () => handleDeleteGoalPress(goal),
				},
				{ text: "Cancel", style: "cancel" },
			],
		);
	};

	const handleCloseGoalModal = () => {
		setIsGoalModalVisible(false);
		setEditingGoal(null);
		setSelectedMeaningId(null);
	};

	const data = meanings.map((m) => ({
		meaning: m,
		goals: goals.filter((g) => g.meaningId === m.id),
	}));

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<View style={styles.header}>
				<View style={styles.headerRow}>
					<View style={styles.headerText}>
						<Typography variant="h2">Your Meanings</Typography>
						<Typography variant="bodySmall" color={colors.muted}>
							Define what truly matters to you.
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
						onPress={() => setIsMeaningModalVisible(true)}
						style={styles.addBtn}
					/>
				</View>
			</View>

			<FlatList
				data={data}
				keyExtractor={(item) => item.meaning.id}
				renderItem={({ item }) => (
					<MeaningCard
						meaning={item.meaning}
						goals={item.goals}
						onAddGoal={handleAddGoalPress}
						onLongPress={handleMeaningLongPress}
						onGoalLongPress={handleGoalLongPress}
					/>
				)}
				contentContainerStyle={styles.list}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={
					isMeaningsLoaded ? (
						<View style={styles.empty}>
							<Typography color={colors.muted} align="center">
								No meanings found.{"\n"}Start by defining what matters!
							</Typography>
							<Button
								label="Create Meaning"
								variant="outline"
								onPress={() => setIsMeaningModalVisible(true)}
								style={{ marginTop: spacing.md }}
							/>
						</View>
					) : null
				}
			/>

			<MeaningCreationModal
				visible={isMeaningModalVisible}
				onClose={handleCloseMeaningModal}
				onSave={handleSaveMeaning}
				editingMeaning={editingMeaning}
			/>

			<GoalCreationModal
				visible={isGoalModalVisible}
				onClose={handleCloseGoalModal}
				onSave={handleSaveGoal}
				editingGoal={editingGoal}
				preselectedMeaningId={selectedMeaningId}
			/>
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
		paddingBottom: spacing.md,
		gap: spacing.xs,
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	headerText: {
		flex: 1,
	},
	addBtn: {
		width: 44,
		height: 44,
		borderRadius: radius.full,
		marginLeft: spacing.sm,
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
