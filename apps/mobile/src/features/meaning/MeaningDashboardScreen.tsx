import { useState } from "react";
import {
	FlatList,
	SafeAreaView,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { colors, radius, spacing } from "@/theme";

interface GoalItem {
	id: string;
	name: string;
	status: "active" | "paused" | "completed";
	progress: number; // 0-100
}

interface MeaningItem {
	id: string;
	name: string;
	description: string;
	categoryColor: string;
	goals: GoalItem[];
}

// Placeholder data — replace with real DB query via TanStack Query
const MEANINGS: MeaningItem[] = [
	{
		id: "m1",
		name: "Health & Vitality",
		description: "Being strong and present in my own body.",
		categoryColor: colors.success,
		goals: [
			{ id: "g1", name: "Run 3x per week", status: "active", progress: 40 },
			{
				id: "g2",
				name: "Sleep 7h consistently",
				status: "active",
				progress: 65,
			},
		],
	},
	{
		id: "m2",
		name: "Deep Work",
		description: "Building things that matter with focused energy.",
		categoryColor: colors.secondary,
		goals: [
			{
				id: "g3",
				name: "Ship LiveRubber v1",
				status: "active",
				progress: 30,
			},
			{
				id: "g4",
				name: "Read 2 engineering books",
				status: "paused",
				progress: 50,
			},
		],
	},
	{
		id: "m3",
		name: "Relationships",
		description: "Nurturing the people who give my life meaning.",
		categoryColor: colors.warning,
		goals: [
			{ id: "g5", name: "Weekly family call", status: "active", progress: 80 },
		],
	},
];

function GoalRow({ goal }: { goal: GoalItem }) {
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
				<View
					style={[styles.progressFill, { width: `${goal.progress}%` as any }]}
				/>
			</View>
		</View>
	);
}

function MeaningCard({ item }: { item: MeaningItem }) {
	const [expanded, setExpanded] = useState(false);

	return (
		<TouchableOpacity
			activeOpacity={0.85}
			onPress={() => setExpanded((v) => !v)}
			accessibilityRole="button"
			accessibilityLabel={`${item.name} — ${expanded ? "collapse" : "expand"} goals`}
		>
			<Card elevated style={styles.meaningCard}>
				{/* Header */}
				<View style={styles.meaningHeader}>
					<View
						style={[
							styles.categoryDot,
							{ backgroundColor: item.categoryColor },
						]}
					/>
					<View style={styles.meaningText}>
						<Typography variant="h3">{item.name}</Typography>
						<Typography
							variant="bodySmall"
							color={colors.muted}
							style={styles.meaningDesc}
						>
							{item.description}
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
						{item.goals.map((g) => (
							<GoalRow key={g.id} goal={g} />
						))}
					</View>
				)}
			</Card>
		</TouchableOpacity>
	);
}

export function MeaningDashboardScreen() {
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
				data={MEANINGS}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <MeaningCard item={item} />}
				contentContainerStyle={styles.list}
				showsVerticalScrollIndicator={false}
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
