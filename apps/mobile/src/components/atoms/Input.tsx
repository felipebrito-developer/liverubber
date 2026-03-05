import { useState } from "react";
import {
	StyleSheet,
	TextInput,
	type TextInputProps,
	View,
	type ViewStyle,
} from "react-native";
import { colors, radius, spacing } from "@/theme";
import { Typography } from "./Typography";

interface InputProps extends TextInputProps {
	error?: string;
	containerStyle?: ViewStyle;
}

export function Input({ error, containerStyle, style, ...rest }: InputProps) {
	const [focused, setFocused] = useState(false);

	return (
		<View style={[styles.container, containerStyle]}>
			<TextInput
				placeholderTextColor={colors.muted}
				style={[
					styles.input,
					focused && styles.inputFocused,
					error && styles.inputError,
					style,
				]}
				onFocus={(e) => {
					setFocused(true);
					rest.onFocus?.(e);
				}}
				onBlur={(e) => {
					setFocused(false);
					rest.onBlur?.(e);
				}}
				{...rest}
			/>
			{error ? (
				<Typography variant="caption" color={colors.error} style={styles.error}>
					{error}
				</Typography>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
	},
	input: {
		height: 52,
		backgroundColor: colors.surfaceElevated,
		borderRadius: radius.md,
		borderWidth: 1,
		borderColor: colors.border,
		paddingHorizontal: spacing.md,
		color: colors.onBackground,
		fontSize: 16,
	},
	inputFocused: {
		borderColor: colors.primary,
	},
	inputError: {
		borderColor: colors.error,
	},
	error: {
		marginTop: spacing.xs,
		marginLeft: spacing.xs,
	},
});
