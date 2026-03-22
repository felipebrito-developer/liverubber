import type { Meaning, NewMeaning } from "@liverubber/shared";
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
	categoriesAtom,
	isCategoriesLoadedAtom,
	loadCategoriesAction,
} from "../../stores/categoriesStore";
import { colors, radius, spacing } from "../../theme";
import { Button, Typography } from "../atoms";
import { Card } from "../molecules/Card";

interface MeaningCreationModalProps {
	visible: boolean;
	onClose: () => void;
	onSave: (payload: Omit<NewMeaning, "id">) => void;
	editingMeaning?: Meaning | null;
}

export function MeaningCreationModal({
	visible,
	onClose,
	onSave,
	editingMeaning,
}: MeaningCreationModalProps) {
	const [name, setName] = useState("");
	const [desc, setDesc] = useState("");
	const [categoryId, setCategoryId] = useState<string | null>(null);

	const categories = useAtomValue(categoriesAtom);
	const loadCategories = useSetAtom(loadCategoriesAction);
	const isCategoriesLoaded = useAtomValue(isCategoriesLoadedAtom);

	useEffect(() => {
		if (visible && !isCategoriesLoaded) {
			loadCategories();
		}
	}, [visible, isCategoriesLoaded, loadCategories]);

	useEffect(() => {
		if (editingMeaning) {
			setName(editingMeaning.name);
			setDesc(editingMeaning.description || "");
			setCategoryId(editingMeaning.categoryId || null);
		} else {
			setName("");
			setDesc("");
			setCategoryId(null);
		}
	}, [editingMeaning]);

	const handleSave = () => {
		if (!name.trim()) return;
		onSave({
			name,
			description: desc,
			categoryId,
			createdAt: editingMeaning?.createdAt || new Date().toISOString(),
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
						{editingMeaning ? "Edit Meaning" : "Define Meaning"}
					</Typography>
					<Typography variant="bodySmall" color={colors.muted}>
						What truly matters to you? (e.g. Health, Growth)
					</Typography>

					<TextInput
						placeholder="Outcome Name"
						placeholderTextColor={colors.muted}
						value={name}
						onChangeText={setName}
						style={styles.input}
					/>

					<TextInput
						placeholder="Why does this matter? (Personal legacy)"
						placeholderTextColor={colors.muted}
						value={desc}
						onChangeText={setDesc}
						multiline
						style={[styles.input, styles.textArea]}
					/>

					<View>
						<Typography variant="label" style={{ marginBottom: spacing.xs }}>
							Life Category
						</Typography>
						<ScrollView horizontal showsHorizontalScrollIndicator={false}>
							<View style={styles.categoryRow}>
								{categories.map((cat) => {
									const active = categoryId === cat.id;
									return (
										<TouchableOpacity
											key={cat.id}
											onPress={() => setCategoryId(cat.id)}
											style={[
												styles.categoryPill,
												active && {
													backgroundColor: cat.categoryColor,
													borderColor: cat.categoryColor,
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
												{cat.name}
											</Typography>
										</TouchableOpacity>
									);
								})}
							</View>
						</ScrollView>
					</View>

					<View style={styles.modalActions}>
						<Button
							label="Cancel"
							variant="outline"
							onPress={onClose}
							style={{ flex: 1 }}
						/>
						<Button
							label="Solidify Meaning"
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
	categoryRow: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	categoryPill: {
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
