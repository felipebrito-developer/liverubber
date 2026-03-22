import { useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { colors, radius, spacing } from "@/theme";

const PREFLIGHT_ITEMS = [
	"Do you have a quiet space to focus?",
	"Do you have water or a drink nearby?",
	"Have you silenced notifications?",
];

interface PreflightModalProps {
	visible: boolean;
	onConfirm: () => void;
}

export function PreflightModal({ visible, onConfirm }: PreflightModalProps) {
	const [checked, setChecked] = useState<boolean[]>(
		PREFLIGHT_ITEMS.map(() => false),
	);
	const allChecked = checked.every(Boolean);

	function toggle(i: number) {
		setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
	}

	return (
		<Modal visible={visible} transparent animationType="fade">
			<View style={styles.overlay}>
				<Card style={styles.preflightCard}>
					<Typography variant="h3" align="center">
						Pre-flight Check ✈️
					</Typography>
					<Typography
						variant="bodySmall"
						color={colors.muted}
						align="center"
						style={styles.preflightSub}
					>
						A moment of preparation prevents flow interruptions.
					</Typography>

					<View style={styles.checkList}>
						{PREFLIGHT_ITEMS.map((item, i) => (
							<TouchableOpacity
								key={item}
								onPress={() => toggle(i)}
								style={styles.checkRow}
								activeOpacity={0.8}
								accessibilityRole="checkbox"
								accessibilityState={{ checked: checked[i] }}
							>
								<View
									style={[styles.checkbox, checked[i] && styles.checkboxDone]}
								>
									{checked[i] && (
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

					<Button
						label={allChecked ? "Let's go!" : "Check all items first"}
						fullWidth
						disabled={!allChecked}
						onPress={onConfirm}
						style={styles.goBtn}
					/>
				</Card>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.7)",
		justifyContent: "center",
		alignItems: "center",
		padding: spacing.xl,
	},
	preflightCard: {
		width: "100%",
		gap: spacing.md,
	},
	preflightSub: {
		marginTop: spacing.xs,
	},
	checkList: {
		gap: spacing.md,
	},
	checkRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.md,
	},
	checkbox: {
		width: 24,
		height: 24,
		borderRadius: radius.sm,
		borderWidth: 1.5,
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
	},
	goBtn: {
		marginTop: spacing.sm,
	},
});
