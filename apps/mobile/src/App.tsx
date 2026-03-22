import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initializeDatabase } from "./db/client";
import AppNavigator from "./navigation/AppNavigator";
import { loadSessionAction } from "./stores/authStore";
import { paperTheme } from "./theme";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 2,
			staleTime: 1000 * 30, // 30 seconds
		},
	},
});

function AppInitialiser({ children }: { children: React.ReactNode }) {
	const [isReady, setIsReady] = useState(false);
	const loadSession = useSetAtom(loadSessionAction);

	useEffect(() => {
		async function setup() {
			await initializeDatabase();
			await loadSession();
			setIsReady(true);
		}
		setup();
	}, [loadSession]);

	if (!isReady) {
		return (
			<View
				style={[
					styles.root,
					{ justifyContent: "center", alignItems: "center" },
				]}
			>
				<Text>Initializing...</Text>
			</View>
		);
	}

	return <>{children}</>;
}

export default function App() {
	return (
		<SafeAreaProvider>
			<GestureHandlerRootView style={styles.root}>
				<View style={styles.root}>
					<JotaiProvider>
						<AppInitialiser>
							<QueryClientProvider client={queryClient}>
								<PaperProvider theme={paperTheme}>
									<AppNavigator />
								</PaperProvider>
							</QueryClientProvider>
						</AppInitialiser>
					</JotaiProvider>
				</View>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
});
