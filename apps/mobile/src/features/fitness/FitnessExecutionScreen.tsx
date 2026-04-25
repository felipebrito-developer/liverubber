import { useEffect, useRef, useState } from "react";
import {
	Animated,
	Easing,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { ScreenHeader } from "@/components/molecules/ScreenHeader";
import type { FitnessTabScreenProps } from "@/navigation/types";
import { colors, radius, spacing } from "@/theme";

export function FitnessExecutionScreen({
	navigation,
}: FitnessTabScreenProps<"FitnessExecution">) {
	const pulseAnim = useRef(new Animated.Value(1)).current;
	const [reps, setReps] = useState(10);
	const [weight, setWeight] = useState(60);
	const [setNumber, setSetNumber] = useState(1);
	const [isResting, setIsResting] = useState(false);
	const [restTime, setRestTime] = useState(90); // 90 seconds rest

	useEffect(() => {
		let timer: ReturnType<typeof setInterval>;
		if (isResting && restTime > 0) {
			timer = setInterval(() => {
				setRestTime((prev) => prev - 1);
			}, 1000);
		} else if (restTime === 0) {
			setIsResting(false);
			setRestTime(90);
			setSetNumber((prev) => prev + 1);
		}
		return () => clearInterval(timer);
	}, [isResting, restTime]);

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
			]),
		).start();
	}, [pulseAnim]);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<ScreenHeader
				title="Execution Mode"
				subtitle="Grounding your potential in physical action."
				onDrawerOpen={() => navigation.openDrawer()}
			/>

			<View style={styles.container}>
				{/* ── Active Section: The Rest Timer or Control Card ─────────── */}
				{isResting ? (
					<Card elevated style={styles.restCard}>
						<Typography variant="label" color={colors.secondary} align="center">
							RESTING
						</Typography>
						<Typography variant="h1" align="center" style={styles.restTimer}>
							{formatTime(restTime)}
						</Typography>
						<Button
							label="Skip Rest →"
							variant="outline"
							onPress={() => {
								setIsResting(false);
								setRestTime(90);
								setSetNumber((prev) => prev + 1);
							}}
						/>
					</Card>
				) : (
					<Card elevated style={styles.controlCard}>
						<View style={styles.cardHeader}>
							<Typography variant="h3">SET {setNumber}</Typography>
							<Typography variant="caption" color={colors.accent}>
								✦ PROGRESSIVE
							</Typography>
						</View>

						<View style={styles.controlsRow}>
							<View style={styles.controlGroup}>
								<Typography variant="label">REPS</Typography>
								<View style={styles.stepper}>
									<TouchableOpacity
										onPress={() => setReps(Math.max(0, reps - 1))}
										style={styles.stepBtn}
									>
										<Typography variant="h3">−</Typography>
									</TouchableOpacity>
									<Typography variant="h2" style={styles.stepValue}>
										{reps}
									</Typography>
									<TouchableOpacity
										onPress={() => setReps(reps + 1)}
										style={styles.stepBtn}
									>
										<Typography variant="h3">+</Typography>
									</TouchableOpacity>
								</View>
							</View>

							<View style={styles.controlGroup}>
								<Typography variant="label">WEIGHT (kg)</Typography>
								<View style={styles.stepper}>
									<TouchableOpacity
										onPress={() => setWeight(Math.max(0, weight - 2.5))}
										style={styles.stepBtn}
									>
										<Typography variant="h3">−</Typography>
									</TouchableOpacity>
									<Typography variant="h2" style={styles.stepValue}>
										{weight}
									</Typography>
									<TouchableOpacity
										onPress={() => setWeight(weight + 2.5)}
										style={styles.stepBtn}
									>
										<Typography variant="h3">+</Typography>
									</TouchableOpacity>
								</View>
							</View>
						</View>

						<Button
							label="LOG SET & REST"
							fullWidth
							style={styles.logBtn}
							onPress={() => setIsResting(true)}
						/>
					</Card>
				)}

				{/* ── Rhythmic Pacer (Visual Anchor) ─────────────────────────── */}
				<View style={styles.pacerSection}>
					<View style={styles.pacerContainer}>
						<Animated.View
							style={[
								styles.pacerGlow,
								{ transform: [{ scale: pulseAnim }], opacity: 0.2 },
							]}
						/>
						<Animated.View
							style={[styles.pacerCore, { transform: [{ scale: pulseAnim }] }]}
						/>
						<Typography variant="caption" style={styles.pacerText}>
							PACE
						</Typography>
					</View>
					<Typography variant="bodySmall" color={colors.muted} align="center">
						Sync with the pulse for rhythmic motor planning.
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
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.lg,
		gap: spacing.xl,
	},
	controlCard: {
		gap: spacing.lg,
		paddingVertical: spacing.xl,
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: spacing.sm,
	},
	controlsRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: spacing.md,
	},
	controlGroup: {
		flex: 1,
		gap: spacing.sm,
	},
	stepper: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: colors.surface,
		borderRadius: radius.md,
		borderWidth: 1,
		borderColor: colors.border,
		height: 60,
		paddingHorizontal: spacing.xs,
	},
	stepBtn: {
		width: 40,
		height: 40,
		borderRadius: radius.sm,
		backgroundColor: colors.border,
		justifyContent: "center",
		alignItems: "center",
	},
	stepValue: {
		flex: 1,
		textAlign: "center",
	},
	logBtn: {
		marginTop: spacing.sm,
	},
	restCard: {
		paddingVertical: spacing.xxl,
		alignItems: "center",
		gap: spacing.xl,
	},
	restTimer: {
		fontSize: 72,
		color: colors.secondary,
		letterSpacing: 4,
	},
	pacerSection: {
		marginTop: "auto",
		paddingBottom: 40,
		alignItems: "center",
		gap: spacing.md,
	},
	pacerContainer: {
		width: 120,
		height: 120,
		justifyContent: "center",
		alignItems: "center",
	},
	pacerCore: {
		width: 60,
		height: 60,
		borderRadius: radius.full,
		backgroundColor: colors.primary,
		position: "absolute",
	},
	pacerGlow: {
		width: 100,
		height: 100,
		borderRadius: radius.full,
		backgroundColor: colors.primary,
		position: "absolute",
	},
	pacerText: {
		color: colors.onPrimary,
		fontWeight: "900",
		letterSpacing: 1,
	},
});
