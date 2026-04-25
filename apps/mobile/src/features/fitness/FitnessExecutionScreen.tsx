import { useCallback, useEffect, useRef, useState } from "react";
import {
	Animated,
	Easing,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { ScreenHeader } from "@/components/molecules/ScreenHeader";
import type { FitnessTabScreenProps } from "@/navigation/types";
import { colors, radius, spacing } from "@/theme";

const REST_DURATION = 90;

export function FitnessExecutionScreen({
	navigation,
}: FitnessTabScreenProps<"FitnessExecution">) {
	const pulseAnim = useRef(new Animated.Value(1)).current;
	const [reps, setReps] = useState(10);
	const [weight, setWeight] = useState(60);
	const [setNumber, setSetNumber] = useState(1);
	const [isResting, setIsResting] = useState(false);
	const [restTime, setRestTime] = useState(REST_DURATION);
	const [lastSet, setLastSet] = useState<{ reps: number; weight: number } | null>(
		null,
	);

	const finishRest = useCallback(() => {
		setIsResting(false);
		setRestTime(REST_DURATION);
		setSetNumber((prev) => prev + 1);
	}, []);

	useEffect(() => {
		let timer: ReturnType<typeof setInterval>;
		if (isResting && restTime > 0) {
			timer = setInterval(() => {
				setRestTime((prev) => prev - 1);
			}, 1000);
		} else if (restTime === 0) {
			finishRest();
		}
		return () => clearInterval(timer);
	}, [isResting, restTime, finishRest]);

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(pulseAnim, {
					toValue: 1.15,
					duration: 1200,
					easing: Easing.inOut(Easing.ease),
					useNativeDriver: true,
				}),
				Animated.timing(pulseAnim, {
					toValue: 1,
					duration: 1200,
					easing: Easing.inOut(Easing.ease),
					useNativeDriver: true,
				}),
			]),
		).start();
	}, [pulseAnim]);

	function handleLogSet() {
		setLastSet({ reps, weight });
		setIsResting(true);
	}

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	// SVG Circular Progress calculation
	const size = 200;
	const strokeWidth = 10;
	const center = size / 2;
	const radiusCircle = size / 2 - strokeWidth / 2;
	const circumference = 2 * Math.PI * radiusCircle;
	const progress = restTime / REST_DURATION;
	const strokeDashoffset = circumference * (1 - progress);

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<ScreenHeader
				title="Execution"
				subtitle="Rhythmic physical presence."
				onDrawerOpen={() => navigation.openDrawer()}
			/>

			<View style={styles.container}>
				{/* ── Active Section ────────────────────────────────────────── */}
				{isResting ? (
					<Card elevated style={styles.restCard}>
						<Typography
							variant="label"
							color={colors.secondary}
							style={styles.restStatus}
						>
							RECOVERING NEURAL CAPACITY
						</Typography>

						<View style={styles.timerWrapper}>
							<Svg width={size} height={size}>
								<Circle
									cx={center}
									cy={center}
									r={radiusCircle}
									stroke={colors.border}
									strokeWidth={strokeWidth}
									fill="transparent"
									strokeOpacity={0.3}
								/>
								<Circle
									cx={center}
									cy={center}
									r={radiusCircle}
									stroke={colors.secondary}
									strokeWidth={strokeWidth}
									strokeDasharray={circumference}
									strokeDashoffset={strokeDashoffset}
									strokeLinecap="round"
									fill="transparent"
									transform={`rotate(-90 ${center} ${center})`}
								/>
							</Svg>
							<View style={styles.timerTextContainer}>
								<Typography variant="h1" style={styles.restTimer}>
									{formatTime(restTime)}
								</Typography>
							</View>
						</View>

						<Button
							label="Skip Rest →"
							variant="outline"
							onPress={finishRest}
							style={styles.skipBtn}
						/>
					</Card>
				) : (
					<Card elevated style={styles.controlCard}>
						<View style={styles.cardHeader}>
							<View>
								<Typography variant="h2">SET {setNumber}</Typography>
								{lastSet && (
									<Typography variant="caption" color={colors.muted}>
										Prev: {lastSet.reps} reps @ {lastSet.weight}kg
									</Typography>
								)}
							</View>
							<Typography variant="label" color={colors.accent}>
								✦ ACTIVE
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
										<Typography variant="h2" style={styles.stepSymbol}>
											−
										</Typography>
									</TouchableOpacity>
									<Typography variant="h1" style={styles.stepValue}>
										{reps}
									</Typography>
									<TouchableOpacity
										onPress={() => setReps(reps + 1)}
										style={styles.stepBtn}
									>
										<Typography variant="h2" style={styles.stepSymbol}>
											+
										</Typography>
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
										<Typography variant="h2" style={styles.stepSymbol}>
											−
										</Typography>
									</TouchableOpacity>
									<Typography variant="h1" style={styles.stepValue}>
										{weight}
									</Typography>
									<TouchableOpacity
										onPress={() => setWeight(weight + 2.5)}
										style={styles.stepBtn}
									>
										<Typography variant="h2" style={styles.stepSymbol}>
											+
										</Typography>
									</TouchableOpacity>
								</View>
							</View>
						</View>

						<Button
							label="LOG SET & REST"
							fullWidth
							style={styles.logBtn}
							onPress={handleLogSet}
						/>
					</Card>
				)}

				{/* ── Rhythmic Pacer (Visual Anchor) ─────────────────────────── */}
				<View style={styles.pacerSection}>
					<Typography variant="label" color={colors.muted} align="center">
						PACE ANCHOR
					</Typography>
					<View style={styles.pacerContainer}>
						<Animated.View
							style={[
								styles.pacerGlow,
								{ transform: [{ scale: pulseAnim }], opacity: 0.1 },
							]}
						/>
						<Animated.View
							style={[styles.pacerCore, { transform: [{ scale: pulseAnim }] }]}
						/>
					</View>
					<Typography variant="bodySmall" color={colors.muted} align="center">
						Sync motor movement with the expansion.
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
		gap: spacing.xl,
		paddingVertical: spacing.xl,
		borderColor: "rgba(168, 181, 162, 0.2)",
		borderWidth: 1,
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: spacing.xs,
	},
	controlsRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: spacing.lg,
	},
	controlGroup: {
		flex: 1,
		gap: spacing.md,
	},
	stepper: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: colors.surface,
		borderRadius: radius.xl,
		borderWidth: 1.5,
		borderColor: colors.border,
		height: 80,
		paddingHorizontal: spacing.sm,
	},
	stepBtn: {
		width: 44,
		height: 44,
		borderRadius: radius.lg,
		backgroundColor: "rgba(255,255,255,0.05)",
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: colors.border,
	},
	stepSymbol: {
		color: colors.primary,
		marginTop: -2,
	},
	stepValue: {
		flex: 1,
		textAlign: "center",
		fontSize: 32,
		fontWeight: "200",
	},
	logBtn: {
		marginTop: spacing.md,
		height: 64,
		backgroundColor: colors.primary,
	},
	restCard: {
		paddingVertical: spacing.xxl,
		alignItems: "center",
		gap: spacing.xl,
		borderColor: "rgba(212, 175, 55, 0.2)",
		borderWidth: 1,
	},
	restStatus: {
		letterSpacing: 2,
		fontWeight: "bold",
	},
	timerWrapper: {
		justifyContent: "center",
		alignItems: "center",
		marginVertical: spacing.md,
	},
	timerTextContainer: {
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
	},
	restTimer: {
		fontSize: 48,
		color: colors.secondary,
		fontWeight: "200",
		letterSpacing: 2,
	},
	skipBtn: {
		width: "60%",
		borderColor: colors.secondary,
	},
	pacerSection: {
		marginTop: "auto",
		paddingBottom: 40,
		alignItems: "center",
		gap: spacing.md,
	},
	pacerContainer: {
		width: 100,
		height: 100,
		justifyContent: "center",
		alignItems: "center",
	},
	pacerCore: {
		width: 40,
		height: 40,
		borderRadius: radius.full,
		backgroundColor: colors.primary,
		position: "absolute",
	},
	pacerGlow: {
		width: 80,
		height: 80,
		borderRadius: radius.full,
		backgroundColor: colors.primary,
		position: "absolute",
	},
});
