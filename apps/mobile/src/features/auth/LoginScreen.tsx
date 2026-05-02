import auth from "@react-native-firebase/auth";
import {
	GoogleSignin,
	statusCodes,
} from "@react-native-google-signin/google-signin";
import { useSetAtom } from "jotai";
import { useState } from "react";
import {
	Alert,
	KeyboardAvoidingView,
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
import {
	type AuthUser,
	googleLoginAction,
	saveSessionAction,
} from "@/stores/authStore";
import { colors, spacing } from "@/theme";

// Configure Google Sign-In
// Note: webClientId is required for Android even if you only want to get the ID token
GoogleSignin.configure({
	webClientId:
		"YOUR_WEB_CLIENT_ID_FROM_GOOGLE_CONSOLE.apps.googleusercontent.com", // TODO: Replace with actual ID
	offlineAccess: true,
});

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
			await GoogleSignin.hasPlayServices();
			const userInfo = await GoogleSignin.signIn();

			// 1. Get the credential from the Google Sign-In response
			const { idToken } = userInfo.data || {};
			if (!idToken) {
				throw new Error("No ID Token found from Google Sign-In");
			}

			// 2. Create a Firebase credential from the Google ID token
			const googleCredential = auth.GoogleAuthProvider.credential(idToken);

			// 3. Sign-in to Firebase with the credential
			const userCredential =
				await auth().signInWithCredential(googleCredential);
			const firebaseUser = userCredential.user;

			if (firebaseUser) {
				await googleLogin({
					id: firebaseUser.uid,
					email: firebaseUser.email || "",
					name: firebaseUser.displayName || "Google User",
					idToken: idToken,
				});
				Alert.alert("Success", `Welcome ${firebaseUser.displayName}!`);
			}
		} catch (error: any) {
			console.error("Google Login Error:", error);
			if (error.code === statusCodes.SIGN_IN_CANCELLED) {
				// user cancelled the login flow
			} else if (error.code === statusCodes.IN_PROGRESS) {
				// operation (e.g. sign in) is in progress already
			} else if (
				error.code === "auth/account-exists-with-different-credential"
			) {
				Alert.alert(
					"Error",
					"An account already exists with the same email address but different sign-in credentials.",
				);
			} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				Alert.alert("Error", "Google Play Services not available");
			} else {
				Alert.alert(
					"Developer Note",
					`Google Login failed. Ensure 'google-services.json' is added and SHA-1 is registered in Firebase Console.\n\nError: ${error.message}`,
				);
			}
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
			<KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
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

						<TouchableOpacity
							onPress={async () => {
								setLoading(true);
								await saveSession({
									id: "test_user_1",
									email: "test@liverubber.app",
									name: "Test Explorer",
									age: 28,
									token: "dev_bypass_token",
								});
								setLoading(false);
							}}
							style={{ marginTop: spacing.md, alignSelf: "center" }}
						>
							<Typography variant="caption" color={colors.primary}>
								🛠️ BYPASS LOGIN (TEST USER)
							</Typography>
						</TouchableOpacity>
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
