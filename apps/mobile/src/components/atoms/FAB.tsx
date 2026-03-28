import {
	type StyleProp,
	StyleSheet,
	TouchableOpacity,
	type ViewStyle,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { colors, shadow, spacing } from "../../theme";
import { Typography } from "./Typography";

interface FABProps {
	onPress: () => void;
	icon?: string;
	label?: string;
	style?: StyleProp<ViewStyle>;
	variant?: "primary" | "secondary" | "surface";
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function FAB({
	onPress,
	icon = "+",
	label,
	style,
	variant = "primary",
}: FABProps) {
	const scale = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	const backgroundColor =
		variant === "primary"
			? colors.primary
			: variant === "secondary"
				? colors.secondary
				: colors.surface;

	const textColor =
		variant === "primary" || variant === "secondary"
			? colors.onPrimary
			: colors.primary;

	return (
		<AnimatedTouchable
			style={[styles.fab, { backgroundColor }, animatedStyle, style]}
			onPress={onPress}
			activeOpacity={1}
			onPressIn={() => {
				scale.value = withSpring(0.92, { damping: 12, stiffness: 350 });
			}}
			onPressOut={() => {
				scale.value = withSpring(1, { damping: 12, stiffness: 350 });
			}}
		>
			<Typography variant="h3" style={{ color: textColor }}>
				{icon}
			</Typography>
			{label && (
				<Typography variant="label" style={{ color: textColor }}>
					{label}
				</Typography>
			)}
		</AnimatedTouchable>
	);
}

const styles = StyleSheet.create({
	fab: {
		minWidth: 56,
		minHeight: 56,
		borderRadius: 28,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: spacing.md,
		gap: spacing.xs,
		...shadow.md,
	},
});
