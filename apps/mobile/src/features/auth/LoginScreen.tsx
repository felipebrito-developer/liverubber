import { useSetAtom } from "jotai";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { FormField } from "@/components/molecules/FormField";
import type { LoginScreenProps } from "@/navigation/types";
import { type AuthUser, saveSessionAction } from "@/stores/authStore";
import { colors, spacing } from "@/theme";

export function LoginScreen({ navigation }: LoginScreenProps) {
	const saveSession = useSetAtom(saveSessionAction);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<{ email?: string; password?: string }>(
		{},
	);

	function validate() {
		const next: typeof errors = {};
		if (!email.includes("@")) next.email = "Enter a valid email address.";
		if (password.length < 6) next.password = "Password must be 6+ characters.";
		setErrors(next);
		return Object.keys(next).length === 0;
	}
	async function handleLogin() {
		if (!validate()) return;
		setLoading(true);
		try {
			// Simulating auth since AI bridge integration is paused
			const mockUser: AuthUser = {
				id: `mock_${Date.now()}`,
				email,
				name: email.split("@")[0],
				token: `mock_token_${Math.random().toString(36).substring(7)}`,
			};

			await saveSession(mockUser);
			// navigation.navigate("MainTab") is now handled by the navigator guard
		} catch {
			setErrors({ email: "Login failed. Please check your credentials." });
		} finally {
			setLoading(false);
		}
	}

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<ScrollView
					contentContainerStyle={styles.container}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.header}>
						<Typography variant="h2">Welcome back</Typography>
						<Typography variant="body" color={colors.muted} style={styles.sub}>
							Sign in to continue
						</Typography>
					</View>

					<View style={styles.form}>
						<FormField
							label="Email"
							placeholder="you@example.com"
							keyboardType="email-address"
							autoCapitalize="none"
							autoComplete="email"
							value={email}
							onChangeText={setEmail}
							error={errors.email}
						/>
						<FormField
							label="Password"
							placeholder="••••••••"
							secureTextEntry
							autoComplete="current-password"
							value={password}
							onChangeText={setPassword}
							error={errors.password}
						/>
						<Button
							label="Sign In"
							fullWidth
							loading={loading}
							onPress={handleLogin}
							style={styles.submitBtn}
						/>
					</View>

					<View style={styles.footer}>
						<Typography variant="bodySmall" color={colors.muted}>
							Don't have an account?{" "}
						</Typography>
						<TouchableOpacity
							onPress={() => navigation.navigate("Register")}
							activeOpacity={0.7}
						>
							<Typography variant="bodySmall" color={colors.primary}>
								Register
							</Typography>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
		backgroundColor: colors.background,
	},
	container: {
		flexGrow: 1,
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.xxl,
		paddingBottom: spacing.xl,
		justifyContent: "center",
		gap: spacing.xl,
	},
	header: {
		gap: spacing.xs,
	},
	sub: {
		marginTop: spacing.xs,
	},
	form: {
		gap: spacing.md,
	},
	submitBtn: {
		marginTop: spacing.sm,
	},
	footer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
});
