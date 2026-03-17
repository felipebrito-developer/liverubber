import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
	FlatList,
	Modal,
	StatusBar,
	StyleSheet,
	TextInput,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import {
	createResourceAction,
	loadResourcesAction,
	logResourceChangeAction,
	resourceStoresAtom,
	type UIResourceStore,
} from "@/stores/resourcesStore";
import { colors, radius, spacing } from "@/theme";

function ResourceCard({
	store,
	onAdjust,
}: {
	store: UIResourceStore;
	onAdjust: (amount: number) => void;
}) {
	return (
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
	);
}

export function ResourcesScreen() {
	const stores = useAtomValue(resourceStoresAtom);
	const loadResources = useSetAtom(loadResourcesAction);
	const logChange = useSetAtom(logResourceChangeAction);
	const createResource = useSetAtom(createResourceAction);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [newName, setNewName] = useState("");
	const [initialAmount, setInitialAmount] = useState("0");

	useEffect(() => {
		loadResources();
	}, [loadResources]);

	const handleAdjust = async (store: UIResourceStore, delta: number) => {
		await logChange({
			resourceId: store.id,
			amountChange: delta,
			changeType: "manual",
			logDate: new Date().toISOString(),
		});
	};

	const handleCreate = async () => {
		if (!newName.trim()) return;
		const amount = Number.parseFloat(initialAmount) || 0;
		await createResource({ name: newName, initialAmount: amount });
		setNewName("");
		setInitialAmount("0");
		setIsModalVisible(false);
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
					<Button
						label="+"
						onPress={() => setIsModalVisible(true)}
						style={styles.addBtn}
					/>
				</View>
			</View>

			<FlatList
				data={stores}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<ResourceCard
						store={item}
						onAdjust={(delta) => handleAdjust(item, delta)}
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
						<Typography variant="h3">New Resource</Typography>
						<Typography variant="bodySmall" color={colors.muted}>
							Define a new resource type (e.g. Energy, Money) and initial
							amount.
						</Typography>

						<TextInput
							placeholder="Resource Name (e.g. Energy)"
							placeholderTextColor={colors.muted}
							value={newName}
							onChangeText={setNewName}
							style={styles.input}
						/>

						<TextInput
							placeholder="Initial Amount"
							placeholderTextColor={colors.muted}
							value={initialAmount}
							onChangeText={setInitialAmount}
							keyboardType="numeric"
							style={styles.input}
						/>

						<View style={styles.modalActions}>
							<Button
								label="Cancel"
								variant="outline"
								onPress={() => setIsModalVisible(false)}
								style={{ flex: 1 }}
							/>
							<Button label="Save" onPress={handleCreate} style={{ flex: 1 }} />
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
