import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerGetTasksTool, registerQueryGoalsTool } from "./tools/index.js";

const server = new McpServer({
	name: "liverubber-mcp",
	version: "0.1.0",
});

// Register all tools
registerGetTasksTool(server);
registerQueryGoalsTool(server);

// Start the server with stdio transport (consumed by ai-bridge as a subprocess)
const transport = new StdioServerTransport();

await server.connect(transport);

console.error("[MCP] LiveRubber MCP server running on stdio");
