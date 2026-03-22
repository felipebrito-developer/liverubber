import type { Goal, NewGoal, Meaning } from "@liverubber/shared";
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
import { Button, Typography } from "../atoms";
import { Card } from "../molecules/Card";
import { colors, radius, spacing } from "../../theme";
import { meaningsAtom, isMeaningsLoadedAtom, loadMeaningsAction } from "../../stores/meaningsStore";

interface GoalCreationModalProps {
	visible: boolean;
	onClose: () => void;
	onSave: (payload: Omit<NewGoal, "id">) => void;
	editingGoal?: Goal | null;
	preselectedMeaningId?: string | null;
}

export function GoalCreationModal({
	visible,
	onClose,
	onSave,
	editingGoal,
	preselectedMeaningId,
}: GoalCreationModalProps) {
	const [name, setName] = useState("");
	const [desc, setDesc] = useState("");
	const [meaningId, setMeaningId] = useState<string | null>(null);

	const meanings = useAtomValue(meaningsAtom);
	const loadMeanings = useSetAtom(loadMeaningsAction);
	const isMeaningsLoaded = useAtomValue(isMeaningsLoadedAtom);

	useEffect(() => {
		if (visible && !isMeaningsLoaded) {
			loadMeanings();
		}
	}, [visible, isMeaningsLoaded, loadMeanings]);

	useEffect(() => {
		if (editingGoal) {
			setName(editingGoal.name);
			setDesc(editingGoal.description || "");
			setMeaningId(editingGoal.meaningId || null);
		} else {
			setName("");
			setDesc("");
			setMeaningId(preselectedMeaningId || null);
		}
	}, [editingGoal, visible, preselectedMeaningId]);

	const handleSave = () => {
		if (!name.trim()) return;
		onSave({
			name,
			description: desc,
			meaningId,
			status: editingGoal?.status || "active",
			progress: editingGoal?.progress || 0,
			coverImageId: editingGoal?.coverImageId || null,
			dueDate: editingGoal?.dueDate || null,
			createdAt: editingGoal?.createdAt || new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			isSynced: false,
			lastSyncedAt: null,
		});
	};

	return (
		<Modal visible={visible} animationType="slide" transparent>
			<View style={styles.modalOverlay}>
				<Card style={styles.modalCard}>
					<Typography variant="h3">
						{editingGoal ? "Edit Goal" : "New Goal"}
					</Typography>
					<Typography variant="bodySmall" color={colors.muted}>
						Set a concrete, measurable milestone.
					</Typography>
					
					<TextInput
						placeholder="What are we achieving?"
						placeholderTextColor={colors.muted}
						value={name}
						onChangeText={setName}
						style={styles.input}
					/>
					
					<TextInput
						placeholder="Success criteria or details..."
						placeholderTextColor={colors.muted}
						value={desc}
						onChangeText={setDesc}
						multiline
						style={[styles.input, styles.textArea]}
					/>

					{!preselectedMeaningId && (
						<View>
							<Typography variant="label" style={{ marginBottom: spacing.xs }}>
								Anchor to Meaning
							</Typography>
							<ScrollView horizontal showsHorizontalScrollIndicator={false}>
								<View style={styles.meaningRow}>
									{meanings.map((m) => {
										const active = meaningId === m.id;
										return (
											<TouchableOpacity
												key={m.id}
												onPress={() => setMeaningId(m.id)}
												style={[
													styles.meaningPill,
													active && { backgroundColor: m.category?.categoryColor || colors.primary, borderColor: m.category?.categoryColor || colors.primary }
												]}
											>
												<Typography variant="caption" style={{ color: active ? colors.onPrimary : colors.onBackground }}>
													{m.name}
												</Typography>
											</TouchableOpacity>
										);
									})}
								</View>
							</ScrollView>
						</View>
					)}

					<View style={styles.modalActions}>
						<Button
							label="Cancel"
							variant="outline"
							onPress={onClose}
							style={{ flex: 1 }}
						/>
						<Button label="Save Goal" onPress={handleSave} style={{ flex: 1 }} />
					</View>
				</Card>
			</View>
		</Modal>
	);
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
	meaningRow: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	meaningPill: {
		paddingHorizontal: spacing.md,
		paddingVertical: 6,
		borderRadius: radius.full,
		borderWidth: 1,
		borderColor: colors.border,
	},
	modalActions: {
		flexDirection: "row",
		gap: spacing.sm,
		marginTop: spacing.sm,
	},
});
