import { resolve } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

let mcpClient: Client | null = null;

export async function getMcpClient(): Promise<Client> {
	if (mcpClient) return mcpClient;

	// The service mcp server script path
	const serverPath = resolve(
		import.meta.dir,
		"../../../service/src/internal/mcp/server.ts",
	);

	const transport = new StdioClientTransport({
		command: "bun",
		args: ["run", serverPath],
		env: process.env as Record<string, string>,
	});

	mcpClient = new Client(
		{
			name: "ai-bridge",
			version: "0.1.0",
		},
		{
			capabilities: {},
		},
	);

	await mcpClient.connect(transport);

	console.log(`[ai-bridge] MCP Client connected to service at ${serverPath}`);

	return mcpClient;
}
