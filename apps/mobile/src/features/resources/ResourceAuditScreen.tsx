import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { FlatList, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { ScreenHeader } from "@/components/molecules/ScreenHeader";
import { resourceLogsAtom, loadResourceLogsAction, resourceStoresAtom } from "@/stores/resourcesStore";
import { colors, spacing } from "@/theme";
import type { LogisticsTabScreenProps } from "@/navigation/types";

export function ResourceAuditScreen({ navigation }: LogisticsTabScreenProps<"StoreAudit">) {
	const logs = useAtomValue(resourceLogsAtom);
	const loadLogs = useSetAtom(loadResourceLogsAction);
	const stores = useAtomValue(resourceStoresAtom);

	useEffect(() => {
		loadLogs();
	}, [loadLogs]);

	function getStoreName(id: string) {
		return stores.find(s => s.id === id)?.name || "Unknown Resource";
	}

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<ScreenHeader
				title="Audit Trail"
				subtitle="Historical record of your reserve fluctuations."
				onDrawerOpen={() => navigation.openDrawer()}
			/>

			<FlatList
				data={logs}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<Card style={styles.logCard}>
						<View style={styles.logHeader}>
							<Typography variant="label">{getStoreName(item.resourceId)}</Typography>
							<Typography 
								variant="label" 
								style={{ color: item.amountChange > 0 ? colors.winLoop : colors.overdueColor }}
							>
								{item.amountChange > 0 ? "+" : ""}{item.amountChange.toLocaleString()}
							</Typography>
						</View>
						<View style={styles.logFooter}>
							<Typography variant="caption" color={colors.muted}>
								{item.changeType.replace("_", " ").toUpperCase()}
							</Typography>
							<Typography variant="caption" color={colors.muted}>
								{new Date(item.logDate || "").toLocaleDateString()} {new Date(item.logDate || "").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
							</Typography>
						</View>
					</Card>
				)}
				contentContainerStyle={styles.list}
				showsVerticalScrollIndicator={false}
				ListFooterComponent={<View style={{ height: 120 }} />}
				ListEmptyComponent={
					<View style={styles.empty}>
						<Typography color={colors.muted} align="center">
							No audit logs found.{"\n"}Resource shifts will appear here.
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
	list: {
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.md,
		gap: spacing.sm,
	},
	logCard: {
		padding: spacing.md,
		gap: 2,
	},
	logHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	logFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 4,
	},
	empty: {
		marginTop: spacing.xxl,
		alignItems: "center",
	},
});
