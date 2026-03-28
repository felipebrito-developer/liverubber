import type { Reward } from "@liverubber/shared";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { colors, spacing } from "@/theme";

interface RewardCardProps {
	reward: Reward;
	onLongPress: (reward: Reward) => void;
}

function rewardEmoji(type?: string | null): string {
	if (type === "break") return "☕";
	if (type === "item") return "🎁";
	return "🎉"; // celebration (default)
}

export function RewardCard({ reward, onLongPress }: RewardCardProps) {
	return (
		<TouchableOpacity
			activeOpacity={0.7}
			onLongPress={() => onLongPress(reward)}
		>
			<Card style={styles.rewardCard}>
				<Typography variant="h3" align="center">
					{rewardEmoji(reward.type)}
				</Typography>
				<Typography variant="label" align="center" numberOfLines={1}>
					{reward.name}
				</Typography>
				<Typography variant="caption" color={colors.muted} align="center">
					{reward.type?.toUpperCase() || "REWARD"}
				</Typography>
			</Card>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	rewardCard: {
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		minWidth: 120,
		gap: 2,
		alignItems: "center",
	},
});
