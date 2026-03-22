import { useAtomValue } from "jotai";
import { StyleSheet, View } from "react-native";
import { userAtom } from "@/stores/authStore";
import { colors, spacing } from "@/theme";
import { Typography } from "../atoms/Typography";
import { Card } from "./Card";

export function UserIdentityCard() {
	const user = useAtomValue(userAtom);

	if (!user) return null;

	return (
		<Card style={styles.container}>
			<View style={styles.row}>
				<View style={styles.avatar}>
					<Typography variant="h3" color={colors.primary}>
						{user.name.charAt(0).toUpperCase()}
					</Typography>
				</View>
				<View style={styles.info}>
					<Typography variant="label">{user.name}</Typography>
					<Typography variant="caption" color={colors.muted}>
						{user.age} Years Old • {user.email}
					</Typography>
				</View>
			</View>
		</Card>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "transparent",
		borderWidth: 0,
		padding: 0,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.md,
	},
	avatar: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: colors.surface,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: colors.border,
	},
	info: {
		flex: 1,
		gap: 2,
	},
});
