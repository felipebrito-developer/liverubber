import type { AnyType, Reward } from "@liverubber/shared";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
	Alert,
	Modal,
	ScrollView,
	StatusBar,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/atoms/Button";
import { FAB } from "@/components/atoms/FAB";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import {
	createRewardAction,
	deleteRewardAction,
	loadHabitsAndRewardsAction,
	rewardsAtom,
	updateRewardAction,
} from "@/stores/habitsStore";
import { colors, radius, spacing } from "@/theme";
import { CorrelationChart } from "./components/CorrelationChart";
import { LogEntryCard } from "./components/LogEntryCard";
import { RewardCard } from "./components/RewardCard";

// ─── Placeholder data ──────────────────────────────────────────────────────────

interface LogEntry {
	date: string; // ISO date
	tasksCompleted: number;
	moodScore: number; // 1-5
	activities: string[];
}

const LOG_DATA: LogEntry[] = [
	{
		date: "2026-03-05",
		tasksCompleted: 3,
		moodScore: 4,
		activities: ["Morning stretch", "Deep work session"],
	},
	{
		date: "2026-03-04",
		tasksCompleted: 1,
		moodScore: 2,
		activities: ["Gratitude journal"],
	},
	{
		date: "2026-03-03",
		tasksCompleted: 5,
		moodScore: 5,
		activities: ["Cold shower", "Morning stretch", "Deep read"],
	},
	{
		date: "2026-03-02",
		tasksCompleted: 2,
		moodScore: 3,
		activities: ["Morning stretch"],
	},
	{
		date: "2026-03-01",
		tasksCompleted: 4,
		moodScore: 4,
		activities: ["Morning stretch", "30-min deep read"],
	},
	{ date: "2026-02-28", tasksCompleted: 0, moodScore: 1, activities: [] },
	{
		date: "2026-02-27",
		tasksCompleted: 3,
		moodScore: 4,
		activities: ["Morning stretch", "Gratitude journal"],
	},
];

