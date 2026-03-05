import type React from "react";
import { type StyleProp, StyleSheet, Text, type TextStyle } from "react-native";
import { colors, typography } from "@/theme";

type TypographyVariant =
	| "h1"
	| "h2"
	| "h3"
	| "body"
	| "bodySmall"
	| "label"
	| "caption"
	| "meaning"; // Special: renders in Soft Gold for "Why" anchors

interface TypographyProps {
	children: React.ReactNode;
	variant?: TypographyVariant;
	color?: string;
	align?: "left" | "center" | "right";
	style?: StyleProp<TextStyle>;
	numberOfLines?: number;
}

export function Typography({
	children,
	variant = "body",
	color,
	align,
	style,
	numberOfLines,
}: TypographyProps) {
	return (
		<Text
			numberOfLines={numberOfLines}
			style={[
				styles.base,
				variant === "meaning"
					? styles.meaning
					: styles[variant as keyof typeof styles],
				color ? { color } : undefined,
				align ? { textAlign: align } : undefined,
				style,
			]}
		>
			{children}
		</Text>
	);
}

const styles = StyleSheet.create({
	base: {
		color: colors.onBackground,
		fontFamily: "System",
	},
	h1: { ...typography.h1 },
	h2: { ...typography.h2 },
	h3: { ...typography.h3 },
	body: { ...typography.body },
	bodySmall: { ...typography.bodySmall },
	label: { ...typography.label },
	caption: {
		...typography.caption,
		color: colors.muted,
	},
	// Meaning variant: Soft Gold for "Why" statements (Contextual Anchoring pattern)
	meaning: {
		...typography.body,
		color: colors.meaningGold,
		fontWeight: "600" as const,
	},
});
