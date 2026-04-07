import { useNavigation } from "@react-navigation/native";
import { StatusBar, StyleSheet, View } from "react-native";
import { Typography } from "@/components/atoms/Typography";
import { ScreenHeader } from "@/components/molecules/ScreenHeader";
import { colors, spacing } from "@/theme";
import type { AnyType } from "@liverubber/shared";

export function WIPScreen({ name }: { name: string }) {
	const navigation = useNavigation<AnyType>();

	return (
		<View style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<ScreenHeader
				title={name}
				subtitle="Module under construction"
				onDrawerOpen={() => navigation.openDrawer()}
			/>
			<View style={styles.content}>
				<Typography variant="h2">{name} Module</Typography>
				<Typography variant="body" align="center" color={colors.muted}>
					This module is currently under strategic refinement by the specialist
					agents. 🤖
				</Typography>
				<Typography variant="caption" style={{ marginTop: spacing.xl }}>
					Phase: Contract Definition (TDD)
				</Typography>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	content: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: spacing.xl,
		gap: spacing.md,
	},
});
