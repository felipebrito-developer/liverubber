import type React from "react";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import { colors, radius, spacing } from "@/theme";

interface CardProps {
	children: React.ReactNode;
	style?: StyleProp<ViewStyle>;
	elevated?: boolean;
}

export function Card({ children, style, elevated = false }: CardProps) {
	return (
		<View style={[styles.card, elevated && styles.elevated, style]}>
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: colors.surface,
		borderRadius: radius.lg,
		padding: spacing.md,
		borderWidth: 1,
		borderColor: colors.border,
	},
	elevated: {
		backgroundColor: colors.surfaceElevated,
		shadowColor: colors.primary,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 6,
	},
});
