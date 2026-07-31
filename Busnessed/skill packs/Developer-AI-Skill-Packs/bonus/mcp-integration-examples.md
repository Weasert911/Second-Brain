# MCP Integration Examples

Model Context Protocol (MCP) setup examples for file system, database, API tool access, and custom server configurations.

## What is MCP?

Model Context Protocol is a standard that allows AI agents to interact with external tools, data sources, and services through a unified interface. These examples show how to wire up MCP servers alongside your Professional AI Skills.

## File System Access

### MCP Server Config
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/projects",
        "/path/to/shared"
      ]
    }
  }
}
```

### Usage with Skills
Load `Git-Workflow-Expert` + filesystem MCP to automate git operations across project directories.

## Database Access

### PostgreSQL MCP Server
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://user:pass@localhost:5432/mydb"
      ]
    }
  }
}
```

### Usage with Skills
Load `PostgreSQL-Expert` or `SQLx-Expert` alongside this MCP to let the AI inspect schema, run EXPLAIN, and suggest optimized queries.

## GitHub Integration

### GitHub MCP Server
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

### Usage with Skills
Load `GitHub-PR-Expert` + `GitHub-Actions-Expert` to let the AI create PRs, review code, and manage Actions workflows.

## Custom MCP Server (Python)

### Server Definition
```python
from mcp.server import Server, NotificationOptions
from mcp.server.models import InitializationOptions
import mcp.server.stdio

server = Server("code-analyzer")

@server.list_tools()
async def handle_list_tools():
    return [
        {
            "name": "analyze_complexity",
            "description": "Analyze cyclomatic complexity of a function",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "code": {"type": "string"},
                    "language": {"type": "string"}
                }
            }
        }
    ]

@server.call_tool()
async def handle_call_tool(name, arguments):
    if name == "analyze_complexity":
        # Your analysis logic here
        return {"result": "Complexity: 5 (moderate)"}

async def main():
    async with mcp.server.stdio.stdio_server() as (read, write):
        await server.run(read, write, InitializationOptions(
            server_name="code-analyzer",
            server_version="1.0.0"
        ))
```

## Combining MCP with Skills

### Example: Automated PR Review Pipeline
```
Trigger: New PR opened
MCP Tools: GitHub (read PR), Filesystem (checkout branch)
Loaded Skills: GitHub-PR-Expert, Rust-Testing-Expert (or relevant lang)
Workflow:
  1. Fetch PR diff via GitHub MCP
  2. Load relevant skill for code review
  3. Run tests via CI MCP
  4. Post review comments via GitHub MCP
```

## MCP Server Best Practices

| Practice | Why |
|----------|-----|
| Use environment variables for secrets | Never hardcode tokens |
| Scope file paths narrowly | Limit filesystem access to project dirs |
| Version pin your MCP servers | Avoid breaking changes |
| Test MCP servers independently | Debug connectivity before skill integration |
| Log MCP interactions | Audit what the AI accesses |

## Troubleshooting

### Server Not Connecting
```
Check: Is the MCP server running?
Check: Are the command and args correct?
Check: Are environment variables set?
```

### Tool Not Found
```
Verify the tool name matches what the server exposes.
Use the MCP inspector to list available tools.
```

### Permission Denied
```
Check filesystem paths have read/write permissions.
Check database user has proper grants.
Check GitHub token has required scopes.
```
