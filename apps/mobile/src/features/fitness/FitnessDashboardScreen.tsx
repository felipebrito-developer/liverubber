import { useAtomValue } from "jotai";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { ScreenHeader } from "@/components/molecules/ScreenHeader";
import { habitsAtom } from "@/stores/habitsStore";
import { colors, radius, spacing } from "@/theme";
import { HabitCard } from "../action/components/HabitCard";
import { useNavigation } from "@react-navigation/native";
import type { AnyType } from "@liverubber/shared";

export function FitnessDashboardScreen() {
	const navigation = useNavigation<AnyType>();
	const habits = useAtomValue(habitsAtom);

	// Basic heuristic: Habits with physical-related words
	const physicalHabits = habits.filter((h) => 
		/caminhada|exercício|pilates|água|fumar|meditar|alongar/i.test(h.name)
	);

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<ScreenHeader
				title="Body & Mind"
				subtitle="Building physical and mental resilience."
				onDrawerOpen={() => navigation.openDrawer()}
			/>

			<ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
				{/* Weekly stats summary */}
				<View style={styles.statsRow}>
					<Card style={styles.statCard}>
						<Typography variant="h1" color={colors.primary}>7</Typography>
						<Typography variant="caption" color={colors.muted}>Days Streak</Typography>
					</Card>
					<Card style={styles.statCard}>
						<Typography variant="h1" color={colors.secondary}>12</Typography>
						<Typography variant="caption" color={colors.muted}>Total Wins</Typography>
					</Card>
				</View>

				<View style={styles.section}>
					<Typography variant="h3">Performance Habits</Typography>
					<Typography variant="bodySmall" color={colors.muted}>
						Biological maintenance to support strategic focus. 💊
					</Typography>
					
					<View style={styles.list}>
						{physicalHabits.length === 0 ? (
							<Typography variant="caption" color={colors.muted} align="center">
								No physical habits tracked yet.
							</Typography>
						) : (
							physicalHabits.map((h) => (
								<HabitCard
									key={h.id}
									habit={h}
									onLongPress={() => {}}
								/>
							))
						)}
					</View>
				</View>

				<View style={styles.section}>
					<Typography variant="h3">Strategic Recovery</Typography>
					<Card style={styles.recoveryCard}>
						<Typography variant="label">Sleep Optimization</Typography>
						<Typography variant="bodySmall" color={colors.muted}>
							Quality rest is the multiplier for next-day engagement.
						</Typography>
						<View style={styles.progressBar}>
							<View style={[styles.progressFill, { width: '80%' }]} />
						</View>
						<Typography variant="caption" color={colors.success} style={{ alignSelf: 'flex-end' }}>
							Aim for 8h (Current avg: 7.2h)
						</Typography>
					</Card>
				</View>
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
	statsRow: {
		flexDirection: "row",
		gap: spacing.md,
	},
	statCard: {
		flex: 1,
		alignItems: "center",
		paddingVertical: spacing.lg,
		borderWidth: 1,
		borderColor: colors.border,
	},
	section: {
		gap: spacing.sm,
	},
	list: {
		gap: spacing.sm,
		marginTop: spacing.xs,
	},
	recoveryCard: {
		gap: spacing.sm,
		borderLeftWidth: 4,
		borderLeftColor: colors.secondary,
	},
	progressBar: {
		height: 6,
		backgroundColor: colors.surface,
		borderRadius: radius.full,
		overflow: "hidden",
		marginTop: spacing.xs,
	},
	progressFill: {
		height: "100%",
		backgroundColor: colors.secondary,
	},
});
