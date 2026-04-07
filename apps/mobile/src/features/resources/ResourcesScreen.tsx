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
import { ResourceCard } from "./components/ResourceCard";

export function ResourcesScreen({
	navigation,
}: LogisticsTabScreenProps<"StoreManagement">) {
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

	const [filterCategoryId, setFilterCategoryId] = useState<string | null>(
		"cat-resources",
	);
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

	const handleDeletePress = (store: UIResourceStore) => {
		Alert.alert(
			"Shelve Resource",
			`Are you sure you want to stop tracking "${store.name}"?`,
			[
				{ text: "Keep it", style: "cancel" },
				{
					text: "Shelve / Remove",
					style: "destructive",
					onPress: async () => {
						await deleteResource(store.id);
					},
				},
			],
		);
	};

	const handleLongPress = (store: UIResourceStore) => {
		Alert.alert("Resource Options", `Manage "${store.name}"`, [
			{ text: "Edit Details", onPress: () => handleEditPress(store) },
			{
				text: "Archive / Delete",
				style: "destructive",
				onPress: () => handleDeletePress(store),
			},
			{ text: "Cancel", style: "cancel" },
		]);
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
				title="Life Resources"
				subtitle="Track your internal and external reserves."
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
								ALL
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
					<ResourceCard
						store={item}
						onAdjust={(delta) => handleAdjust(item, delta)}
						onLongPress={handleLongPress}
					/>
				)}
				contentContainerStyle={styles.list}
				showsVerticalScrollIndicator={false}
				ListFooterComponent={<View style={{ height: 120 }} />}
				ListEmptyComponent={
					<View style={styles.empty}>
						<Typography color={colors.muted} align="center">
							No resources tracked yet.{"\n"}Tap + to add your first one!
						</Typography>
					</View>
				}
			/>

			<FAB onPress={handleAddPress} />

			<Modal visible={isModalVisible} animationType="slide" transparent>
				<View style={styles.modalOverlay}>
					<Card style={styles.modalCard}>
						<Typography variant="h3">
							{editingStore ? "Edit Resource" : "New Resource"}
						</Typography>
						<TextInput
							placeholder="Resource Name"
							placeholderTextColor={colors.muted}
							value={name}
							onChangeText={setName}
							style={styles.input}
						/>
						<TextInput
							placeholder="Amount"
							placeholderTextColor={colors.muted}
							value={amountStr}
							onChangeText={setAmountStr}
							keyboardType="numeric"
							style={styles.input}
						/>
						<View>
							<Typography variant="label" style={{ marginBottom: spacing.xs }}>
								Category
							</Typography>
							<ScrollView horizontal showsHorizontalScrollIndicator={false}>
								<View style={styles.filterRow}>
									{categories.map((cat) => {
										const active = resourceCategoryId === cat.id;
										return (
											<TouchableOpacity
												key={cat.id}
												onPress={() => setResourceCategoryId(cat.id)}
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
								onPress={handleCloseModal}
								style={{ flex: 1 }}
							/>
							<Button label="Save" onPress={handleSave} style={{ flex: 1 }} />
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
		gap: spacing.md,
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
	modalActions: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	filterContainer: {
		marginTop: spacing.md,
	},
	filterRow: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	filterPill: {
		paddingHorizontal: spacing.lg,
		paddingVertical: 8,
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
