/**
 * Soul Builder MCP Server
 * OpenAI ChatGPT App SDK — HTTP Transport für Remote-Hosting (Render.com etc.)
 *
 * Unterschied zu stdio: Hier verbindet sich ChatGPT per HTTP mit diesem Server.
 * Das ist notwendig für jedes Remote-Hosting und für die ChatGPT App Submission.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
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

// Tool-Definitionen (für jeden Request gleich)
const TOOLS = [
  {
    name: 'start_soul_builder',
    description: 'Startet eine neue Soul Builder Session. Gibt Willkommensnachricht und erste Frage zurück.',
    annotations: {
      readOnlyHint: false,      // Creates a new session entry in memory
      openWorldHint: false,     // Only interacts with local in-memory session storage, no external APIs
      destructiveHint: false,   // Creates new data only, never modifies or deletes existing sessions
    },
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
    annotations: {
      readOnlyHint: false,      // Updates session state: stores answer and increments step counter
      openWorldHint: false,     // Only modifies local in-memory session state, no external systems involved
      destructiveHint: false,   // Adds/updates user answers additively; no data is deleted or overwritten destructively
    },
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
    annotations: {
      readOnlyHint: true,       // Only reads session state to compile the SOUL.md; no state is modified
      openWorldHint: false,     // Only reads local in-memory session data, no external systems
      destructiveHint: false,   // Pure read + format operation; nothing is modified or deleted
    },
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
    annotations: {
      readOnlyHint: true,       // Only reads session state and formats SOUL.md for export; no state modification
      openWorldHint: false,     // Only reads local in-memory session data, no external systems
      destructiveHint: false,   // Read-only export operation; no data is modified or deleted
    },
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

/**
 * Erstellt eine neue MCP Server-Instanz mit allen Tools.
 * Pro HTTP-Request eine neue Instanz (stateless transport),
 * aber die Session-Daten leben im soul-builder.ts Modul (persistent im Memory).
 */
function createMcpServer(): Server {
  const server = new Server(
    { name: 'soul-builder', version: '1.0.0' },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
  });

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
            content: [{ type: 'text', text: JSON.stringify({ success: false, message: `Unknown tool: ${name}` }) }],
          };
      }

      // Antwort zusammenbauen
      let responseText = result.message;
      if (result.nextQuestion) {
        responseText += `\n\n**Frage ${result.currentStep}/${result.totalSteps}:** ${result.nextQuestion}`;
      }
      if (result.soulMd) {
        responseText += `\n\n---\n\n${result.soulMd}`;
      }

      return {
        content: [{ type: 'text', text: responseText }],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [{ type: 'text', text: JSON.stringify({ success: false, message: errorMessage }) }],
        isError: true,
      };
    }
  });

  return server;
}

// Express App
const app = express();
app.use(express.json());

// OpenAI Domain Verification — ChatGPT App SDK
app.get('/.well-known/openai-apps-challenge', (_req, res) => {
  res.type('text/plain').send('xr7LFaQzddtuyuxnxZO-fRJdovEYwqhm1V7CrjXhktg');
});

// Health Check — Render.com braucht das für den Alive-Check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'soul-builder',
    version: '1.0.0',
    activeSessions: getActiveSessionCount(),
  });
});

// Root — für den Browser (App Directory Link)
app.get('/', (_req, res) => {
  res.json({
    name: 'Soul Builder',
    description: 'Gib deinem KI-Agenten eine Identität. — ag3nt.id',
    mcp_endpoint: '/mcp',
    health: '/health',
  });
});

/**
 * MCP HTTP Endpoint — POST /mcp
 * ChatGPT sendet alle MCP-Anfragen hierher.
 * StreamableHTTPServerTransport (stateless) — Session-State liegt im soul-builder.ts Modul.
 */
app.post('/mcp', async (req, res) => {
  const server = createMcpServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless mode
  });

  // Server aufräumen wenn Verbindung geschlossen
  res.on('close', () => {
    server.close().catch(console.error);
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error('MCP request error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// GET /mcp — Für MCP Inspector / Debugging
app.get('/mcp', (_req, res) => {
  res.json({
    endpoint: 'POST /mcp',
    protocol: 'MCP Streamable HTTP',
    service: 'soul-builder',
    version: '1.0.0',
  });
});

// Server starten
app.listen(PORT, () => {
  console.log(`\n🚀 Soul Builder läuft auf Port ${PORT}`);
  console.log(`   MCP Endpoint:  POST http://localhost:${PORT}/mcp`);
  console.log(`   Health Check:  GET  http://localhost:${PORT}/health`);
  console.log(`   Root:          GET  http://localhost:${PORT}/\n`);
});
