import type { Task } from "@liverubber/shared";
import { View } from "react-native";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { colors, radius, spacing } from "@/theme";

interface TaskCardProps {
	task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
	return (
		<Card elevated style={{ marginBottom: 4 }}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					gap: spacing.md,
				}}
			>
				<View style={{ flex: 1, gap: 2 }}>
					<Typography variant="label">{task.title}</Typography>
				</View>
				<View
					style={{
						borderWidth: 1,
						paddingHorizontal: spacing.xs,
						borderRadius: radius.sm,
						minWidth: 60,
						alignItems: "center",
						borderColor: priorityColor(task.priority),
					}}
				>
					<Typography
						variant="caption"
						style={{ color: priorityColor(task.priority) }}
					>
						{(task.priority ?? "medium").toUpperCase()}
					</Typography>
				</View>
			</View>
		</Card>
	);
}

function priorityColor(p: string | null): string {
	if (p === "urgent") return colors.overdueColor;
	if (p === "high") return colors.warning;
	if (p === "medium") return colors.secondary;
	return colors.muted;
}
