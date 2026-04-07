import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/molecules/Card";
import { colors, radius, spacing } from "@/theme";

interface PreflightModalProps {
	visible: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	resources: string[];
}

export function PreflightModal({
	visible,
	onClose,
	onConfirm,
	title,
	resources,
}: PreflightModalProps) {
	return (
		<Modal
			transparent
			visible={visible}
			animationType="fade"
			onRequestClose={onClose}
		>
			<View style={styles.overlay}>
				<Card style={styles.modalCard}>
					<Typography variant="h2" style={styles.title}>
						Pre-flight Checklist
					</Typography>
					<Typography
						variant="bodySmall"
						color={colors.muted}
						style={styles.subtitle}
					>
						Ready to focus on: <Typography variant="label">{title}</Typography>
					</Typography>

					<View style={styles.checklist}>
						<Typography variant="label" style={styles.checkTitle}>
							Do you have everything?
						</Typography>
						{resources.length > 0 ? (
							resources.map((res) => (
								<View key={res} style={styles.checkItem}>
									<Typography variant="body">• {res}</Typography>
								</View>
							))
						) : (
							<Typography variant="body" color={colors.muted}>
								No specific resources needed for this session.
							</Typography>
						)}
					</View>

					<View style={styles.footer}>
						<TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
							<Typography variant="label" color={colors.muted}>
								NOT YET
							</Typography>
						</TouchableOpacity>
						<TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
							<Typography variant="label" style={styles.confirmText}>
								READY TO START
							</Typography>
						</TouchableOpacity>
					</View>
				</Card>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.85)",
		justifyContent: "center",
		padding: spacing.xl,
	},
	modalCard: {
		padding: spacing.xl,
		gap: spacing.md,
		backgroundColor: colors.surfaceElevated,
	},
	title: {
		textAlign: "center",
	},
	subtitle: {
		textAlign: "center",
		marginBottom: spacing.sm,
	},
	checklist: {
		backgroundColor: colors.surface,
		padding: spacing.md,
		borderRadius: radius.md,
		gap: spacing.xs,
	},
	checkTitle: {
		marginBottom: spacing.xs,
		color: colors.primary,
	},
	checkItem: {
		paddingVertical: 4,
	},
	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: spacing.md,
		gap: spacing.md,
	},
	cancelBtn: {
		flex: 1,
		alignItems: "center",
		paddingVertical: spacing.md,
		borderRadius: radius.md,
		borderWidth: 1,
		borderColor: colors.border,
	},
	confirmBtn: {
		flex: 2,
		alignItems: "center",
		paddingVertical: spacing.md,
		backgroundColor: colors.primary,
		borderRadius: radius.md,
	},
	confirmText: {
		color: colors.onPrimary,
		fontWeight: "bold",
	},
});
