import type { NewTask, Task } from "@liverubber/shared";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
	Modal,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import {
	goalsAtom,
	isGoalsLoadedAtom,
	loadGoalsAction,
} from "@/stores/goalsStore";
import { tagsAtom } from "@/stores/tagsStore";
import { colors, radius, spacing } from "../../theme";
import { Button } from "../atoms/Button";
import { Typography } from "../atoms/Typography";
import { Card } from "../molecules/Card";

interface TaskCreationModalProps {
	visible: boolean;
	onClose: () => void;
	onSave: (payload: Omit<NewTask, "id">, selectedTagIds: string[]) => void;
	editingTask?: Task | null;
}

export function TaskCreationModal({
	visible,
	onClose,
	onSave,
	editingTask,
}: TaskCreationModalProps) {
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [priority, setPriority] = useState<string>("medium");
	const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
	const [goalId, setGoalId] = useState<string | null>(null);

	const tags = useAtomValue(tagsAtom);
	const goals = useAtomValue(goalsAtom);
	const loadGoals = useSetAtom(loadGoalsAction);
	const isGoalsLoaded = useAtomValue(isGoalsLoadedAtom);

	useEffect(() => {
		if (visible && !isGoalsLoaded) {
			loadGoals();
		}
	}, [visible, isGoalsLoaded, loadGoals]);

	useEffect(() => {
		if (editingTask) {
			setTitle(editingTask.title);
			setDesc(editingTask.description || "");
			setPriority(editingTask.priority || "medium");
			setGoalId(editingTask.goalId || null);
			setSelectedTagIds(editingTask.tags?.map((t) => t.id) || []);
		} else {
			setTitle("");
			setDesc("");
			setPriority("medium");
			setGoalId(null);
			setSelectedTagIds([]);
		}
	}, [editingTask]);

	const toggleTag = (id: string) => {
		setSelectedTagIds((prev) =>
			prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
		);
	};

	const handleSave = () => {
		if (!title.trim()) return;
		onSave(
			{
				title,
				description: desc,
				status: editingTask?.status || "todo",
				priority,
				dueDate: editingTask?.dueDate || null,
				goalId,
				parentTaskId: editingTask?.parentTaskId || null,
				createdAt: editingTask?.createdAt || new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				isSynced: false,
				lastSyncedAt: null,
			},
			selectedTagIds,
		);
	};

	return (
		<Modal visible={visible} animationType="slide" transparent>
			<View style={styles.modalOverlay}>
				<Card style={styles.modalCard}>
					<Typography variant="h3">
						{editingTask ? "Edit Task" : "New Task"}
					</Typography>

					<TextInput
						placeholder="What needs attention?"
						placeholderTextColor={colors.muted}
						value={title}
						onChangeText={setTitle}
						style={styles.input}
					/>

					<TextInput
						placeholder="Add details... (Mental note)"
						placeholderTextColor={colors.muted}
						value={desc}
						onChangeText={setDesc}
						multiline
						style={[styles.input, styles.textArea]}
					/>

					<View>
						<Typography variant="label" style={{ marginBottom: spacing.xs }}>
							Anchor to Goal (Outcome)
						</Typography>
						<ScrollView horizontal showsHorizontalScrollIndicator={false}>
							<View style={styles.priorityRow}>
								<TouchableOpacity
									onPress={() => setGoalId(null)}
									style={[
										styles.tagPill,
										!goalId && {
											backgroundColor: colors.muted,
											borderColor: colors.muted,
										},
									]}
								>
									<Typography
										variant="caption"
										style={{
											color: !goalId ? colors.onPrimary : colors.onBackground,
										}}
									>
										NONE
									</Typography>
								</TouchableOpacity>
								{goals.map((goal) => {
									const active = goalId === goal.id;
									const color =
										goal.meaning?.category?.categoryColor || colors.primary;
									return (
										<TouchableOpacity
											key={goal.id}
											onPress={() => setGoalId(goal.id)}
											style={[
												styles.tagPill,
												active && {
													backgroundColor: color,
													borderColor: color,
												},
											]}
										>
											<Typography
												variant="caption"
												style={{
													color: active
														? colors.onPrimary
														: colors.onBackground,
												}}
											>
												{goal.name}
											</Typography>
										</TouchableOpacity>
									);
								})}
							</View>
						</ScrollView>
					</View>

					<View>
						<Typography variant="label" style={{ marginBottom: spacing.xs }}>
							Tags (Context & Energy)
						</Typography>
						<ScrollView horizontal showsHorizontalScrollIndicator={false}>
							<View style={styles.priorityRow}>
								{tags.map((tag) => {
									const active = selectedTagIds.includes(tag.id);
									return (
										<TouchableOpacity
											key={tag.id}
											onPress={() => toggleTag(tag.id)}
											style={[
												styles.tagPill,
												active && {
													backgroundColor: tag.colorHex,
													borderColor: tag.colorHex,
												},
											]}
										>
											<Typography
												variant="caption"
												style={{
													color: active
														? colors.onPrimary
														: colors.onBackground,
												}}
											>
												{tag.name}
											</Typography>
										</TouchableOpacity>
									);
								})}
							</View>
						</ScrollView>
					</View>

					<View>
						<Typography variant="label" style={{ marginBottom: spacing.xs }}>
							Priority
						</Typography>
						<View style={styles.priorityRow}>
							{["low", "medium", "high", "urgent"].map((p) => {
								const active = priority === p;
								return (
									<TouchableOpacity
										key={p}
										onPress={() => setPriority(p)}
										style={[
											styles.priorityPill,
											active && {
												backgroundColor: getPriorityColor(p),
												borderColor: getPriorityColor(p),
											},
										]}
									>
										<Typography
											variant="caption"
											style={{
												color: active ? colors.onPrimary : colors.onBackground,
											}}
										>
											{p.toUpperCase()}
										</Typography>
									</TouchableOpacity>
								);
							})}
						</View>
					</View>

					<View style={styles.modalActions}>
						<Button
							label="Cancel"
							variant="outline"
							onPress={onClose}
							style={{ flex: 1 }}
						/>
						<Button
							label="Save Task"
							onPress={handleSave}
							style={{ flex: 1 }}
						/>
					</View>
				</Card>
			</View>
		</Modal>
	);
}

function getPriorityColor(p: string) {
	if (p === "urgent") return colors.overdueColor;
	if (p === "high") return colors.warning;
	if (p === "medium") return colors.secondary;
	return colors.muted;
}

const styles = StyleSheet.create({
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
		height: 80,
		textAlignVertical: "top",
	},
	priorityRow: {
		flexDirection: "row",
		gap: spacing.xs,
		flexWrap: "wrap",
	},
	priorityPill: {
		paddingHorizontal: spacing.sm,
		paddingVertical: 6,
		borderRadius: radius.full,
		borderWidth: 1,
		borderColor: colors.border,
	},
	tagPill: {
		paddingHorizontal: spacing.md,
		paddingVertical: 6,
		borderRadius: radius.full,
		borderWidth: 1,
		borderColor: colors.border,
		marginRight: spacing.xs,
	},
	modalActions: {
		flexDirection: "row",
		gap: spacing.sm,
		marginTop: spacing.sm,
	},
});
