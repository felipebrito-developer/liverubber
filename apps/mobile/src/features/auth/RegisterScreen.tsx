import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";
import { FormField } from "@/components/molecules/FormField";
import type { RegisterScreenProps } from "@/navigation/types";
import { colors, spacing } from "@/theme";

export function RegisterScreen({ navigation }: RegisterScreenProps) {
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
			// TODO: hook up to auth service
			await new Promise((r) => setTimeout(r, 800));
			navigation.navigate("Home");
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
	footer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
});
