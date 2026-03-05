import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { AppNavigator } from "@/navigation/AppNavigator";
import { paperTheme } from "@/theme";

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
		<GestureHandlerRootView style={styles.root}>
			<JotaiProvider>
				<QueryClientProvider client={queryClient}>
					<PaperProvider theme={paperTheme}>
						<AppNavigator />
					</PaperProvider>
				</QueryClientProvider>
			</JotaiProvider>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
});
