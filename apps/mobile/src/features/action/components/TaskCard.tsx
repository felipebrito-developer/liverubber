import type { Task } from "@liverubber/shared";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { colors, radius, spacing } from "@/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TaskCard({
	task,
	onFocus,
}: { task: Task; onFocus: (id: string) => void }) {
	const scale = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	return (
		<AnimatedPressable
			style={[styles.pressable, animatedStyle]}
			onPressIn={() => {
				scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
			}}
			onPressOut={() => {
				scale.value = withSpring(1, { damping: 15, stiffness: 400 });
			}}
			accessibilityRole="button"
		>
			<Card elevated style={styles.card}>
				<View style={styles.row}>
					<View style={styles.textBlock}>
						<Typography variant="label" numberOfLines={1}>
							{task.title}
						</Typography>
						{task.description ? (
							<Typography variant="caption" color={colors.muted} numberOfLines={1}>
								{task.description}
							</Typography>
						) : null}
					</View>

					<View style={styles.actions}>
						<View
							style={[
								styles.priorityBadge,
								{ backgroundColor: `${priorityColor(task.priority)}20` },
							]}
						>
							<Typography
								variant="caption"
								style={{ color: priorityColor(task.priority), fontSize: 10, fontWeight: '700' }}
							>
								{task.priority?.toUpperCase()}
							</Typography>
						</View>

						<TouchableOpacity
							style={styles.focusBtn}
							onPress={() => onFocus(task.id)}
						>
							<Typography variant="caption" style={styles.focusBtnText}>
								🎯 FOCUS
							</Typography>
						</TouchableOpacity>
					</View>
				</View>
			</Card>
		</AnimatedPressable>
	);
}

function priorityColor(p: string | null): string {
	if (p === "urgent") return colors.overdueColor;
	if (p === "high") return colors.warning;
	if (p === "medium") return colors.secondary;
	return colors.muted;
}

const styles = StyleSheet.create({
	pressable: {
		marginBottom: spacing.xs,
	},
	card: {
		padding: spacing.md,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		gap: spacing.md,
	},
	textBlock: {
		flex: 1,
		gap: 2,
	},
	actions: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	priorityBadge: {
		paddingHorizontal: spacing.xs,
		paddingVertical: 2,
		borderRadius: radius.sm,
		minWidth: 50,
		alignItems: "center",
	},
	focusBtn: {
		backgroundColor: colors.primary,
		paddingHorizontal: spacing.md,
		paddingVertical: 6,
		borderRadius: radius.md,
		elevation: 2,
		shadowColor: colors.primary,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
	},
	focusBtnText: {
		color: colors.onPrimary,
		fontWeight: "bold",
		fontSize: 10,
	},
});
