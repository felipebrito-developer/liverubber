import { useState } from "react";
import {
	FlatList,
	Modal,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { colors, radius, spacing } from "@/theme";
import { Typography } from "./Typography";

interface SelectOption {
	label: string;
	value: string;
	color?: string;
}

interface SelectProps {
	label?: string;
	placeholder?: string;
	value: string | null;
	options: SelectOption[];
	onValueChange: (value: string) => void;
	error?: string;
}

export function Select({
	label,
	placeholder = "Select an option",
	value,
	options,
	onValueChange,
	error,
}: SelectProps) {
	const [modalVisible, setModalVisible] = useState(false);

	const selectedOption = options.find((opt) => opt.value === value);

	const handleSelect = (val: string) => {
		onValueChange(val);
		setModalVisible(false);
	};

	return (
		<View style={styles.container}>
			{label && (
				<Typography variant="label" style={styles.label}>
					{label}
				</Typography>
			)}

			<TouchableOpacity
				style={[styles.trigger, !!error && styles.triggerError]}
				onPress={() => setModalVisible(true)}
				activeOpacity={0.7}
			>
				<View style={styles.triggerContent}>
					{selectedOption?.color && (
						<View
							style={[styles.dot, { backgroundColor: selectedOption.color }]}
						/>
					)}
					<Typography
						variant="bodySmall"
						style={selectedOption ? styles.valueText : styles.placeholderText}
					>
						{selectedOption ? selectedOption.label : placeholder}
					</Typography>
				</View>
				<Typography variant="caption" color={colors.muted}>
					▼
				</Typography>
			</TouchableOpacity>

			{error && (
				<Typography variant="caption" color={colors.error} style={styles.error}>
					{error}
				</Typography>
			)}

			<Modal
				visible={modalVisible}
				transparent
				animationType="fade"
				onRequestClose={() => setModalVisible(false)}
			>
				<TouchableOpacity
					style={styles.modalOverlay}
					activeOpacity={1}
					onPress={() => setModalVisible(false)}
				>
					<View style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<Typography variant="h3">
								{label || "Choose an Option"}
							</Typography>
						</View>

						<FlatList
							data={options}
							keyExtractor={(item) => item.value}
							renderItem={({ item }) => (
								<TouchableOpacity
									style={[
										styles.optionItem,
										item.value === value && styles.optionItemActive,
									]}
									onPress={() => handleSelect(item.value)}
								>
									{item.color && (
										<View
											style={[styles.dot, { backgroundColor: item.color }]}
										/>
									)}
									<Typography
										style={item.value === value ? styles.optionTextActive : {}}
									>
										{item.label}
									</Typography>
									{item.value === value && (
										<Typography color={colors.primary} style={styles.check}>
											✓
										</Typography>
									)}
								</TouchableOpacity>
							)}
							ItemSeparatorComponent={() => <View style={styles.separator} />}
							contentContainerStyle={styles.listContent}
						/>

						<TouchableOpacity
							style={styles.closeBtn}
							onPress={() => setModalVisible(false)}
						>
							<Typography color={colors.primary} variant="label">
								CLOSE
							</Typography>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
	},
	label: {
		marginBottom: spacing.xs,
		opacity: 0.8,
	},
	trigger: {
		height: 48,
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.md,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: spacing.md,
	},
	triggerError: {
		borderColor: colors.error,
	},
	triggerContent: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	placeholderText: {
		color: colors.muted,
	},
	valueText: {
		color: colors.onSurface,
	},
	error: {
		marginTop: 4,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.6)",
		justifyContent: "center",
		padding: spacing.xl,
	},
	modalContent: {
		backgroundColor: colors.surface,
		borderRadius: radius.lg,
		maxHeight: "80%",
		overflow: "hidden",
	},
	modalHeader: {
		padding: spacing.lg,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	listContent: {
		paddingVertical: spacing.sm,
	},
	optionItem: {
		flexDirection: "row",
		alignItems: "center",
		padding: spacing.lg,
		gap: spacing.md,
	},
	optionItemActive: {
		backgroundColor: "rgba(0, 122, 255, 0.05)",
	},
	optionTextActive: {
		color: colors.primary,
		fontWeight: "600",
	},
	check: {
		marginLeft: "auto",
		fontWeight: "bold",
	},
	separator: {
		height: 1,
		backgroundColor: colors.border,
		opacity: 0.3,
	},
	closeBtn: {
		padding: spacing.lg,
		alignItems: "center",
		borderTopWidth: 1,
		borderTopColor: colors.border,
	},
});
