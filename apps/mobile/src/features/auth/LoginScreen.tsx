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
import { type AuthUser, googleLoginAction, saveSessionAction } from "@/stores/authStore";
import { colors, spacing } from "@/theme";

// We try to import the library, but provide a mock if it's not installed yet
// biome-ignore lint/suspicious/noExplicitAny: library is optional
let GoogleSignin: any;
try {
	GoogleSignin = require("@react-native-google-signin/google-signin").GoogleSignin;
} catch {
	GoogleSignin = null;
}

export function LoginScreen({ navigation }: LoginScreenProps) {
	const saveSession = useSetAtom(saveSessionAction);
	const googleLogin = useSetAtom(googleLoginAction);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<{ email?: string; password?: string }>(
		{},
	);

	async function handleGoogleLogin() {
		setLoading(true);
		try {
			if (GoogleSignin) {
				// Actual implementation when library is installed
				// await GoogleSignin.hasPlayServices();
				// const userInfo = await GoogleSignin.signIn();
				// await googleLogin(userInfo.user);
			} else {
				// Mock implementation for local testing
				console.log("Google Sign-in library not found, using mock...");
				await new Promise((resolve) => setTimeout(resolve, 1000));
				await googleLogin({
					id: `google_${Date.now()}`,
					email: "google.user@example.com",
					name: "Google Explorer",
				});
			}
		} catch (error) {
			console.error("Google Login Error:", error);
			setErrors({ email: "Google login failed." });
		} finally {
			setLoading(false);
		}
	}

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
				age: 0,
				token: `mock_token_${Math.random().toString(36).substring(7)}`,
			};

			await saveSession(mockUser);
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

						<View style={styles.divider}>
							<View style={styles.line} />
							<Typography variant="bodySmall" color={colors.muted}>
								OR
							</Typography>
							<View style={styles.line} />
						</View>

						<Button
							label="Continue with Google"
							variant="outline"
							fullWidth
							loading={loading}
							onPress={handleGoogleLogin}
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
	divider: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		marginVertical: spacing.md,
	},
	line: {
		flex: 1,
		height: 1,
		backgroundColor: colors.border,
		opacity: 0.2,
	},
	footer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
});
