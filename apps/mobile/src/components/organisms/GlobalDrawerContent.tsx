import {
	type DrawerContentComponentProps,
	DrawerContentScrollView,
	DrawerItemList,
} from "@react-navigation/drawer";
import { useSetAtom } from "jotai";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { logoutAction } from "@/stores/authStore";
import { colors, spacing } from "@/theme";
import { Typography } from "../atoms/Typography";
import { UserIdentityCard } from "../molecules/UserIdentityCard";

export function GlobalDrawerContent(props: DrawerContentComponentProps) {
	const logout = useSetAtom(logoutAction);

	return (
		<DrawerContentScrollView
			{...props}
			contentContainerStyle={styles.container}
			style={{ backgroundColor: colors.background }}
		>
			<View style={styles.header}>
				<UserIdentityCard />
			</View>

			<View style={styles.list}>
				<DrawerItemList {...props} />
			</View>

			<View style={styles.footer}>
				<Typography variant="caption" color={colors.muted}>
					v0.0.1 - Beta
				</Typography>
				<TouchableOpacity
					onPress={() => logout()}
					style={styles.logoutBtn}
					activeOpacity={0.7}
				>
					<Typography color={colors.overdueColor}>Logout</Typography>
				</TouchableOpacity>
			</View>
		</DrawerContentScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: spacing.xl,
	},
	header: {
		paddingHorizontal: spacing.xl,
		paddingBottom: spacing.xl,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
		marginBottom: spacing.md,
	},
	list: {
		flex: 1,
	},
	footer: {
		paddingHorizontal: spacing.xl,
		paddingVertical: spacing.md,
		borderTopWidth: 1,
		borderTopColor: colors.border,
		gap: spacing.xs,
	},
	logoutBtn: {
		marginTop: spacing.sm,
	},
});
