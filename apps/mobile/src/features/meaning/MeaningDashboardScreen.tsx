import type { Goal, Meaning } from "@liverubber/shared";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
	FlatList,
	Modal,
	StatusBar,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import {
	createGoalAction,
	goalsAtom,
	isGoalsLoadedAtom,
	loadGoalsAction,
} from "@/stores/goalsStore";
import {
	createMeaningAction,
	isMeaningsLoadedAtom,
	loadMeaningsAction,
	meaningsAtom,
} from "@/stores/meaningsStore";
import { colors, radius, spacing } from "@/theme";

function GoalRow({ goal }: { goal: Goal }) {
	return (
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
	);
}

function MeaningCard({
	meaning,
	goals,
	onAddGoal,
}: {
	meaning: Meaning;
	goals: Goal[];
	onAddGoal: (meaningId: string) => void;
}) {
	const [expanded, setExpanded] = useState(false);

	return (
		<View>
			<TouchableOpacity
				activeOpacity={0.85}
				onPress={() => setExpanded((v) => !v)}
				accessibilityRole="button"
				accessibilityLabel={`${meaning.name} — ${expanded ? "collapse" : "expand"} goals`}
			>
				<Card elevated style={styles.meaningCard}>
					{/* Header */}
					<View style={styles.meaningHeader}>
						<View
							style={[
								styles.categoryDot,
								{ backgroundColor: colors.primary }, // Default to primary until category color is fetched
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
								goals.map((g) => <GoalRow key={g.id} goal={g} />)
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

	const goals = useAtomValue(goalsAtom);
	const isGoalsLoaded = useAtomValue(isGoalsLoadedAtom);
	const loadGoals = useSetAtom(loadGoalsAction);
	const createGoal = useSetAtom(createGoalAction);

	const [isMeaningModalVisible, setIsMeaningModalVisible] = useState(false);
	const [newMeaningName, setNewMeaningName] = useState("");
	const [newMeaningDesc, setNewMeaningDesc] = useState("");

	const [isGoalModalVisible, setIsGoalModalVisible] = useState(false);
	const [selectedMeaningId, setSelectedMeaningId] = useState<string | null>(
		null,
	);
	const [newGoalName, setNewGoalName] = useState("");
	const [newGoalDesc, setNewGoalDesc] = useState("");

	useEffect(() => {
		if (!isMeaningsLoaded) loadMeanings();
		if (!isGoalsLoaded) loadGoals();
	}, [isMeaningsLoaded, loadMeanings, isGoalsLoaded, loadGoals]);

	const handleCreateMeaning = async () => {
		if (!newMeaningName.trim()) return;
		await createMeaning({
			name: newMeaningName,
			description: newMeaningDesc,
			categoryId: null,
		});
		setNewMeaningName("");
		setNewMeaningDesc("");
		setIsMeaningModalVisible(false);
	};

	const handleAddGoalPress = (meaningId: string) => {
		setSelectedMeaningId(meaningId);
		setIsGoalModalVisible(true);
	};

	const handleCreateGoal = async () => {
		if (!newGoalName.trim() || !selectedMeaningId) return;
		await createGoal({
			name: newGoalName,
			description: newGoalDesc,
			meaningId: selectedMeaningId,
			status: "active",
			progress: 0,
		});
		setNewGoalName("");
		setNewGoalDesc("");
		setIsGoalModalVisible(false);
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
			<Modal visible={isMeaningModalVisible} animationType="slide" transparent>
				<View style={styles.modalOverlay}>
					<Card style={styles.modalCard}>
						<Typography variant="h3">New Meaning</Typography>
						<TextInput
							placeholder="What matters? (e.g. Health, Growth)"
							placeholderTextColor={colors.muted}
							value={newMeaningName}
							onChangeText={setNewMeaningName}
							style={styles.input}
						/>
						<TextInput
							placeholder="Description"
							placeholderTextColor={colors.muted}
							value={newMeaningDesc}
							onChangeText={setNewMeaningDesc}
							multiline
							style={[styles.input, styles.textArea]}
						/>
						<View style={styles.modalActions}>
							<Button
								label="Cancel"
								variant="outline"
								onPress={() => setIsMeaningModalVisible(false)}
								style={{ flex: 1 }}
							/>
							<Button
								label="Save"
								onPress={handleCreateMeaning}
								style={{ flex: 1 }}
							/>
						</View>
					</Card>
				</View>
			</Modal>

			{/* Goal Modal */}
			<Modal visible={isGoalModalVisible} animationType="slide" transparent>
				<View style={styles.modalOverlay}>
					<Card style={styles.modalCard}>
						<Typography variant="h3">New Goal</Typography>
						<Typography variant="bodySmall" color={colors.muted}>
							Attach a measurable goal to this meaning.
						</Typography>
						<TextInput
							placeholder="Goal name"
							placeholderTextColor={colors.muted}
							value={newGoalName}
							onChangeText={setNewGoalName}
							style={styles.input}
						/>
						<TextInput
							placeholder="Description"
							placeholderTextColor={colors.muted}
							value={newGoalDesc}
							onChangeText={setNewGoalDesc}
							multiline
							style={[styles.input, styles.textArea]}
						/>
						<View style={styles.modalActions}>
							<Button
								label="Cancel"
								variant="outline"
								onPress={() => setIsGoalModalVisible(false)}
								style={{ flex: 1 }}
							/>
							<Button
								label="Save"
								onPress={handleCreateGoal}
								style={{ flex: 1 }}
							/>
						</View>
					</Card>
				</View>
			</Modal>
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
