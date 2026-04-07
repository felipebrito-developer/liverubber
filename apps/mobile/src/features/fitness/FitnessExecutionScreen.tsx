import { useEffect, useRef } from "react";
import { Animated, Easing, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "@/components/atoms/Typography";
import { ScreenHeader } from "@/components/molecules/ScreenHeader";
import { colors, radius, spacing } from "@/theme";
import type { FitnessTabScreenProps } from "@/navigation/types";

export function FitnessExecutionScreen({ navigation }: FitnessTabScreenProps<"FitnessExecution">) {
	const pulseAnim = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(pulseAnim, {
					toValue: 1.2,
					duration: 1000,
					easing: Easing.inOut(Easing.ease),
					useNativeDriver: true,
				}),
				Animated.timing(pulseAnim, {
					toValue: 1,
					duration: 1000,
					easing: Easing.inOut(Easing.ease),
					useNativeDriver: true,
				}),
			])
		).start();
	}, [pulseAnim]);

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<ScreenHeader
				title="Rhythmic Pacer"
				subtitle="Sync your movement with the pulse to ground your focus."
				onDrawerOpen={() => navigation.openDrawer()}
			/>

			<View style={styles.container}>
				<View style={styles.pacerContainer}>
					<Animated.View 
						style={[
							styles.pacerGlow, 
							{ transform: [{ scale: pulseAnim }], opacity: 0.3 }
						]} 
					/>
					<Animated.View 
						style={[
							styles.pacerCore, 
							{ transform: [{ scale: pulseAnim }] }
						]} 
					/>
					<Typography variant="h1" style={styles.pacerText}>BREATHE</Typography>
				</View>

				<View style={styles.mirrorPlaceholder}>
					<Typography variant="label" color={colors.muted}>MIRROR MODE</Typography>
					<Typography variant="caption" color={colors.muted} align="center">
						Visual feedback loop for form verification.
					</Typography>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
		backgroundColor: colors.background,
	},
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: spacing.xl,
		gap: spacing.xxl,
	},
	pacerContainer: {
		width: 200,
		height: 200,
		justifyContent: "center",
		alignItems: "center",
	},
	pacerCore: {
		width: 120,
		height: 120,
		borderRadius: radius.full,
		backgroundColor: colors.primary,
		position: "absolute",
	},
	pacerGlow: {
		width: 180,
		height: 180,
		borderRadius: radius.full,
		backgroundColor: colors.primary,
		position: "absolute",
	},
	pacerText: {
		color: colors.onPrimary,
		fontSize: 18,
		fontWeight: "900",
		letterSpacing: 2,
	},
	mirrorPlaceholder: {
		width: "100%",
		height: 160,
		borderRadius: radius.lg,
		borderWidth: 2,
		borderColor: colors.border,
		borderStyle: "dashed",
		justifyContent: "center",
		alignItems: "center",
		padding: spacing.md,
		gap: 4,
	},
});
