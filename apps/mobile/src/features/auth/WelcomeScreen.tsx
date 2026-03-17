import { Dimensions, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import type { WelcomeScreenProps } from "@/navigation/types";
import { colors, spacing } from "@/theme";

const { height } = Dimensions.get("window");

export function WelcomeScreen({ navigation }: WelcomeScreenProps) {
	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar
				barStyle="light-content"
				backgroundColor={colors.background}
				translucent={true}
			/>
			<View style={styles.container}>
				{/* Hero Area */}
				<View style={styles.hero}>
					<View style={styles.logoContainer}>
						<View style={styles.logoRing}>
							<View style={styles.logoDot} />
						</View>
					</View>
					<Typography variant="h1" align="center" style={styles.appName}>
						LiveRubber
					</Typography>
					<Typography
						variant="body"
						align="center"
						color={colors.muted}
						style={styles.tagline}
					>
						Your AI-powered task assistant.{"\n"}Work smarter, not harder.
					</Typography>
				</View>

				{/* Actions */}
				<View style={styles.actions}>
					<Button
						label="Get Started"
						fullWidth
						onPress={() => navigation.navigate("Login")}
					/>
					<Button
						label="Create an Account"
						variant="outline"
						fullWidth
						style={styles.secondaryBtn}
						onPress={() => navigation.navigate("Register")}
					/>
					<Typography
						variant="caption"
						align="center"
						style={styles.disclaimer}
					>
						By continuing, you agree to our Terms of Service.
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
		justifyContent: "space-between",
		paddingTop: height * 0.08,
		paddingBottom: spacing.xl,
	},
	hero: {
		alignItems: "center",
		gap: spacing.md,
	},
	logoContainer: {
		marginBottom: spacing.lg,
	},
	logoRing: {
		width: 96,
		height: 96,
		borderRadius: 48,
		borderWidth: 3,
		borderColor: colors.primary,
		justifyContent: "center",
		alignItems: "center",
	},
	logoDot: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: colors.primary,
	},
	appName: {
		letterSpacing: 1,
	},
	tagline: {
		lineHeight: 26,
	},
	actions: {
		gap: spacing.sm,
	},
	secondaryBtn: {
		marginTop: spacing.xs,
	},
	disclaimer: {
		marginTop: spacing.sm,
	},
});
