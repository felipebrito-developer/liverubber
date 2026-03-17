import type { Goal, Meaning } from "@liverubber/shared";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
	FlatList,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import {
	goalsAtom,
	isGoalsLoadedAtom,
	loadGoalsAction,
} from "@/stores/goalsStore";
import {
	isMeaningsLoadedAtom,
	loadMeaningsAction,
	meaningsAtom,
} from "@/stores/meaningsStore";
import { colors, radius, spacing } from "@/theme";

function GoalRow({ goal }: { goal: Goal }) {
	return (
		<View style={styles.goalRow}>
			<View style={styles.goalHeader}>
				<View
					style={[
						styles.goalDot,
						{
							backgroundColor:
								goal.status === "active" ? colors.success : colors.muted,
						},
					]}
				/>
				<Typography variant="bodySmall" style={styles.goalName}>
					{goal.name}
				</Typography>
				<Typography variant="caption" color={colors.muted}>
					{goal.progress}%
				</Typography>
			</View>
			{/* Progress bar */}
			<View style={styles.progressTrack}>
				<View style={[styles.progressFill, { width: `${goal.progress}%` }]} />
			</View>
		</View>
	);
}

function MeaningCard({ meaning, goals }: { meaning: Meaning; goals: Goal[] }) {
	const [expanded, setExpanded] = useState(false);

	return (
		<TouchableOpacity
			activeOpacity={0.85}
			onPress={() => setExpanded((v) => !v)}
			accessibilityRole="button"
			accessibilityLabel={`${meaning.name} — ${expanded ? "collapse" : "expand"} goals`}
		>
			<Card elevated style={styles.meaningCard}>
				{/* Header */}
				<View style={styles.meaningHeader}>
					<View
						style={[
							styles.categoryDot,
							{ backgroundColor: colors.primary }, // Default to primary until category color is fetched
						]}
					/>
					<View style={styles.meaningText}>
						<Typography variant="h3">{meaning.name}</Typography>
						<Typography
							variant="bodySmall"
							color={colors.muted}
							style={styles.meaningDesc}
						>
							{meaning.description}
						</Typography>
					</View>
					<Typography variant="caption" color={colors.muted}>
						{expanded ? "▲" : "▼"}
					</Typography>
				</View>

				{/* Accordion — Goals */}
				{expanded && (
					<View style={styles.goalsContainer}>
						<View style={styles.divider} />
						<Typography variant="meaning" style={styles.goalsLabel}>
							Goals attached to this meaning
						</Typography>
						{goals.length === 0 ? (
							<Typography variant="caption" color={colors.muted}>
								No goals attached yet.
							</Typography>
						) : (
							goals.map((g) => <GoalRow key={g.id} goal={g} />)
						)}
					</View>
				)}
			</Card>
		</TouchableOpacity>
	);
}

export function MeaningDashboardScreen() {
	const meanings = useAtomValue(meaningsAtom);
	const isMeaningsLoaded = useAtomValue(isMeaningsLoadedAtom);
	const loadMeanings = useSetAtom(loadMeaningsAction);

	const goals = useAtomValue(goalsAtom);
	const isGoalsLoaded = useAtomValue(isGoalsLoadedAtom);
	const loadGoals = useSetAtom(loadGoalsAction);

	useEffect(() => {
		if (!isMeaningsLoaded) loadMeanings();
		if (!isGoalsLoaded) loadGoals();
	}, [isMeaningsLoaded, loadMeanings, isGoalsLoaded, loadGoals]);

	const data = meanings.map((m) => ({
		meaning: m,
		goals: goals.filter((g) => g.meaningId === m.id),
	}));

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<View style={styles.header}>
				<Typography variant="h2">Your Meanings</Typography>
				<Typography
					variant="bodySmall"
					color={colors.muted}
					style={styles.subtitle}
				>
					Tap a card to reveal the goals behind it.
				</Typography>
			</View>
			<FlatList
				data={data}
				keyExtractor={(item) => item.meaning.id}
				renderItem={({ item }) => (
					<MeaningCard meaning={item.meaning} goals={item.goals} />
				)}
				contentContainerStyle={styles.list}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={
					isMeaningsLoaded ? (
						<Typography
							color={colors.muted}
							align="center"
							style={{ marginTop: spacing.xl }}
						>
							No meanings found.{"\n"}Start by defining what matters.
						</Typography>
					) : null
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
	subtitle: {
		marginTop: spacing.xs,
	},
	list: {
		paddingHorizontal: spacing.xl,
		paddingBottom: spacing.xl,
		gap: spacing.md,
	},
	meaningCard: {
		gap: spacing.sm,
	},
	meaningHeader: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: spacing.md,
	},
	categoryDot: {
		width: 14,
		height: 14,
		borderRadius: radius.full,
		marginTop: 4,
		flexShrink: 0,
	},
	meaningText: {
		flex: 1,
		gap: spacing.xs,
	},
	meaningDesc: {
		lineHeight: 20,
	},
	goalsContainer: {
		gap: spacing.sm,
	},
	divider: {
		height: 1,
		backgroundColor: colors.border,
		marginVertical: spacing.xs,
	},
	goalsLabel: {
		marginBottom: spacing.xs,
	},
	goalRow: {
		gap: spacing.xs,
	},
	goalHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	goalDot: {
		width: 7,
		height: 7,
		borderRadius: radius.full,
	},
	goalName: {
		flex: 1,
	},
	progressTrack: {
		height: 4,
		backgroundColor: colors.border,
		borderRadius: radius.full,
		marginLeft: spacing.lg,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		backgroundColor: colors.primary,
		borderRadius: radius.full,
	},
});
