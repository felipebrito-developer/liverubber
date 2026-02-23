/**
 * Sensitive keyword list — prompts containing any of these terms
 * are routed to the local Ollama model instead of Gemini.
 *
 * Keep this list lowercase. Matching is case-insensitive substring search.
 *
 * Categories:
 *   - Personal task/diary content markers
 *   - Identity / personal information references
 *   - Health / emotional / behavioral context
 */
export const SENSITIVE_KEYWORDS: string[] = [
	// Task & personal content
	"task",
	"tarefa",
	"goal",
	"meta",
	"diary",
	"diário",
	"journal",
	"note",
	"nota",
	"todo",
	"schedule",
	"agenda",
	"routine",
	"rotina",

	// Identity
	"my name",
	"meu nome",
	"i am",
	"eu sou",
	"i feel",
	"me sinto",
	"i need",
	"preciso",
	"my",
	"meu",
	"minha",

	// Health / behavioral
	"adhd",
	"anxiety",
	"ansiedade",
	"depression",
	"depressão",
	"medication",
	"medicação",
	"therapy",
	"terapia",
	"exercise",
	"exercício",
	"sleep",
	"sono",
	"mood",
	"humor",
];
