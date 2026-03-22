import type { TagType } from "@liverubber/shared";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Typography } from "@/components/atoms/Typography";
import { colors, radius, spacing } from "@/theme";
import type { EnergyLevel } from "../ActionHubScreen";

interface EnergyToggleProps {
	value: EnergyLevel;
	onChange: (v: EnergyLevel) => void;
	tags: TagType[];
}

export function EnergyToggle({ value, onChange, tags }: EnergyToggleProps) {
	const energyTags = tags.filter((t) => t.id.includes("energy"));

	return (
		<View style={styles.energyRow}>
			{energyTags.map((tag) => {
				const active = value === tag.id;
				const description =
					tag.id === "tag-low-energy"
						? "Small wins only"
						: tag.id === "tag-balanced-energy"
							? "Regular tasks"
							: "Deep work mode";
				return (
					<TouchableOpacity
						key={tag.id}
						onPress={() => onChange(tag.id as EnergyLevel)}
						activeOpacity={0.8}
						style={[
							styles.energyBtn,
							active && {
								backgroundColor: tag.colorHex,
								borderColor: tag.colorHex,
							},
						]}
						accessibilityRole="button"
						accessibilityLabel={`${tag.name}: ${description}`}
					>
						<Typography
							variant="label"
							style={{ color: active ? colors.onPrimary : colors.muted }}
						>
							{tag.name}
						</Typography>
						<Typography
							variant="caption"
							style={{ color: active ? colors.onPrimary : colors.muted }}
						>
							{description}
						</Typography>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	energyRow: {
		flexDirection: "row",
		paddingHorizontal: spacing.xl,
		gap: spacing.sm,
		marginBottom: spacing.md,
	},
	energyBtn: {
		flex: 1,
		padding: spacing.sm,
		borderRadius: radius.md,
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.surface,
		alignItems: "center",
		justifyContent: "center",
		gap: 2,
	},
});
