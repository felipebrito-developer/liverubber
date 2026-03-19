import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
	Alert,
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
	createResourceAction,
	deleteResourceAction,
	loadResourcesAction,
	logResourceChangeAction,
	resourceStoresAtom,
	type UIResourceStore,
	updateResourceAction,
} from "@/stores/resourcesStore";
import { colors, radius, spacing } from "@/theme";

function ResourceCard({
	store,
	onAdjust,
	onLongPress,
}: {
	store: UIResourceStore;
	onAdjust: (amount: number) => void;
	onLongPress: (store: UIResourceStore) => void;
}) {
	return (
		<TouchableOpacity
			activeOpacity={0.8}
			onLongPress={() => onLongPress(store)}
		>
			<Card elevated style={styles.storeCard}>
				<View style={styles.storeHeader}>
					<View style={styles.storeInfo}>
						<Typography variant="h3">{store.name}</Typography>
					</View>
					<Typography variant="h2" color={colors.primary}>
						{store.amount}
					</Typography>
				</View>

				<View style={styles.adjustRow}>
					<Button
						label="- 1"
						variant="outline"
						onPress={() => onAdjust(-1)}
						style={styles.adjustBtn}
					/>
					<Button
						label="+ 1"
						variant="primary"
						onPress={() => onAdjust(1)}
						style={styles.adjustBtn}
					/>
				</View>
			</Card>
		</TouchableOpacity>
	);
}

export function ResourcesScreen() {
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

	useEffect(() => {
		_loadResources();
	}, [_loadResources]);

	const handleSave = async () => {
		if (!name.trim()) return;
		const amount = Number.parseFloat(amountStr) || 0;

		if (editingStore) {
			await updateResource({
				id: editingStore.id,
				name,
				initialAmount: amount,
			});
		} else {
			await createResource({ name, initialAmount: amount });
		}

		handleCloseModal();
	};

	const handleEditPress = (store: UIResourceStore) => {
		setEditingStore(store);
		setName(store.name || "");
		setAmountStr(store.amount.toString());
		setIsModalVisible(true);
	};

	const handleAdjust = async (store: UIResourceStore, delta: number) => {
		const newAmount = store.amount + delta;
		await updateResource({
			id: store.id,
			name: store.name || "",
			initialAmount: newAmount,
		});
		// Log the change
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
		setIsModalVisible(true);
	};

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />

			<View style={styles.header}>
				<View style={styles.headerRow}>
					<View style={styles.headerText}>
						<Typography variant="h2">Life Resources</Typography>
						<Typography variant="bodySmall" color={colors.muted}>
							Track your internal and external reserves.
						</Typography>
					</View>
					<Button label="+" onPress={handleAddPress} style={styles.addBtn} />
				</View>
			</View>

			<FlatList
				data={stores}
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
				ListEmptyComponent={
					<View style={styles.empty}>
						<Typography color={colors.muted} align="center">
							No resources tracked yet.{"\n"}Tap + to add your first one!
						</Typography>
					</View>
				}
			/>

			<Modal visible={isModalVisible} animationType="slide" transparent>
				<View style={styles.modalOverlay}>
					<Card style={styles.modalCard}>
						<Typography variant="h3">
							{editingStore ? "Edit Resource" : "New Resource"}
						</Typography>
						<Typography variant="bodySmall" color={colors.muted}>
							Define your resource type (e.g. Energy, Money) and amount.
						</Typography>

						<TextInput
							placeholder="Resource Name (e.g. Energy)"
							placeholderTextColor={colors.muted}
							value={name}
							onChangeText={setName}
							style={styles.input}
						/>

						<TextInput
							placeholder="Current Amount"
							placeholderTextColor={colors.muted}
							value={amountStr}
							onChangeText={setAmountStr}
							keyboardType="numeric"
							style={styles.input}
						/>

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
	list: {
		paddingHorizontal: spacing.xl,
		paddingBottom: spacing.xl,
		gap: spacing.md,
	},
	storeCard: {
		gap: spacing.md,
	},
	storeHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	storeInfo: {
		flex: 1,
	},
	adjustRow: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	adjustBtn: {
		flex: 1,
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
});
