import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { Typography } from "@/components/atoms/Typography";
import { colors, spacing } from "@/theme";

interface ProgressPizzaProps {
	percentage: number;
	label: string;
	color?: string;
	size?: number;
}

export function ProgressPizza({
	percentage,
	label,
	color = colors.primary,
	size = 110,
}: ProgressPizzaProps) {
	const fillHeight = useSharedValue(0);

	useEffect(() => {
		fillHeight.value = withSpring(percentage, { damping: 14, stiffness: 120 });
	}, [fillHeight, percentage]);

	const animatedStyle = useAnimatedStyle(() => ({
		height: `${fillHeight.value}%` as `${number}%`,
	}));

	return (
		<View style={styles.pizzaContainer}>
			<View
				style={[
					styles.pizzaOuter,
					{
						borderColor: color,
						width: size,
						height: size,
						borderRadius: size / 2,
					},
				]}
			>
				<View style={styles.pizzaBase}>
					<Animated.View
						style={[
							styles.pizzaInner,
							{ backgroundColor: color },
							animatedStyle,
						]}
					/>
					<View style={styles.toppings}>
						{[10, 30, 60, 80].map((_top, i) => (
							<View
								key={_top}
								style={[
									styles.topping,
									{
										bottom: i * (size / 5),
										left: (i % 2) * (size / 2.5) + size / 10,
									},
								]}
							/>
						))}
					</View>
				</View>
				<View style={styles.pizzaOverlay}>
					<Typography variant="h3" style={styles.pizzaText}>
						{percentage}%
					</Typography>
				</View>
			</View>
			{label && (
				<Typography
					variant="caption"
					align="center"
					style={{ marginTop: spacing.xs, fontWeight: "600" }}
				>
					{label}
				</Typography>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	pizzaContainer: {
		alignItems: "center",
	},
	pizzaOuter: {
		backgroundColor: colors.surface,
		borderWidth: 3,
		overflow: "hidden",
		justifyContent: "flex-end",
		alignItems: "center",
		shadowColor: colors.primary,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 10,
		elevation: 8,
	},
	pizzaBase: {
		width: "100%",
		height: "100%",
		backgroundColor: "#2c2c2e",
		justifyContent: "flex-end",
	},
	pizzaInner: {
		width: "100%",
		opacity: 0.4,
	},
	pizzaOverlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "transparent",
	},
	toppings: {
		...StyleSheet.absoluteFillObject,
		opacity: 0.15,
	},
	topping: {
		position: "absolute",
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "#fff",
	},
	pizzaText: {
		color: colors.onBackground,
		textShadowColor: "rgba(0,0,0,0.5)",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 3,
	},
});