export function ReflectionLogScreen(props: AnyType) {
	const [expandedId, setExpandedId] = useState<string | null>(null);

	const rewards = useAtomValue(rewardsAtom);
	const loadRewards = useSetAtom(loadHabitsAndRewardsAction);
	const createReward = useSetAtom(createRewardAction);
	const updateReward = useSetAtom(updateRewardAction);
	const deleteReward = useSetAtom(deleteRewardAction);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingReward, setEditingReward] = useState<Reward | null>(null);
	const [name, setName] = useState("");
	const [type, setType] = useState("celebration");

	useEffect(() => {
		loadRewards();
	}, [loadRewards]);

	function toggle(date: string) {
		setExpandedId((prev) => (prev === date ? null : date));
	}

	const handleSaveReward = async () => {
		if (!name.trim()) return;

		if (editingReward) {
			await updateReward({
				id: editingReward.id,
				data: { name, type, description: editingReward.description || "" },
			});
		} else {
			await createReward({
				name,
				type,
				description: "",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				isSynced: false,
				lastSyncedAt: null,
			});
		}

		handleCloseModal();
	};

	const handleEditPress = (reward: Reward) => {
		setEditingReward(reward);
		setName(reward.name);
		setType(reward.type || "celebration");
		setIsModalVisible(true);
	};

	const handleDeletePress = (reward: Reward) => {
		Alert.alert(
			"Prune Reward",
			`Are you sure you want to remove "${reward.name}"?`,
			[
				{ text: "Keep it", style: "cancel" },
				{
					text: "Remove",
					style: "destructive",
					onPress: async () => {
						await deleteReward(reward.id);
					},
				},
			],
		);
	};

	const handleOptionsPress = (reward: Reward) => {
		Alert.alert("Reward Options", `Manage "${reward.name}"`, [
			{ text: "Edit Details", onPress: () => handleEditPress(reward) },
			{
				text: "Archive / Remove",
				style: "destructive",
				onPress: () => handleDeletePress(reward),
			},
			{ text: "Cancel", style: "cancel" },
		]);
	};

	const handleCloseModal = () => {
		setIsModalVisible(false);
		setEditingReward(null);
		setName("");
		setType("celebration");
	};

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<ScrollView
				contentContainerStyle={styles.scroll}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.header}>
					<View style={styles.headerRow}>
						<View style={{ flex: 1 }}>
							<Typography variant="h2">Reflection Log</Typography>
							<Typography variant="bodySmall" color={colors.muted}>
								Action leads to better mood. This is the proof.
							</Typography>
						</View>
						<TouchableOpacity
							onPress={() => (props as AnyType).navigation.openDrawer()}
							style={styles.drawerBtn}
						>
							<Typography variant="h3">≡</Typography>
						</TouchableOpacity>
					</View>
				</View>

				<CorrelationChart />

				<View style={styles.logSection}>
					<View style={styles.sectionHeader}>
						<Typography variant="h3">Dopamine Hub (Rewards)</Typography>
					</View>
					<ScrollView horizontal showsHorizontalScrollIndicator={false}>
						<View style={styles.rewardRow}>
							{rewards.length === 0 ? (
								<Typography variant="caption" color={colors.muted}>
									Set up rewards for your future wins.
								</Typography>
							) : (
								rewards.map((r) => (
									<RewardCard
										key={r.id}
										reward={r}
										onLongPress={handleOptionsPress}
									/>
								))
							)}
						</View>
					</ScrollView>
				</View>

				<View style={styles.logSection}>
					<Typography variant="h3" style={styles.logSectionTitle}>
						Activity History
					</Typography>
					{LOG_DATA.map((entry) => (
						<LogEntryCard
							key={entry.date}
							entry={entry}
							expanded={expandedId === entry.date}
							onToggle={() => toggle(entry.date)}
						/>
					))}
				</View>
			</ScrollView>

			<FAB label="New Reward" onPress={() => setIsModalVisible(true)} />

			<Modal visible={isModalVisible} animationType="slide" transparent>
				<View style={styles.modalOverlay}>
					<Card style={styles.modalCard}>
						<Typography variant="h3">
							{editingReward ? "Edit Reward" : "New Reward"}
						</Typography>
						<TextInput
							placeholder="What's the prize?"
							placeholderTextColor={colors.muted}
							value={name}
							onChangeText={setName}
							style={styles.input}
						/>

						<Typography variant="label">Type</Typography>
						<View style={styles.typeRow}>
							{["celebration", "break", "item"].map((t) => {
								const active = type === t;
								return (
									<TouchableOpacity
										key={t}
										onPress={() => setType(t)}
										style={[
											styles.typeBtn,
											active && { backgroundColor: colors.primary },
										]}
									>
										<Typography
											variant="caption"
											style={{
												color: active ? colors.onPrimary : colors.onBackground,
											}}
										>
											{t.toUpperCase()}
										</Typography>
									</TouchableOpacity>
								);
							})}
						</View>

						<View style={styles.modalActions}>
							<Button
								label="Cancel"
								variant="outline"
								onPress={handleCloseModal}
								style={{ flex: 1 }}
							/>
							<Button
								label="Save"
								onPress={handleSaveReward}
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
	scroll: {
		paddingBottom: spacing.xl,
		gap: spacing.lg,
	},
	header: {
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.xl,
		gap: spacing.xs,
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
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
	logSection: {
		paddingHorizontal: spacing.xl,
		gap: spacing.sm,
	},
	logSectionTitle: {
		marginBottom: spacing.xs,
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: spacing.xs,
	},
	rewardRow: {
		flexDirection: "row",
		gap: spacing.sm,
		paddingBottom: spacing.sm,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "flex-end",
	},
	modalCard: {
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		paddingBottom: 40,
		gap: spacing.md,
	},
	input: {
		backgroundColor: colors.surface,
		borderRadius: radius.md,
		padding: spacing.md,
		color: colors.onBackground,
		fontSize: 16,
		borderWidth: 1,
		borderColor: colors.border,
	},
	typeRow: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	typeBtn: {
		flex: 1,
		paddingVertical: spacing.xs,
		alignItems: "center",
		borderRadius: radius.sm,
		borderWidth: 1,
		borderColor: colors.border,
	},
	modalActions: {
		flexDirection: "row",
		gap: spacing.md,
		marginTop: spacing.sm,
	},
});
