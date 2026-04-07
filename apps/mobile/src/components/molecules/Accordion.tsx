import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	withSpring,
} from "react-native-reanimated";
import { Typography } from "@/components/atoms/Typography";
import { colors, radius, spacing } from "@/theme";

interface AccordionProps {
	title: string;
	children: React.ReactNode;
	initialExpanded?: boolean;
	icon?: string;
}

export function Accordion({
	title,
	children,
	initialExpanded = true,
	icon,
}: AccordionProps) {
	const [expanded, setExpanded] = useState(initialExpanded);

	const arrowStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: withSpring(expanded ? "90deg" : "0deg") }],
	}));

	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={styles.header}
				onPress={() => setExpanded(!expanded)}
				activeOpacity={0.7}
			>
				<View style={styles.headerTitle}>
					{icon ? <Typography style={styles.icon}>{icon}</Typography> : null}
					<Typography variant="h3" style={styles.titleText}>
						{title}
					</Typography>
				</View>
				<Animated.View style={arrowStyle}>
					<Typography variant="h3" color={colors.muted}>
						›
					</Typography>
				</Animated.View>
			</TouchableOpacity>

			{expanded && <View style={styles.content}>{children}</View>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: spacing.md,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.xl,
		backgroundColor: colors.surface,
		borderRadius: radius.md,
	},
	headerTitle: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	icon: {
		fontSize: 18,
	},
	titleText: {
		letterSpacing: 0.5,
	},
	content: {
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.sm,
		gap: spacing.sm,
	},
});
