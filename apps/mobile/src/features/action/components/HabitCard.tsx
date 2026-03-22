import type { Habit } from "@liverubber/shared";
import { TouchableOpacity, View } from "react-native";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { colors } from "@/theme";

interface HabitCardProps {
	habit: Habit;
	onLongPress: (habit: Habit) => void;
}

export function HabitCard({ habit, onLongPress }: HabitCardProps) {
	return (
		<TouchableOpacity
			activeOpacity={0.7}
			onLongPress={() => onLongPress(habit)}
		>
			<Card elevated style={{ marginBottom: 8 }}>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						gap: 16,
					}}
				>
					<View style={{ flex: 1, gap: 2 }}>
						<Typography variant="label">{habit.name}</Typography>
						<Typography variant="caption" color={colors.muted}>
							🔥 {habit.streakCount} day streak
						</Typography>
					</View>
				</View>
			</Card>
		</TouchableOpacity>
	);
}
