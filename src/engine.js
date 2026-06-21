import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { getSystemTelemetry, formatBytes, formatUptime } from './sysInfo.js';
import { createFile, readFile, updateFile, deleteFile, listFiles, BASE_DIR } from './fileCrud.js';

// ═══════════════════════════════════════════════════════════════════════
//  VENOM.JS — Core Engine
//  Pure-data layer shared by both CLI and Web interfaces.
//  Every function returns structured data (JSON-serializable).
//  ZERO stdout/console.log calls — presentation is handled by consumers.
//  ⚠ EDUCATIONAL ONLY — no harmful actions are performed.
// ═══════════════════════════════════════════════════════════════════════

// ── Resolve workspace path ──────────────────────────────────────────
const __filename_engine = fileURLToPath(import.meta.url);
const __dirname_engine = path.dirname(__filename_engine);
const WORKSPACE_DIR = path.resolve(__dirname_engine, '..', 'workspace');

// ── Ensure workspace (sandbox) exists ───────────────────────────────
fs.mkdirSync(WORKSPACE_DIR, { recursive: true });

// ═══════════════════════════════════════════════════════════════════════
//  RECONNAISSANCE
// ═══════════════════════════════════════════════════════════════════════

/**
 * Gathers complete host machine telemetry.
 * @returns {Object} Structured telemetry object with system, cpu, memory, network, environment.
 */
const runRecon = () => {
  return getSystemTelemetry();
};

// ═══════════════════════════════════════════════════════════════════════
//  PAYLOAD OPERATIONS (CRUD)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Drops a payload file into the sandbox.
 * @param {string} filename - Target filename.
 * @param {string} content  - Payload content.
 * @returns {Object} Result object with success, operation, filename, size, createdAt.
 */
const dropPayload = (filename, content) => {
  return createFile(filename, content);
};

/**
 * Extracts (reads) data from a file in the sandbox.
 * @param {string} filename - Target filename.
 * @returns {Object} Result object with content or error.
 */
const extractData = (filename) => {
  return readFile(filename);
};

/**
 * Injects (appends) code into a file in the sandbox.
 * @param {string} filename - Target filename.
 * @param {string} content  - Content to inject.
 * @returns {Object} Result object with newSize or error.
 */
const injectCode = (filename, content) => {
  return updateFile(filename, content);
};

/**
 * Destroys evidence by deleting a file from the sandbox.
 * @param {string} filename - Target filename.
 * @returns {Object} Result object with success status.
 */
const destroyEvidence = (filename) => {
  return deleteFile(filename);
};

/**
 * Scans the target workspace directory.
 * @returns {Object} Result object with fileCount and file list.
 */
const scanTargetDirectory = () => {
  return listFiles();
};

// ═══════════════════════════════════════════════════════════════════════
//  DATA EXFILTRATION
// ═══════════════════════════════════════════════════════════════════════

/**
 * Exfiltrates system telemetry to a JSON report in the workspace.
 * @returns {Object} Result with success status, filename, and filepath.
 */
const exfiltrateData = () => {
  const telemetry = getSystemTelemetry();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `exfil-report-${timestamp}.json`;
  const filePath = path.join(WORKSPACE_DIR, filename);

  const report = {
    generatedAt: new Date().toISOString(),
    generator: 'VENOM.JS v1.0.0',
    classification: 'TARGET INTELLIGENCE REPORT',
    ...telemetry,
  };

  fs.writeFileSync(filePath, JSON.stringify(report, null, 2), 'utf-8');

  return {
    success: true,
    operation: 'EXFILTRATE',
    filename,
    filePath,
    message: `Intel exfiltrated to workspace/${filename}`,
  };
};

// ═══════════════════════════════════════════════════════════════════════
//  ATTACK CHAIN — Generator Pattern
//  Yields step-by-step results so each consumer (CLI/Web) can render
//  independently with their own timing, animations, and styling.
// ═══════════════════════════════════════════════════════════════════════

/**
 * Returns metadata for all 7 attack chain phases.
 * Useful for UI pre-rendering (e.g., showing the phase list).
 * @returns {Object[]} Array of phase metadata objects.
 */
