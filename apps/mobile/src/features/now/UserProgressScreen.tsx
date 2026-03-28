import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { ScreenHeader } from "@/components/molecules/ScreenHeader";
import type { FocusTabScreenProps } from "@/navigation/types";
import { goalsAtom } from "@/stores/goalsStore";
import { tasksAtom } from "@/stores/tasksStore";
import { colors, spacing } from "@/theme";

function ProgressPizza({
	percentage,
	label,
	color = colors.primary,
}: {
	percentage: number;
	label: string;
	color?: string;
}) {
	// Animate from 0 → percentage on mount
	const fillHeight = useSharedValue(0);

	useEffect(() => {
		fillHeight.value = withSpring(percentage, { damping: 14, stiffness: 120 });
	}, [fillHeight, percentage]);

	const animatedStyle = useAnimatedStyle(() => ({
		height: `${fillHeight.value}%` as `${number}%`,
	}));

	return (
		<View style={styles.pizzaContainer}>
			<View style={[styles.pizzaOuter, { borderColor: color }]}>
				{/* ── Pizza Base ─────────────────────────────────────────────────── */}
				<View style={styles.pizzaBase}>
					<Animated.View
						style={[
							styles.pizzaInner,
							{ backgroundColor: color },
							animatedStyle,
						]}
					/>
					{/* ── Pizza Toppings (Visual flair) ───────────────────────────── */}
					<View style={styles.toppings}>
						{[10, 30, 60, 80].map((_top, i) => (
							<View
								key={_top}
								style={[
									styles.topping,
									{ bottom: i * 20, left: (i % 2) * 40 + 10 },
								]}
							/>
						))}
					</View>
				</View>
				<View style={styles.pizzaOverlay}>
					<Typography variant="h3" style={styles.pizzaText}>
						{percentage}%
					</Typography>
				</View>
			</View>
			<Typography
				variant="caption"
				align="center"
				style={{ marginTop: spacing.xs, fontWeight: "600" }}
			>
				{label}
			</Typography>
		</View>
	);
}

export function UserProgressScreen({
	navigation,
}: FocusTabScreenProps<"UserProgress">) {
	const goals = useAtomValue(goalsAtom);

	const tasks = useAtomValue(tasksAtom);

	const completedTasks = tasks.filter((t) => t.status === "completed").length;
	const totalTasks = tasks.length || 1;
	const taskProgress = Math.round((completedTasks / totalTasks) * 100);

	const activeGoals = goals.filter((g) => g.status === "active").length;
	const totalGoals = goals.length || 1;
	const goalProgress = Math.round((activeGoals / totalGoals) * 100);

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<ScrollView contentContainerStyle={styles.scroll}>
				<ScreenHeader
					title="Progress"
					subtitle="Your neuro-journey at a glance."
					onDrawerOpen={() => navigation.openDrawer()}
				/>

				<View style={styles.pizzasRow}>
					<ProgressPizza percentage={taskProgress} label="Task Completion" />
					<ProgressPizza percentage={goalProgress} label="Goal Momentum" />
				</View>

				<View style={styles.section}>
					<Typography variant="h3" style={styles.sectionTitle}>
						Daily Summary
					</Typography>
					<Card elevated>
						<Typography variant="label">Today's Focus</Typography>
						<Typography variant="bodySmall" color={colors.muted}>
							Focus on the "Small Wins" strategy. You have{" "}
							{tasks.filter((t) => t.status !== "completed").length} pending
							tasks.
						</Typography>
					</Card>
				</View>

				<View style={styles.section}>
					<Typography variant="h3" style={styles.sectionTitle}>
						Latest Activity
					</Typography>
					<Typography variant="caption" color={colors.muted} align="center">
						No recent activities logged. Start a session in the Now screen!
					</Typography>
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
		paddingBottom: spacing.xl,
		gap: spacing.lg,
	},
	pizzasRow: {
		flexDirection: "row",
		justifyContent: "space-around",
		paddingHorizontal: spacing.xl,
		marginTop: spacing.md,
	},
	pizzaContainer: {
		alignItems: "center",
	},
	pizzaOuter: {
		width: 110,
		height: 110,
		borderRadius: 55,
		backgroundColor: colors.surface,
		borderWidth: 3,
		overflow: "hidden",
		justifyContent: "flex-end",
		alignItems: "center",
		shadowColor: colors.primary,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 10,
		elevation: 8,
	},
	pizzaBase: {
		width: "100%",
		height: "100%",
		backgroundColor: "#2c2c2e", // Darker pizza oven background
		justifyContent: "flex-end",
	},
	pizzaInner: {
		width: "100%",
		opacity: 0.4,
		/** backgroundColor and animated style (height) applied via props */
	},
	pizzaOverlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "transparent",
	},
	toppings: {
		...StyleSheet.absoluteFillObject,
		opacity: 0.15,
	},
	topping: {
		position: "absolute",
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "#fff",
	},
	pizzaText: {
		color: colors.onBackground,
		textShadowColor: "rgba(0,0,0,0.5)",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 3,
	},
	section: {
		paddingHorizontal: spacing.xl,
		gap: spacing.sm,
	},
	sectionTitle: {
		marginBottom: spacing.xs,
	},
});
