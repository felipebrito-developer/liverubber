import { StyleSheet, View } from "react-native";
import { Typography } from "@/components/atoms/Typography";
import { colors, spacing } from "@/theme";

export function WIPScreen({ name }: { name: string }) {
	return (
		<View style={styles.container}>
			<Typography variant="h2">{name} Module</Typography>
			<Typography variant="body" align="center" color={colors.muted}>
				This module is currently under strategic refinement by the specialist
				agents. 🤖
			</Typography>
			<Typography variant="caption" style={{ marginTop: spacing.xl }}>
				Phase: Contract Definition (TDD)
			</Typography>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: spacing.xl,
		gap: spacing.md,
		backgroundColor: colors.background,
	},
});
