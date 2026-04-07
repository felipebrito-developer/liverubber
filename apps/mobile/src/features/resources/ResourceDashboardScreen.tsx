import { useAtomValue } from "jotai";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { ScreenHeader } from "@/components/molecules/ScreenHeader";
import { resourceStoresAtom } from "@/stores/resourcesStore";
import { categoriesAtom } from "@/stores/categoriesStore";
import { colors, radius, spacing } from "@/theme";
import { useNavigation } from "@react-navigation/native";
import type { AnyType } from "@liverubber/shared";

export function ResourceDashboardScreen() {
	const navigation = useNavigation<AnyType>();
	const stores = useAtomValue(resourceStoresAtom);
	const categories = useAtomValue(categoriesAtom);

	// Group resources by category for summary
	const summaryData = categories.map(cat => {
		const total = stores
			.filter(s => s.categoryId === cat.id)
			.reduce((acc, s) => acc + s.amount, 0);
		return { ...cat, total };
	});

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<ScreenHeader
				title="Status"
				subtitle="Global overview of your biological and logistical reserves."
				onDrawerOpen={() => navigation.openDrawer()}
			/>

			<ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
				<View style={styles.grid}>
					{summaryData.map((item) => (
						<Card key={item.id} style={[styles.statCard, { borderLeftColor: item.categoryColor }]}>
							<Typography variant="caption" color={colors.muted} numberOfLines={1}>
								{item.name.toUpperCase()}
							</Typography>
							<Typography variant="h2" style={{ color: item.categoryColor }}>
								{item.total.toLocaleString()}
							</Typography>
						</Card>
					))}
				</View>

				<View style={styles.sectionHeader}>
					<Typography variant="h3">Strategic Reserves</Typography>
					<Typography variant="bodySmall" color={colors.muted}>
						These resources fuel your daily focus and long-term momentum.
					</Typography>
				</View>

				{stores.slice(0, 5).map((store) => (
					<Card key={store.id} style={styles.resourceBrief}>
						<View style={styles.briefHeader}>
							<Typography variant="label">{store.name}</Typography>
							<Typography variant="label" color={colors.primary}>
								{store.amount.toLocaleString()}
							</Typography>
						</View>
						<View style={styles.progressBar}>
							<View 
								style={[
									styles.progressFill, 
									{ 
										width: '100%', // For MVP, just full bar
										backgroundColor: categories.find(c => c.id === store.categoryId)?.categoryColor || colors.primary 
									}
								]} 
							/>
						</View>
					</Card>
				))}

				<Button 
					label="Manage All Assets" 
					onPress={() => navigation.navigate("StoreManagement")}
					style={{ marginTop: spacing.md }}
				/>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
		backgroundColor: colors.background,
	},
	scroll: {
		paddingHorizontal: spacing.xl,
		paddingBottom: 120,
		gap: spacing.lg,
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: spacing.md,
	},
	statCard: {
		flexBasis: "47%",
		flexGrow: 1,
		padding: spacing.md,
		borderLeftWidth: 4,
	},
	sectionHeader: {
		gap: 2,
	},
	resourceBrief: {
		padding: spacing.md,
		gap: spacing.xs,
	},
	briefHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	progressBar: {
		height: 4,
		backgroundColor: colors.surface,
		borderRadius: radius.full,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
	},
});
