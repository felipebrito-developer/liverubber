// ─── neuro_ui_principles.md compliant theme ─────────────────────────────────
// Primary palette: Low-arousal tones for ADHD + Depression
// Background:  #121212 (Deep Slate) – reduces light sensitivity
// Primary:     #A8B5A2 (Muted Sage) – calmness
// Accent:      #D4AF37 (Soft Gold)  – "Meaning" highlights
// ─────────────────────────────────────────────────────────────────────────────
import { configureFonts, MD3DarkTheme } from "react-native-paper";

export const colors = {
	// Core background palette
	background: "#121212", // Deep Slate
	surface: "#1C1C1E", // slightly lighter surface
	surfaceElevated: "#242428", // elevated cards
	surfaceModal: "#2C2C30", // modal/sheet surfaces

	// Primary: Muted Sage (calm, grounding)
	primary: "#A8B5A2",
	primaryDark: "#7A9172",
	primaryLight: "#C4CFBF",
	onPrimary: "#121212",

	// Accent: Soft Gold (meaning, achievement)
	accent: "#D4AF37",
	accentDark: "#A88A20",
	accentLight: "#E8CC6B",
	onAccent: "#121212",

	// Semantic
	onBackground: "#E8E8EA", // slightly warm white
	onSurface: "#C8C8CC",
	muted: "#6E6E78",
	border: "#2C2C34",
	borderFocused: "#A8B5A2",

	// Status — never use red for overdue (per principle #2)
	success: "#7BAE7F", // muted green
	// "overdue" uses muted orange + "Let's try again?" copy
	overdueColor: "#C4824A", // Muted Orange — NOT red
	inProgress: "#8BA0C4", // muted blue-lavender

	// Error (only internal system errors – NOT shown to user for overdue)
	errorSystem: "#C4694A",

	// Specific UI roles
	meaningGold: "#D4AF37", // "Why" anchors
	winLoop: "#7BAE7F", // "Your future self is proud"
	ghostedTask: "#3A3A3E", // ghost list blurred items

	// ─── Convenience aliases (used by components) ───────────────────────────────
	/** Muted blue-lavender: secondary actions & "AI Insights" stat */
	secondary: "#8BA0C4",
	/** System error alias (not shown for overdue — use overdueColor copy instead) */
	error: "#C4694A",
	/** Muted orange: "Let's try again?" for overdue tasks */
	warning: "#C4824A",
} as const;

export const spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
	xxl: 48,
} as const;

export const radius = {
	sm: 6,
	md: 12,
	lg: 18,
	xl: 24,
	full: 9999,
} as const;

// Line-height: 1.5x standard to prevent "text swimming" during brain fog
export const typography = {
	h1: { fontSize: 30, fontWeight: "700" as const, lineHeight: 42 },
	h2: { fontSize: 24, fontWeight: "700" as const, lineHeight: 36 },
	h3: { fontSize: 20, fontWeight: "600" as const, lineHeight: 30 },
	body: { fontSize: 16, fontWeight: "400" as const, lineHeight: 24 }, // min 16sp per principle
	bodySmall: { fontSize: 14, fontWeight: "400" as const, lineHeight: 21 },
	label: { fontSize: 14, fontWeight: "600" as const, lineHeight: 21 },
	caption: { fontSize: 12, fontWeight: "400" as const, lineHeight: 18 },
} as const;

const fontConfig = { fontFamily: "System" };

export const paperTheme = {
	...MD3DarkTheme,
	dark: true,
	fonts: configureFonts({ config: fontConfig }),
	colors: {
		...MD3DarkTheme.colors,
		primary: colors.primary,
		secondary: colors.accent,
		background: colors.background,
		surface: colors.surface,
		onBackground: colors.onBackground,
		onSurface: colors.onSurface,
		onPrimary: colors.onPrimary,
		error: colors.errorSystem,
	},
};

export type AppTheme = typeof paperTheme;
