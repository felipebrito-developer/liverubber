import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
	Alert,
	FlatList,
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
import { Select } from "@/components/atoms/Select";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { ScreenHeader } from "@/components/molecules/ScreenHeader";
import type { LogisticsTabScreenProps } from "@/navigation/types";
import {
	categoriesAtom,
	isCategoriesLoadedAtom,
	loadCategoriesAction,
} from "@/stores/categoriesStore";
import {
	createResourceAction,
	deleteResourceAction,
	loadResourcesAction,
	logResourceChangeAction,
	resourceStoresAtom,
	type UIResourceStore,
	updateResourceAction,
} from "@/stores/resourcesStore";
import { colors, radius, spacing } from "@/theme";
import { StorageItemCard } from "./components/StorageItemCard";

export function StorageScreen({
	navigation,
}: LogisticsTabScreenProps<"Storage">) {
	const stores = useAtomValue(resourceStoresAtom);
	const _loadResources = useSetAtom(loadResourcesAction);
	const _logChange = useSetAtom(logResourceChangeAction);
	const createResource = useSetAtom(createResourceAction);
	const updateResource = useSetAtom(updateResourceAction);
	const deleteResource = useSetAtom(deleteResourceAction);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingStore, setEditingStore] = useState<UIResourceStore | null>(
		null,
	);
	const [name, setName] = useState("");
	const [amountStr, setAmountStr] = useState("0");
	const [resourceCategoryId, setResourceCategoryId] = useState<string | null>(
		"cat-resources",
	);

	const [filterCategoryId, setFilterCategoryId] = useState<string | null>("cat-resources");
	const categories = useAtomValue(categoriesAtom);
	const loadCategories = useSetAtom(loadCategoriesAction);
	const isCategoriesLoaded = useAtomValue(isCategoriesLoadedAtom);

	useEffect(() => {
		_loadResources();
		if (!isCategoriesLoaded) loadCategories();
	}, [_loadResources, isCategoriesLoaded, loadCategories]);

	const handleSave = async () => {
		if (!name.trim()) return;
		const amount = Number.parseFloat(amountStr) || 0;

		if (editingStore) {
			await updateResource({
				id: editingStore.id,
				name,
				initialAmount: amount,
				categoryId: resourceCategoryId,
			});
		} else {
			await createResource({
				name,
				initialAmount: amount,
				categoryId: resourceCategoryId,
			});
		}

		handleCloseModal();
	};

	const handleEditPress = (store: UIResourceStore) => {
		setEditingStore(store);
		setName(store.name || "");
		setAmountStr(store.amount.toString());
		setResourceCategoryId(store.categoryId || null);
		setIsModalVisible(true);
	};

	const handleAdjust = async (store: UIResourceStore, delta: number) => {
		const newAmount = store.amount + delta;
		await updateResource({
			id: store.id,
			name: store.name || "",
			initialAmount: newAmount,
		});
		await _logChange({
			resourceId: store.id,
			amountChange: delta,
			changeType: delta > 0 ? "manual_increase" : "manual_decrease",
			logDate: new Date().toISOString(),
		});
	};

	const handleDeletePress = () => {
		if (!editingStore) return;
		Alert.alert(
			"Shelve Resource",
			`Are you sure you want to stop tracking "${editingStore.name}"?`,
			[
				{ text: "Keep it", style: "cancel" },
				{
					text: "Shelve / Remove",
					style: "destructive",
					onPress: async () => {
						await deleteResource(editingStore.id);
						handleCloseModal();
					},
				},
			],
		);
	};

	const handleCloseModal = () => {
		setIsModalVisible(false);
		setEditingStore(null);
		setName("");
		setAmountStr("0");
	};

	const handleAddPress = () => {
		setEditingStore(null);
		setName("");
		setAmountStr("0");
		setResourceCategoryId("cat-resources");
		setIsModalVisible(true);
	};

	const filteredStores = filterCategoryId
		? stores.filter((s) => s.categoryId === filterCategoryId)
		: stores;

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<ScreenHeader
				title="Storage Hub"
				subtitle="Manage your inventory and reserves with precision."
				onDrawerOpen={() => navigation.openDrawer()}
			/>

			<View style={styles.filterContainer}>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					<View style={styles.filterRow}>
						<TouchableOpacity
							onPress={() => setFilterCategoryId(null)}
							style={[
								styles.filterPill,
								!filterCategoryId && styles.filterPillActive,
							]}
						>
							<Typography
								variant="caption"
								style={!filterCategoryId && { color: colors.onPrimary }}
							>
								ALL ITEMS
							</Typography>
						</TouchableOpacity>
						{categories.map((cat) => {
							const active = filterCategoryId === cat.id;
							return (
								<TouchableOpacity
									key={cat.id}
									onPress={() => setFilterCategoryId(cat.id)}
									style={[
										styles.filterPill,
										active && {
											backgroundColor: cat.categoryColor,
											borderColor: cat.categoryColor,
										},
									]}
								>
									<Typography
										variant="caption"
										style={active && { color: colors.onPrimary }}
									>
										{cat.name.toUpperCase()}
									</Typography>
								</TouchableOpacity>
							);
						})}
					</View>
				</ScrollView>
			</View>

			<FlatList
				data={filteredStores}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<StorageItemCard
						store={item}
						onAdjust={(delta) => handleAdjust(item, delta)}
						onEdit={() => handleEditPress(item)}
					/>
				)}
				contentContainerStyle={styles.list}
				showsVerticalScrollIndicator={false}
				ListFooterComponent={<View style={{ height: 120 }} />}
				ListEmptyComponent={
					<View style={styles.empty}>
						<Typography color={colors.muted} align="center">
							No items found in this section.{"\n"}Tap + to add one!
						</Typography>
					</View>
				}
			/>

			<FAB onPress={handleAddPress} />

			<Modal visible={isModalVisible} animationType="slide" transparent>
				<View style={styles.modalOverlay}>
					<Card style={styles.modalCard}>
						<View style={styles.modalHeader}>
							<Typography variant="h3">
								{editingStore ? "Edit Storage Item" : "New Storage Item"}
							</Typography>
							{editingStore && (
								<TouchableOpacity onPress={handleDeletePress}>
									<Typography color={colors.error}>Delete Item</Typography>
								</TouchableOpacity>
							)}
						</View>

						<TextInput
							placeholder="Item Name (e.g. Rice, Mental Energy)"
							placeholderTextColor={colors.muted}
							value={name}
							onChangeText={setName}
							style={styles.input}
						/>

						<View style={styles.amountInputRow}>
							<Typography variant="label" style={{ marginBottom: spacing.xs }}>
								Initial / Current Amount
							</Typography>
							<TextInput
								placeholder="0"
								placeholderTextColor={colors.muted}
								value={amountStr}
								onChangeText={setAmountStr}
								keyboardType="numeric"
								style={styles.input}
							/>
						</View>

						<View style={styles.selectWrapper}>
							<Typography variant="label" style={{ marginBottom: spacing.xs }}>
								Category
							</Typography>
							<Select
								options={categories.map((c) => ({
									label: c.name,
									value: c.id,
								}))}
								value={resourceCategoryId}
								onValueChange={setResourceCategoryId}
								placeholder="Select category..."
							/>
						</View>

						<View style={styles.modalActions}>
							<Button
								label="Cancel"
								variant="outline"
								onPress={handleCloseModal}
								style={{ flex: 1 }}
							/>
							<Button
								label="Save Changes"
								onPress={handleSave}
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
	list: {
		paddingHorizontal: spacing.xl,
		paddingBottom: spacing.xl,
		paddingTop: spacing.md,
		gap: spacing.md,
	},
	empty: {
		marginTop: spacing.xxl,
		alignItems: "center",
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.7)",
		justifyContent: "center",
		padding: spacing.xl,
	},
	modalCard: {
		gap: spacing.lg,
		padding: spacing.xl,
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	input: {
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.md,
		padding: spacing.md,
		color: colors.onBackground,
		fontSize: 16,
	},
	amountInputRow: {
		gap: spacing.xs,
	},
	selectWrapper: {
		gap: spacing.xs,
	},
	modalActions: {
		flexDirection: "row",
		gap: spacing.sm,
		marginTop: spacing.md,
	},
	filterContainer: {
		paddingVertical: spacing.md,
		backgroundColor: colors.background,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	filterRow: {
		flexDirection: "row",
		gap: spacing.sm,
		paddingHorizontal: spacing.xl,
	},
	filterPill: {
		paddingHorizontal: spacing.lg,
		paddingVertical: 10,
		borderRadius: radius.full,
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.surface,
	},
	filterPillActive: {
		backgroundColor: colors.primary,
		borderColor: colors.primary,
		elevation: 4,
		shadowColor: colors.primary,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
	},
});
