import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { StyleSheet, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./navigation/AppNavigator";
import { paperTheme } from "./theme";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 2,
			staleTime: 1000 * 30, // 30 seconds
		},
	},
});

export default function App() {
	return (
		<SafeAreaProvider>
			<View style={styles.root}>
				<JotaiProvider>
					<QueryClientProvider client={queryClient}>
						<PaperProvider theme={paperTheme}>
							<AppNavigator />
						</PaperProvider>
					</QueryClientProvider>
				</JotaiProvider>
			</View>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
});
