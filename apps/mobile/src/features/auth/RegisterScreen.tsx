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
	Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { FormField } from "@/components/molecules/FormField";
import type { RegisterScreenProps } from "@/navigation/types";
import { api } from "@/services/api";
import { type AuthUser, googleLoginAction, userAtom } from "@/stores/authStore";
import { colors, spacing } from "@/theme";

// Optional dependency handling
// biome-ignore lint/suspicious/noExplicitAny: library is optional
let GoogleSignin: any;
try {
	GoogleSignin = require("@react-native-google-signin/google-signin").GoogleSignin;
} catch {
	GoogleSignin = null;
}

export function RegisterScreen({ navigation }: RegisterScreenProps) {
	const setUser = useSetAtom(userAtom);
	const googleLogin = useSetAtom(googleLoginAction);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<{
		name?: string;
		email?: string;
		password?: string;
	}>({});

	function validate() {
		const next: typeof errors = {};
		if (name.trim().length < 2)
			next.name = "Name must be at least 2 characters.";
		if (!email.includes("@")) next.email = "Enter a valid email address.";
		if (password.length < 6) next.password = "Password must be 6+ characters.";
		setErrors(next);
		return Object.keys(next).length === 0;
	}

	async function handleRegister() {
		if (!validate()) return;
		setLoading(true);
		try {
			const response = await api.post<{ token: string; user: AuthUser }>(
				"/auth/register",
				{ name, email, password },
			);
			setUser(response.user);
		} catch {
			setErrors({
				email: "Registration failed. This email might already be in use.",
			});
		} finally {
			setLoading(false);
		}
	}

	async function handleGoogleLogin() {
		setLoading(true);
		try {
			if (GoogleSignin) {
				// Real implementation placeholder
			} else {
				// Mock for local development
				Alert.alert("Google Sign-in", "Simulating Google Sign-up...");
				await new Promise((resolve) => setTimeout(resolve, 1500));
				await googleLogin({
					id: `google_${Date.now()}`,
					email: "google.user@example.com",
					name: "Google Explorer",
				});
				Alert.alert("Success", "Registered with Google (Mock)");
			}
		} catch (error) {
			console.error("Google Login Error:", error);
			setErrors({ email: "Google registration failed." });
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
						<Typography variant="h2">Create Account</Typography>
						<Typography variant="body" color={colors.muted} style={styles.sub}>
							Join LiveRubber today
						</Typography>
					</View>

					<View style={styles.form}>
						<FormField
							label="Full Name"
							placeholder="Jane Doe"
							autoCapitalize="words"
							autoComplete="name"
							value={name}
							onChangeText={setName}
							error={errors.name}
						/>
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
							autoComplete="new-password"
							value={password}
							onChangeText={setPassword}
							error={errors.password}
						/>
						<Button
							label="Create Account"
							fullWidth
							loading={loading}
							onPress={handleRegister}
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
							Already have an account?{" "}
						</Typography>
						<TouchableOpacity
							onPress={() => navigation.navigate("Login")}
							activeOpacity={0.7}
						>
							<Typography variant="bodySmall" color={colors.primary}>
								Sign In
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
