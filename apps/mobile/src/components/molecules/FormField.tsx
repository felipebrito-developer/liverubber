import type { TextInputProps } from "react-native";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { Input } from "@/components/atoms/Input";
import { Typography } from "@/components/atoms/Typography";
import { colors, spacing } from "@/theme";

interface FormFieldProps extends TextInputProps {
	label: string;
	error?: string;
	containerStyle?: ViewStyle;
}

export function FormField({
	label,
	error,
	containerStyle,
	...inputProps
}: FormFieldProps) {
	return (
		<View style={[styles.container, containerStyle]}>
			<Typography variant="label" style={styles.label}>
				{label}
			</Typography>
			<Input error={error} {...inputProps} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		gap: spacing.xs,
	},
	label: {
		color: colors.onSurface,
		marginBottom: 2,
	},
});
