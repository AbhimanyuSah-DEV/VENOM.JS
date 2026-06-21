import express from 'express';
import { createServer } from 'node:http';
import { WebSocketServer } from 'ws';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  runRecon, dropPayload, extractData, injectCode,
  destroyEvidence, scanTargetDirectory, exfiltrateData,
  runAttackChain, getAttackChainSteps, WORKSPACE_DIR,
} from './src/engine.js';

// ═══════════════════════════════════════════════════════════════════════
//  VENOM.JS — Web Backend Bridge
//  Express serves static files. WebSocket bridges the core engine
//  to the browser-based Brutalist UI.
//  ⚠ EDUCATIONAL ONLY — no harmful actions are performed.
// ═══════════════════════════════════════════════════════════════════════

const __filename_server = fileURLToPath(import.meta.url);
const __dirname_server = path.dirname(__filename_server);

const PORT = process.env.PORT || 3000;

// ── Express: Static File Server ─────────────────────────────────────
const app = express();
app.use(express.static(path.join(__dirname_server, 'public')));

const server = createServer(app);

// ── WebSocket Server ────────────────────────────────────────────────
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('[VENOM.JS] Client connected via WebSocket');

  ws.on('message', async (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      ws.send(JSON.stringify({ type: 'ERROR', data: 'Invalid JSON message' }));
      return;
    }

    const { type, payload } = msg;

    try {
      switch (type) {
        // ── Reconnaissance ──────────────────────────────────────
        case 'RUN_RECON': {
          const result = runRecon();
          ws.send(JSON.stringify({ type: 'RECON_RESULT', data: result }));
          break;
        }

        // ── Payload CRUD ────────────────────────────────────────
        case 'DROP_PAYLOAD': {
          const result = dropPayload(payload.filename, payload.content);
          ws.send(JSON.stringify({ type: 'PAYLOAD_RESULT', data: result }));
          break;
        }

        case 'EXTRACT_DATA': {
          const result = extractData(payload.filename);
          ws.send(JSON.stringify({ type: 'EXTRACT_RESULT', data: result }));
          break;
        }

        case 'INJECT_CODE': {
          const result = injectCode(payload.filename, '\n' + payload.content);
          ws.send(JSON.stringify({ type: 'INJECT_RESULT', data: result }));
          break;
        }

        case 'DESTROY_EVIDENCE': {
          const result = destroyEvidence(payload.filename);
          ws.send(JSON.stringify({ type: 'DESTROY_RESULT', data: result }));
          break;
        }

        // ── Scan Directory ──────────────────────────────────────
        case 'SCAN_DIRECTORY': {
          const result = scanTargetDirectory();
          ws.send(JSON.stringify({ type: 'SCAN_RESULT', data: result }));
          break;
        }

        // ── Exfiltrate Data ─────────────────────────────────────
        case 'EXFILTRATE': {
          const result = exfiltrateData();
          ws.send(JSON.stringify({ type: 'EXFIL_RESULT', data: result }));
          break;
        }

        // ── Attack Chain (step-by-step with delays) ─────────────
        case 'RUN_ATTACK_CHAIN': {
          const chain = runAttackChain();
          const delayMs = 1500;

          for (const step of chain) {
            ws.send(JSON.stringify({ type: 'ATTACK_PHASE', data: step }));
            await new Promise((r) => setTimeout(r, delayMs));
          }

          ws.send(JSON.stringify({ type: 'ATTACK_COMPLETE', data: { message: 'Attack chain complete. All phases executed.' } }));
          break;
        }

        // ── Run Tests (stream child process output) ─────────────
        case 'RUN_TESTS': {
          const testProcess = spawn('node', ['test.js'], {
            cwd: __dirname_server,
            shell: true,
          });

          testProcess.stdout.on('data', (chunk) => {
            // Strip ANSI codes for clean browser rendering
            const text = chunk.toString().replace(/\x1b\[[0-9;]*m/g, '');
            ws.send(JSON.stringify({ type: 'TEST_OUTPUT', data: { text } }));
          });

          testProcess.stderr.on('data', (chunk) => {
            const text = chunk.toString().replace(/\x1b\[[0-9;]*m/g, '');
            ws.send(JSON.stringify({ type: 'TEST_OUTPUT', data: { text, isError: true } }));
          });

          testProcess.on('close', (code) => {
            ws.send(JSON.stringify({ type: 'TEST_COMPLETE', data: { exitCode: code } }));
          });
          break;
        }

        // ── Kill Switch ─────────────────────────────────────────
        case 'KILL_SWITCH': {
          ws.send(JSON.stringify({ type: 'KILLED', data: { message: 'Connection terminated. No traces left behind.' } }));
          break;
        }

        default:
          ws.send(JSON.stringify({ type: 'ERROR', data: `Unknown command: ${type}` }));
      }
    } catch (err) {
      ws.send(JSON.stringify({
        type: 'ERROR',
        data: { message: err.message, command: type },
      }));
    }
  });

  ws.on('close', () => {
    console.log('[VENOM.JS] Client disconnected');
  });
});

// ── Start Server ────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`\n  ☠  VENOM.JS Web Interface active`);
  console.log(`  ➤  http://localhost:${PORT}`);
  console.log(`  ➤  WebSocket ready on ws://localhost:${PORT}`);
  console.log(`  ⚠  Educational purposes only.\n`);
});
