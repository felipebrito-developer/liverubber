import type { Task } from "@liverubber/shared";
import { useSetAtom } from "jotai";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { selectedTaskIdAtom } from "@/stores/tasksStore";
import { colors, radius, spacing } from "@/theme";

interface TaskCardProps {
	task: Task;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TaskCard({ task }: TaskCardProps) {
	const setSelectedTask = useSetAtom(selectedTaskIdAtom);
	const scale = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	return (
		<AnimatedPressable
			style={[styles.pressable, animatedStyle]}
			onPress={() => setSelectedTask(task.id)}
			onPressIn={() => {
				scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
			}}
			onPressOut={() => {
				scale.value = withSpring(1, { damping: 15, stiffness: 400 });
			}}
			accessibilityRole="button"
			accessibilityLabel={`Focus on ${task.title}`}
		>
			<Card elevated style={styles.card}>
				<View style={styles.row}>
					<View style={styles.textBlock}>
						<Typography variant="label">{task.title}</Typography>
					</View>
					<View
						style={[
							styles.priorityBadge,
							{ borderColor: priorityColor(task.priority) },
						]}
					>
						<Typography
							variant="caption"
							style={{ color: priorityColor(task.priority) }}
						>
							{(task.priority ?? "medium").toUpperCase()}
						</Typography>
					</View>
					<Typography
						variant="caption"
						color={colors.muted}
						style={styles.hint}
					>
						→ focus
					</Typography>
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
		marginBottom: 4,
	},
	card: {
		// no extra margin — handled by pressable wrapper
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
	priorityBadge: {
		borderWidth: 1,
		paddingHorizontal: spacing.xs,
		borderRadius: radius.sm,
		minWidth: 60,
		alignItems: "center",
	},
	hint: {
		opacity: 0.5,
		fontSize: 11,
	},
});
