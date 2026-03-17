import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { FlatList, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import {
	loadResourcesAction,
	logResourceChangeAction,
	resourceStoresAtom,
	type UIResourceStore,
} from "@/stores/resourcesStore";
import { colors, spacing } from "@/theme";

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

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />

			<View style={styles.header}>
				<Typography variant="h2">Life Resources</Typography>
				<Typography variant="bodySmall" color={colors.muted}>
					Track your internal and external reserves.
				</Typography>
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
							No resources tracked yet.
						</Typography>
					</View>
				}
			/>
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
});
