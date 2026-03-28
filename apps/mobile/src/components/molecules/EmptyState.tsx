import { StyleSheet, View } from "react-native";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { colors, spacing } from "@/theme";

interface EmptyStateProps {
	emoji: string;
	title: string;
	subtitle?: string;
	ctaLabel?: string;
	onCta?: () => void;
}

export function EmptyState({
	emoji,
	title,
	subtitle,
	ctaLabel,
	onCta,
}: EmptyStateProps) {
	return (
		<View style={styles.container}>
			<Typography variant="h1" align="center" style={styles.emoji}>
				{emoji}
			</Typography>
			<Typography variant="label" align="center" style={styles.title}>
				{title}
			</Typography>
			{subtitle ? (
				<Typography variant="bodySmall" align="center" color={colors.muted}>
					{subtitle}
				</Typography>
			) : null}
			{ctaLabel && onCta ? (
				<Button
					label={ctaLabel}
					onPress={onCta}
					variant="outline"
					style={styles.cta}
				/>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		paddingVertical: spacing.xl,
		paddingHorizontal: spacing.xl,
		gap: spacing.sm,
	},
	emoji: {
		fontSize: 40,
		marginBottom: spacing.xs,
	},
	title: {
		color: colors.onBackground,
	},
	cta: {
		marginTop: spacing.xs,
		alignSelf: "center",
		minWidth: 180,
	},
});