const getAttackChainSteps = () => {
  return [
    { phase: '2.1', label: 'Payload Drop',         icon: '📦', description: 'Dropping payload to target filesystem' },
    { phase: '2.2', label: 'Data Extraction',       icon: '📖', description: 'Extracting payload data from target' },
    { phase: '2.3', label: 'Code Injection',        icon: '💉', description: 'Injecting additional code into target file' },
    { phase: '2.4', label: 'Verify Injection',      icon: '🔍', description: 'Verifying injection success' },
    { phase: '2.5', label: 'Evidence Cleanup',      icon: '🗑️',  description: 'Cleaning up evidence — removing traces' },
    { phase: '2.6', label: 'Verify Cleanup',        icon: '⚠️',  description: 'Confirming evidence destruction' },
    { phase: '2.7', label: 'Sandbox Escape Test',   icon: '🛡️',  description: 'Attempting sandbox escape via path traversal' },
  ];
};

/**
 * Generator function that executes the full 7-phase attack chain.
 * Yields a result object after each phase, allowing the consumer
 * to add delays, animations, or effects between steps.
 *
 * @yields {Object} { phase, label, icon, description, result, error? }
 */
function* runAttackChain() {
  const PAYLOAD_FILE = 'payload.txt';

  // ── PHASE 2.1: PAYLOAD DROP ─────────────────────────────────────
  const createResult = createFile(PAYLOAD_FILE, 'VENOM.JS was here. Initial payload delivered.');
  yield {
    phase: '2.1',
    label: 'Payload Drop',
    icon: '📦',
    description: 'Dropping payload to target filesystem',
    result: createResult,
  };

  // ── PHASE 2.2: DATA EXTRACTION ─────────────────────────────────
  const read1 = readFile(PAYLOAD_FILE);
  yield {
    phase: '2.2',
    label: 'Data Extraction',
    icon: '📖',
    description: 'Extracting payload data from target',
    result: read1,
  };

  // ── PHASE 2.3: CODE INJECTION ──────────────────────────────────
  const updateResult = updateFile(PAYLOAD_FILE, '\n[INJECTED] Secondary payload activated.');
  yield {
    phase: '2.3',
    label: 'Code Injection',
    icon: '💉',
    description: 'Injecting additional code into target file',
    result: updateResult,
  };

  // ── PHASE 2.4: VERIFY INJECTION ────────────────────────────────
  const read2 = readFile(PAYLOAD_FILE);
  yield {
    phase: '2.4',
    label: 'Verify Injection',
    icon: '🔍',
    description: 'Verifying injection success',
    result: read2,
  };

  // ── PHASE 2.5: EVIDENCE CLEANUP ────────────────────────────────
  const delResult = deleteFile(PAYLOAD_FILE);
  yield {
    phase: '2.5',
    label: 'Evidence Cleanup',
    icon: '🗑️',
    description: 'Cleaning up evidence — removing traces',
    result: delResult,
  };

  // ── PHASE 2.6: VERIFY CLEANUP ─────────────────────────────────
  const read3 = readFile(PAYLOAD_FILE);
  yield {
    phase: '2.6',
    label: 'Verify Cleanup',
    icon: '⚠️',
    description: 'Confirming evidence destruction',
    result: read3,
  };

  // ── PHASE 2.7: SANDBOX ESCAPE ATTEMPT ─────────────────────────
  let escapeResult;
  try {
    createFile('../escape.txt', 'Attempting to break free from sandbox.');
    escapeResult = {
      blocked: false,
      message: 'BREACH! File written outside sandbox!',
    };
  } catch (err) {
    escapeResult = {
      blocked: true,
      attack: 'createFile("../escape.txt", ...)',
      defense: err.message,
      verdict: 'CONTAINED ✔',
    };
  }

  yield {
    phase: '2.7',
    label: 'Sandbox Escape Test',
    icon: '🛡️',
    description: 'Attempting sandbox escape via path traversal',
    result: escapeResult,
  };
}

// ═══════════════════════════════════════════════════════════════════════
//  EXPORTS
// ═══════════════════════════════════════════════════════════════════════

export {
  runRecon,
  dropPayload,
  extractData,
  injectCode,
  destroyEvidence,
  scanTargetDirectory,
  exfiltrateData,
  runAttackChain,
  getAttackChainSteps,
  WORKSPACE_DIR,
};
