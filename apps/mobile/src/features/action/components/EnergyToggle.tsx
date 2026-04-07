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

export function EnergyToggle({
	value,
	onChange,
}: Omit<EnergyToggleProps, "tags">) {
	const energyTags = [
		{
			id: "tag-low-energy",
			label: "LOW",
			sub: "Small Wins",
			color: colors.success,
		},
		{
			id: "tag-balanced-energy",
			label: "BALANCED",
			sub: "Regular Work",
			color: colors.secondary,
		},
		{
			id: "tag-high-energy",
			label: "HIGH",
			sub: "Deep Work",
			color: colors.warning,
		},
	];

	return (
		<View style={styles.energyRow}>
			{energyTags.map((tag) => {
				const active = value === tag.id;
				return (
					<TouchableOpacity
						key={tag.id}
						onPress={() => onChange(tag.id as EnergyLevel)}
						activeOpacity={0.8}
						style={[
							styles.energyBtn,
							active && {
								backgroundColor: tag.color,
								borderColor: tag.color,
							},
						]}
						accessibilityRole="button"
						accessibilityLabel={`${tag.label}: ${tag.sub}`}
					>
						<Typography
							variant="label"
							style={[styles.btnText, active && { color: colors.onPrimary }]}
						>
							{tag.label}
						</Typography>
						<Typography
							variant="caption"
							style={[styles.btnSub, active && { color: colors.onPrimary }]}
						>
							{tag.sub}
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
		gap: spacing.xs,
		marginBottom: spacing.md,
		backgroundColor: colors.surface,
		paddingVertical: spacing.xs,
	},
	energyBtn: {
		flex: 1,
		paddingVertical: spacing.sm,
		borderRadius: radius.sm,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: "transparent",
	},
	btnText: {
		fontWeight: "bold",
		color: colors.muted,
	},
	btnSub: {
		fontSize: 10,
		color: colors.muted,
	},
});
