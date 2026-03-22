export const INITIAL_CATEGORIES = [
	{
		id: "cat-fitness",
		name: "Fitness",
		color: "#FF5722",
		description: "Physical health and training",
	},
	{
		id: "cat-home-cleaning",
		name: "Home Cleaning",
		color: "#2196F3",
		description: "Maintenance and cleaning tasks",
	},
	{
		id: "cat-home-organization",
		name: "Home Organization",
		color: "#9C27B0",
		description: "Decluttering and organizing spaces",
	},
	{
		id: "cat-resources",
		name: "Resources Management",
		color: "#4CAF50",
		description: "Inventory and supplies",
	},
	{
		id: "cat-health",
		name: "Health Activities",
		color: "#E91E63",
		description: "Wellbeing and medical",
	},
	{
		id: "cat-meals",
		name: "Meals",
		color: "#FFC107",
		description: "Cooking and eating",
	},
	{
		id: "cat-hobbies",
		name: "Hobbies",
		color: "#00BCD4",
		description: "Leisure and interest",
	},
	{
		id: "cat-studies",
		name: "Studies",
		color: "#3F51B5",
		description: "Education and learning",
	},
	{
		id: "cat-professional",
		name: "Professional",
		color: "#607D8B",
		description: "Work and career",
	},
];

export const INITIAL_TAGS = [
	{ id: "tag-urgent", name: "Urgent Priority", color: "#D32F2F" },
	{ id: "tag-critical", name: "Critical Priority", color: "#B71C1C" },
	{ id: "tag-low-priority", name: "Low Priority", color: "#8BC34A" },
	{ id: "tag-low-energy", name: "Low Energy", color: "#FFEB3B" },
	{ id: "tag-balanced-energy", name: "Balanced Energy", color: "#FF9800" },
	{ id: "tag-high-energy", name: "High Energy", color: "#F44336" },
	{ id: "tag-preparation", name: "Preparation", color: "#9E9E9E" },
];

export const INITIAL_FREQUENCIES = [
	{
		id: "freq-daily",
		type: "repeat",
		name: "Daily",
		period: "day",
		amount: 1,
		repeat: true,
	},
	{
		id: "freq-workdays",
		type: "repeat",
		name: "Work Days",
		period: "day",
		amount: 1,
		repeat: true,
	},
	{
		id: "freq-weekend",
		type: "repeat",
		name: "Weekend",
		period: "day",
		amount: 1,
		repeat: true,
	},
	{
		id: "freq-oneshot",
		type: "once",
		name: "One shot",
		period: "once",
		amount: 1,
		repeat: false,
	},
	{
		id: "freq-hourly",
		type: "repeat",
		name: "Hourly",
		period: "hour",
		amount: 1,
		repeat: true,
	},
];
