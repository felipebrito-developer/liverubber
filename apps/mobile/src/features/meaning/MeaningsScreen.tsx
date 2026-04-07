import type { Meaning, NewMeaning } from "@liverubber/shared";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { Alert, FlatList, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FAB } from "@/components/atoms/FAB";
import { Typography } from "@/components/atoms/Typography";
import { ScreenHeader } from "@/components/molecules/ScreenHeader";
import { MeaningCreationModal } from "@/components/organisms";
import type { StrategicTabScreenProps } from "@/navigation/types";
import {
	createMeaningAction,
	deleteMeaningAction,
	isMeaningsLoadedAtom,
	loadMeaningsAction,
	meaningsAtom,
	updateMeaningAction,
} from "@/stores/meaningsStore";
import { colors, spacing } from "@/theme";
import { MeaningCard } from "./components";

export function MeaningsScreen({
	navigation,
}: StrategicTabScreenProps<"Meanings">) {
	const meanings = useAtomValue(meaningsAtom);
	const isMeaningsLoaded = useAtomValue(isMeaningsLoadedAtom);
	const loadMeanings = useSetAtom(loadMeaningsAction);
	const createMeaning = useSetAtom(createMeaningAction);
	const updateMeaning = useSetAtom(updateMeaningAction);
	const deleteMeaning = useSetAtom(deleteMeaningAction);

	const [isMeaningModalVisible, setIsMeaningModalVisible] = useState(false);
	const [editingMeaning, setEditingMeaning] = useState<Meaning | null>(null);

	useEffect(() => {
		if (!isMeaningsLoaded) loadMeanings();
	}, [isMeaningsLoaded, loadMeanings]);

	const handleSaveMeaning = async (payload: Omit<NewMeaning, "id">) => {
		if (editingMeaning) {
			await updateMeaning({
				id: editingMeaning.id,
				data: payload,
			});
		} else {
			await createMeaning(payload);
		}

		handleCloseMeaningModal();
	};

	const handleEditPress = (meaning: Meaning) => {
		setEditingMeaning(meaning);
		setIsMeaningModalVisible(true);
	};

	const handleDeletePress = (meaning: Meaning) => {
		Alert.alert(
			"Prune Meaning",
			"Are you sure? Removing this will also un-anchor its attached Goals.",
			[
				{ text: "Keep it", style: "cancel" },
				{
					text: "Remove",
					style: "destructive",
					onPress: async () => {
						await deleteMeaning(meaning.id);
					},
				},
			],
		);
	};

	const handleCloseMeaningModal = () => {
		setIsMeaningModalVisible(false);
		setEditingMeaning(null);
	};

	return (
		<SafeAreaView style={styles.safe}>
			<StatusBar barStyle="light-content" backgroundColor={colors.background} />
			<ScreenHeader
				title="Meanings"
				subtitle="The 'Why' behind every action."
				onDrawerOpen={() => navigation.openDrawer()}
			/>

			<FlatList
				data={meanings}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<MeaningCard
						meaning={item}
						onEdit={() => handleEditPress(item)}
						onDelete={() => handleDeletePress(item)}
					/>
				)}
				contentContainerStyle={styles.list}
				showsVerticalScrollIndicator={false}
				ListFooterComponent={<View style={{ height: 100 }} />}
				ListEmptyComponent={
					isMeaningsLoaded ? (
						<View style={styles.empty}>
							<Typography color={colors.muted} align="center">
								No meanings found.{"\n"}Start by defining what matters!
							</Typography>
						</View>
					) : null
				}
			/>

			<FAB onPress={() => setIsMeaningModalVisible(true)} variant="primary" />

			<MeaningCreationModal
				visible={isMeaningModalVisible}
				onClose={handleCloseMeaningModal}
				onSave={handleSaveMeaning}
				editingMeaning={editingMeaning}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
		backgroundColor: colors.background,
	},
	list: {
		paddingHorizontal: spacing.xl,
		paddingBottom: spacing.xl,
		gap: spacing.md,
	},
	empty: {
		marginTop: spacing.xxl,
		alignItems: "center",
	},
});
