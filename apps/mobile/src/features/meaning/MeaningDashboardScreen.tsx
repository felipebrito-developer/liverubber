import type { Goal, Meaning, NewGoal, NewMeaning } from "@liverubber/shared";
import { GoalCreationModal, MeaningCreationModal } from "@/components/organisms";
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
import { Card } from "@/components/molecules/Card";
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

function GoalRow({
	goal,
	onLongPress,
}: {
	goal: Goal;
	onLongPress: (goal: Goal) => void;
}) {
	return (
		<TouchableOpacity activeOpacity={0.7} onLongPress={() => onLongPress(goal)}>
			<View style={styles.goalRow}>
				<View style={styles.goalHeader}>
					<View
						style={[
							styles.goalDot,
							{
								backgroundColor:
									goal.status === "active" ? colors.success : colors.muted,
							},
						]}
					/>
					<Typography variant="bodySmall" style={styles.goalName}>
						{goal.name}
					</Typography>
					<Typography variant="caption" color={colors.muted}>
						{goal.progress}%
					</Typography>
				</View>
				{/* Progress bar */}
				<View style={styles.progressTrack}>
					<View style={[styles.progressFill, { width: `${goal.progress}%` }]} />
				</View>
			</View>
		</TouchableOpacity>
	);
}

function MeaningCard({
	meaning,
	goals,
	onAddGoal,
	onLongPress,
	onGoalLongPress,
}: {
	meaning: Meaning;
	goals: Goal[];
	onAddGoal: (meaningId: string) => void;
	onLongPress: (meaning: Meaning) => void;
	onGoalLongPress: (goal: Goal) => void;
}) {
	const [expanded, setExpanded] = useState(false);

	return (
		<View>
			<TouchableOpacity
				activeOpacity={0.85}
				onPress={() => setExpanded((v) => !v)}
				onLongPress={() => onLongPress(meaning)}
				accessibilityRole="button"
				accessibilityLabel={`${meaning.name} — ${expanded ? "collapse" : "expand"} goals`}
			>
				<Card elevated style={styles.meaningCard}>
					{/* Header */}
					<View style={styles.meaningHeader}>
						<View
							style={[
								styles.categoryDot,
								{ backgroundColor: meaning.category?.categoryColor || colors.primary },
							]}
						/>
						<View style={styles.meaningText}>
							<Typography variant="h3">{meaning.name}</Typography>
							<Typography
								variant="bodySmall"
								color={colors.muted}
								style={styles.meaningDesc}
							>
								{meaning.description}
							</Typography>
						</View>
						<Typography variant="caption" color={colors.muted}>
							{expanded ? "▲" : "▼"}
						</Typography>
					</View>

					{/* Accordion — Goals */}
					{expanded && (
						<View style={styles.goalsContainer}>
							<View style={styles.divider} />
							<View style={styles.goalsHeaderRow}>
								<Typography variant="meaning" style={styles.goalsLabel}>
									Goals attached to this meaning
								</Typography>
								<TouchableOpacity
									onPress={() => onAddGoal(meaning.id)}
									style={styles.inlineAddBtn}
								>
									<Typography variant="label" color={colors.primary}>
										+ Add Goal
									</Typography>
								</TouchableOpacity>
							</View>
							{goals.length === 0 ? (
								<Typography variant="caption" color={colors.muted}>
									No goals attached yet.
								</Typography>
							) : (
								goals.map((g) => (
									<GoalRow key={g.id} goal={g} onLongPress={onGoalLongPress} />
								))
							)}
						</View>
					)}
				</Card>
			</TouchableOpacity>
		</View>
	);
}

export function MeaningDashboardScreen() {
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

			{/* Meaning Modal */}
			<MeaningCreationModal
				visible={isMeaningModalVisible}
				onClose={handleCloseMeaningModal}
				onSave={handleSaveMeaning}
				editingMeaning={editingMeaning}
			/>

			{/* Goal Modal */}
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
	},
	subtitle: {
		marginTop: spacing.xs,
	},
	list: {
		paddingHorizontal: spacing.xl,
		paddingBottom: spacing.xl,
		gap: spacing.md,
	},
	meaningCard: {
		gap: spacing.sm,
	},
	meaningHeader: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: spacing.md,
	},
	categoryDot: {
		width: 14,
		height: 14,
		borderRadius: radius.full,
		marginTop: 4,
		flexShrink: 0,
	},
	meaningText: {
		flex: 1,
		gap: spacing.xs,
	},
	meaningDesc: {
		lineHeight: 20,
	},
	goalsContainer: {
		gap: spacing.sm,
	},
	goalsHeaderRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: spacing.xs,
	},
	inlineAddBtn: {
		paddingVertical: 4,
		paddingHorizontal: 8,
	},
	divider: {
		height: 1,
		backgroundColor: colors.border,
		marginVertical: spacing.xs,
	},
	goalsLabel: {
		marginBottom: spacing.xs,
	},
	goalRow: {
		gap: spacing.xs,
	},
	goalHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	goalDot: {
		width: 7,
		height: 7,
		borderRadius: radius.full,
	},
	goalName: {
		flex: 1,
	},
	progressTrack: {
		height: 4,
		backgroundColor: colors.border,
		borderRadius: radius.full,
		marginLeft: spacing.lg,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		backgroundColor: colors.primary,
		borderRadius: radius.full,
	},
	empty: {
		marginTop: spacing.xxl,
		alignItems: "center",
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
