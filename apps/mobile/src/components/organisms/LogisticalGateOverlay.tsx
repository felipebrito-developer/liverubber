import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import {
	Modal,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Button } from "@/components/atoms/Button";
import { Select } from "@/components/atoms/Select";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { activePreflightAtom, clearPreflightAction } from "@/stores/preflightStore";
import { colors, radius, spacing } from "@/theme";

/**
 * 🧭 Logistical Gate (The Threshold)
 * Purpose: Ensures all physical/mental requirements are met before engaging focus.
 * Unified Version: Uses global preflight state.
 */
export function LogisticalGateOverlay() {
	const [activePreflight] = useAtom(activePreflightAtom);
	const clearPreflight = useSetAtom(clearPreflightAction);
	
	const [checked, setChecked] = useState<Record<string, boolean>>({});
	const [capacity, setCapacity] = useState("tag-balanced-energy");

	if (!activePreflight) return null;

	const { title, resources, onConfirm } = activePreflight;
	const allResourcesChecked = resources.every((r) => checked[r]);

	const toggle = (resource: string) => {
		setChecked((prev) => ({ ...prev, [resource]: !prev[resource] }));
	};

	const handleConfirm = () => {
		if (onConfirm) onConfirm();
		clearPreflight();
		setChecked({}); // Reset for next time
	};

	const handleClose = () => {
		clearPreflight();
		setChecked({});
	};

	return (
		<Modal visible={!!activePreflight} transparent animationType="fade">
			<View style={styles.overlay}>
				<Card elevated style={styles.gateCard}>
					<View style={styles.header}>
						<Typography variant="label" style={styles.microLabel}>
							THE THRESHOLD
						</Typography>
						<Typography variant="h2" align="center" style={styles.gateTitle}>
							Logistical Gate 🚪
						</Typography>
						<Typography
							variant="bodySmall"
							color={colors.muted}
							align="center"
							style={styles.subtitle}
						>
							A moment of preparation prevents flow interruptions.
						</Typography>
					</View>

					<ScrollView
						style={styles.content}
						showsVerticalScrollIndicator={false}
					>
						<View style={styles.section}>
							<Typography variant="label" style={styles.sectionTitle}>
								ENGAGING ACTIVITY
							</Typography>
							<Card style={styles.activityAnchor}>
								<Typography variant="h3" align="center" color={colors.primary}>
									{title}
								</Typography>
							</Card>
						</View>

						{resources.length > 0 && (
							<View style={styles.section}>
								<Typography variant="label" style={styles.sectionTitle}>
									RESOURCE PREPARATION
								</Typography>
								<View style={styles.checkList}>
									{resources.map((item) => (
										<TouchableOpacity
											key={item}
											onPress={() => toggle(item)}
											style={styles.checkRow}
											activeOpacity={0.8}
										>
											<View
												style={[
													styles.checkbox,
													checked[item] && styles.checkboxDone,
												]}
											>
												{checked[item] && (
													<Typography
														variant="caption"
														style={{ color: colors.onPrimary }}
													>
														✓
													</Typography>
												)}
											</View>
											<Typography variant="bodySmall" style={styles.checkLabel}>
												{item}
											</Typography>
										</TouchableOpacity>
									))}
								</View>
							</View>
						)}

						<View style={styles.section}>
							<Typography variant="label" style={styles.sectionTitle}>
								INTERNAL CAPACITY
							</Typography>
							<Select
								label="Current Energy"
								value={capacity}
								options={[
									{ label: "Low (Small Wins)", value: "tag-low-energy" },
									{ label: "Steady (Normal)", value: "tag-balanced-energy" },
									{ label: "Peak (Deep Work)", value: "tag-high-energy" },
								]}
								onValueChange={setCapacity}
							/>
						</View>
					</ScrollView>

					<View style={styles.actions}>
						<Button
							label="Recalibrate"
							variant="outline"
							onPress={handleClose}
							style={styles.recalibrateBtn}
						/>
						<Button
							label="Start Now 🚀"
							onPress={handleConfirm}
							style={styles.startBtn}
							disabled={!allResourcesChecked}
						/>
					</View>
				</Card>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(18, 18, 18, 0.95)", // Deep Slate overlay
		justifyContent: "center",
		padding: spacing.xl,
	},
	gateCard: {
		maxHeight: "85%",
		gap: spacing.lg,
		borderColor: colors.primary,
		borderWidth: 1,
		backgroundColor: colors.surface,
	},
	header: {
		gap: spacing.xs,
		alignItems: "center",
	},
	microLabel: {
		fontSize: 10,
		letterSpacing: 2,
		color: colors.primary,
	},
	gateTitle: {
		marginTop: spacing.xs,
	},
	subtitle: {
		marginTop: spacing.xs,
		fontStyle: "italic",
	},
	content: {
		maxHeight: 400,
	},
	section: {
		marginBottom: spacing.lg,
		gap: spacing.sm,
	},
	sectionTitle: {
		color: colors.muted,
		fontSize: 10,
		letterSpacing: 1,
		fontWeight: "600",
	},
	activityAnchor: {
		backgroundColor: "rgba(168, 181, 162, 0.1)",
		borderColor: colors.primary,
		borderWidth: 0.5,
		paddingVertical: spacing.md,
	},
	checkList: {
		gap: spacing.sm,
		marginTop: spacing.xs,
	},
	checkRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.md,
		paddingVertical: spacing.sm,
		backgroundColor: "rgba(255,255,255,0.02)",
		paddingHorizontal: spacing.sm,
		borderRadius: radius.md,
	},
	checkbox: {
		width: 28,
		height: 28,
		borderRadius: radius.sm,
		borderWidth: 2,
		borderColor: colors.border,
		justifyContent: "center",
		alignItems: "center",
	},
	checkboxDone: {
		backgroundColor: colors.primary,
		borderColor: colors.primary,
	},
	checkLabel: {
		flex: 1,
		fontWeight: "500",
	},
	actions: {
		flexDirection: "row",
		gap: spacing.md,
		marginTop: spacing.md,
	},
	recalibrateBtn: {
		flex: 1,
		borderColor: colors.muted,
	},
	startBtn: {
		flex: 1.5,
		backgroundColor: colors.primary,
	},
});
