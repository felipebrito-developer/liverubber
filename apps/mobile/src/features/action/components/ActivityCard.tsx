import type { Habit, ResourceStore, Task } from "@liverubber/shared";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { colors, radius, spacing } from "@/theme";

interface ActivityCardProps {
	activity: Task | Habit;
	type: "task" | "habit";
	meaningName?: string;
	goalName?: string;
	resources?: ResourceStore[];
	onFocus: (id: string) => void;
	onDetails: (id: string) => void;
}

export function ActivityCard({
	activity,
	type,
	meaningName,
	goalName,
	resources = [],
	onFocus,
	onDetails,
}: ActivityCardProps) {
	const [showResources, setShowResources] = useState(false);

	const title =
		type === "task" ? (activity as Task).title : (activity as Habit).name;
	const estimatedTime = (activity as Task | Habit).estimatedTime || 15; // fallback
	const streak = type === "habit" ? (activity as Habit).streakCount : undefined;

	return (
		<Card elevated style={styles.card}>
			{/* Title Row: Name (Left) | (Time) Center | (Streak) Right */}
			<View style={styles.titleRow}>
				<Typography variant="h3" style={styles.activityTitle} numberOfLines={1}>
					{title}
				</Typography>
				<Typography
					variant="caption"
					color={colors.muted}
					style={styles.timeLabel}
				>
					({estimatedTime} min)
				</Typography>
				{streak !== undefined && (
					<Typography
						variant="label"
						color={colors.accent}
						style={styles.streakLabel}
					>
						Streak: {streak}🔥
					</Typography>
				)}
			</View>

			{/* Metadata Row: Meaning & Goal Tags */}
			<View style={styles.tagRow}>
				{meaningName && (
					<View style={styles.meaningTag}>
						<Typography variant="caption" style={styles.meaningText}>
							#D4AF37 Meaning: {meaningName}
						</Typography>
					</View>
				)}
				{goalName && (
					<View style={styles.goalTag}>
						<Typography variant="caption" color={colors.primary}>
							Goal: {goalName}
						</Typography>
					</View>
				)}
			</View>

			{/* Collapsible Resources */}
			{resources.length > 0 && (
				<View style={styles.resourcesSection}>
					<TouchableOpacity
						onPress={() => setShowResources(!showResources)}
						style={styles.resourceToggle}
					>
						<Typography variant="caption" color={colors.muted}>
							{showResources ? "▲" : "▼"} Resources:{" "}
							{resources.map((r) => r.id).join(", ")}
						</Typography>
					</TouchableOpacity>
					{showResources && (
						<Animated.View
							entering={FadeIn}
							exiting={FadeOut}
							style={styles.resourceList}
						>
							{resources.map((res) => (
								<Typography
									key={res.id}
									variant="caption"
									style={styles.resourceItem}
								>
									• {res.id}
								</Typography>
							))}
						</Animated.View>
					)}
				</View>
			)}

			{/* Action Row: [ DETAILS ] | [ 🎯 FOCUS ] */}
			<View style={styles.actionRow}>
				<TouchableOpacity
					style={styles.detailsBtn}
					onPress={() => onDetails(activity.id)}
				>
					<Typography variant="label" color={colors.primary}>
						DETAILS
					</Typography>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.focusBtn}
					onPress={() => onFocus(activity.id)}
				>
					<Typography variant="label" style={styles.focusBtnText}>
						🎯 FOCUS
					</Typography>
				</TouchableOpacity>
			</View>
		</Card>
	);
}

const styles = StyleSheet.create({
	card: {
		marginBottom: spacing.md,
		gap: spacing.sm,
	},
	titleRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: spacing.sm,
	},
	activityTitle: {
		flex: 1,
	},
	timeLabel: {
		fontWeight: "600",
	},
	streakLabel: {
		minWidth: 80,
		textAlign: "right",
	},
	tagRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: spacing.xs,
	},
	meaningTag: {
		backgroundColor: "rgba(212, 175, 55, 0.15)",
		paddingHorizontal: spacing.sm,
		paddingVertical: 2,
		borderRadius: radius.sm,
		borderWidth: 1,
		borderColor: colors.accent,
	},
	meaningText: {
		color: colors.accent,
		fontWeight: "700",
	},
	goalTag: {
		paddingHorizontal: spacing.sm,
		paddingVertical: 2,
		borderRadius: radius.sm,
		borderWidth: 1,
		borderColor: colors.primary,
	},
	resourcesSection: {
		marginTop: spacing.xs,
	},
	resourceToggle: {
		paddingVertical: 4,
	},
	resourceList: {
		paddingLeft: spacing.md,
		marginTop: 4,
	},
	resourceItem: {
		color: colors.muted,
	},
	actionRow: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: spacing.md,
		marginTop: spacing.sm,
	},
	detailsBtn: {
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		borderRadius: radius.md,
		borderWidth: 1,
		borderColor: colors.primary,
	},
	focusBtn: {
		backgroundColor: colors.primary,
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.sm,
		borderRadius: radius.md,
		shadowColor: colors.primary,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 4,
	},
	focusBtnText: {
		color: colors.onPrimary,
		fontWeight: "bold",
	},
});
