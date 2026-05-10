import type { Goal, NewGoal } from "@liverubber/shared";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, TextInput, View } from "react-native";
import {
	isMeaningsLoadedAtom,
	loadMeaningsAction,
	meaningsAtom,
} from "../../stores/meaningsStore";
import {
	categoriesAtom,
	isCategoriesLoadedAtom,
	loadCategoriesAction,
} from "../../stores/categoriesStore";
import { colors, radius, spacing } from "../../theme";
import { Button, Select, Typography } from "../atoms";
import { Card } from "../molecules/Card";

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
	const [categoryId, setCategoryId] = useState<string | null>(null);

	const meanings = useAtomValue(meaningsAtom);
	const loadMeanings = useSetAtom(loadMeaningsAction);
	const isMeaningsLoaded = useAtomValue(isMeaningsLoadedAtom);
	
	const categories = useAtomValue(categoriesAtom);
	const loadCategories = useSetAtom(loadCategoriesAction);
	const isCategoriesLoaded = useAtomValue(isCategoriesLoadedAtom);

	useEffect(() => {
		if (visible) {
			if (!isMeaningsLoaded) loadMeanings();
			if (!isCategoriesLoaded) loadCategories();
		}
	}, [visible, isMeaningsLoaded, loadMeanings, isCategoriesLoaded, loadCategories]);

	useEffect(() => {
		if (editingGoal) {
			setName(editingGoal.name);
			setDesc(editingGoal.description || "");
			setMeaningId(editingGoal.meaningId || null);
			setCategoryId(editingGoal.categoryId || null);
		} else {
			setName("");
			setDesc("");
			setMeaningId(preselectedMeaningId || null);
			setCategoryId(null);
		}
	}, [editingGoal, preselectedMeaningId]);

	const handleSave = () => {
		if (!name.trim()) return;
		onSave({
			name,
			description: desc,
			meaningId,
			categoryId,
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

					<Select
						label="Life Category"
						placeholder="Choose a category..."
						value={categoryId}
						options={categories.map((cat) => ({
							label: cat.name,
							value: cat.id,
							color: cat.categoryColor,
						}))}
						onValueChange={setCategoryId}
					/>

					{!preselectedMeaningId && (
						<Select
							label="Anchor to Meaning"
							placeholder="Select a purpose..."
							value={meaningId}
							options={meanings.map((m) => ({
								label: m.name,
								value: m.id,
								color: m.category?.categoryColor,
							}))}
							onValueChange={setMeaningId}
						/>
					)}

					<View style={styles.modalActions}>
						<Button
							label="Cancel"
							variant="outline"
							onPress={onClose}
							style={{ flex: 1 }}
						/>
						<Button
							label="Save Goal"
							onPress={handleSave}
							style={{ flex: 1 }}
						/>
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
	modalActions: {
		flexDirection: "row",
		gap: spacing.sm,
		marginTop: spacing.sm,
	},
});
