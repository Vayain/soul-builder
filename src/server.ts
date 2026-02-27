/**
 * Soul Builder MCP Server
 * OpenAI ChatGPT App SDK Entry Point
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import express from 'express';
import {
  startSoulBuilder,
  answerQuestion,
  generateSoul,
  exportSoul,
  getActiveSessionCount,
} from './soul-builder';

const PORT = process.env.PORT || 3000;

// Tool definitions
const TOOLS = [
  {
    name: 'start_soul_builder',
    description: 'Startet eine neue Soul Builder Session. Gibt Willkommensnachricht und erste Frage zurück.',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'Unique session identifier',
        },
      },
      required: ['session_id'],
    },
  },
  {
    name: 'answer_question',
    description: 'Nimmt eine Antwort auf die aktuelle Frage entgegen und gibt die nächste Frage oder Abschluss-Status zurück.',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'Session identifier',
        },
        answer: {
          type: 'string',
          description: 'Die Antwort des Nutzers auf die aktuelle Frage',
        },
      },
      required: ['session_id', 'answer'],
    },
  },
  {
    name: 'generate_soul',
    description: 'Generiert das fertige SOUL.md aus allen gesammelten Antworten.',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'Session identifier',
        },
      },
      required: ['session_id'],
    },
  },
  {
    name: 'export_soul',
    description: 'Exportiert das SOUL.md als plain text zum Kopieren oder Download.',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'Session identifier',
        },
      },
      required: ['session_id'],
    },
  },
];

// Create MCP Server
const server = new Server(
  {
    name: 'soul-builder',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;

    switch (name) {
      case 'start_soul_builder':
        result = startSoulBuilder(args?.session_id as string);
        break;

      case 'answer_question':
        result = answerQuestion(
          args?.session_id as string,
          args?.answer as string
        );
        break;

      case 'generate_soul':
        result = generateSoul(args?.session_id as string);
        break;

      case 'export_soul':
        result = exportSoul(args?.session_id as string);
        break;

      default:
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: false, message: `Unknown tool: ${name}` }),
            },
          ],
        };
    }

    // Format response
    let responseText = result.message;

    if (result.nextQuestion) {
      responseText += `\n\n**Frage ${result.currentStep}/${result.totalSteps}:** ${result.nextQuestion}`;
    }

    if (result.soulMd) {
      responseText += `\n\n---\n\n${result.soulMd}`;
    }

    return {
      content: [
        {
          type: 'text',
          text: responseText,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ success: false, message: errorMessage }),
        },
      ],
      isError: true,
    };
  }
});

// Express health check server
const app = express();

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'soul-builder',
    version: '1.0.0',
    activeSessions: getActiveSessionCount(),
  });
});

// Start servers
async function main() {
  // Start HTTP health check server
  app.listen(PORT, () => {
    console.log(`Soul Builder health server running on port ${PORT}`);
  });

  // Start MCP server on stdio
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log('Soul Builder MCP server running on stdio');
}

main().catch((error) => {
  console.error('Failed to start Soul Builder:', error);
  process.exit(1);
});
