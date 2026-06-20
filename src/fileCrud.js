import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ═══════════════════════════════════════════════════════════════════════
//  VENOM.JS — Payload Engine (Safe File CRUD)
//  Simulates file manipulation capabilities of real malware:
//  payload delivery, data extraction, file modification, evidence cleanup.
//  ⚠ EDUCATIONAL ONLY — sandboxed to ./workspace, no escape possible.
// ═══════════════════════════════════════════════════════════════════════

// ── Resolve project root & sandbox directory ────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_DIR = path.resolve(__dirname, '..', 'workspace');

/**
 * SECURITY SANDBOX — resolves and validates every file path.
 * Simulates how real malware is often sandboxed by security researchers.
 * In our case, ALL operations are confined to ./workspace.
 *
 * @param {string} filename - The requested filename.
 * @returns {string} The safe, absolute path within the workspace.
 * @throws {Error} If the path attempts to escape the sandbox.
 */
const safePath = (filename) => {
  // ── Input validation ──────────────────────────────────────────────
  if (typeof filename !== 'string' || filename.trim().length === 0) {
    throw new Error(
      '[VALIDATION] Filename must be a non-empty string.'
    );
  }

  if (filename.includes('\0')) {
    throw new Error(
      '[SECURITY] Null bytes are not allowed in filenames.'
    );
  }

  // ── Sandbox enforcement ───────────────────────────────────────────
  const resolved = path.resolve(BASE_DIR, filename);

  if (!resolved.startsWith(BASE_DIR + path.sep) && resolved !== BASE_DIR) {
    throw new Error(
      `[SECURITY] Path traversal blocked: "${filename}" resolves outside the workspace sandbox.`
    );
  }

  // Block writes directly to the workspace directory itself
  if (resolved === BASE_DIR) {
    throw new Error(
      '[VALIDATION] Cannot perform file operations on the workspace directory itself.'
    );
  }

  return resolved;
};

/**
 * PAYLOAD DELIVERY — drops a file into the target workspace.
 * Simulates how malware writes payloads to disk.
 *
 * @param {string} filename - Name of the file to create.
 * @param {string} content  - Payload content to write.
 * @returns {Object} Result object with status and metadata.
 */
const createFile = (filename, content) => {
  const filePath = safePath(filename);
  fs.writeFileSync(filePath, content, 'utf-8');
  const stats = fs.statSync(filePath);
  return {
    success: true,
    operation: 'CREATE',
    filename,
    size: stats.size,
    createdAt: stats.birthtime.toISOString(),
  };
};

/**
 * DATA EXTRACTION — reads file contents from the target.
 * Simulates how malware exfiltrates data from victim machines.
 *
 * @param {string} filename - Name of the file to read.
 * @returns {Object} Result object with content or error information.
 */
const readFile = (filename) => {
  const filePath = safePath(filename);

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const stats = fs.statSync(filePath);
    return {
      success: true,
      operation: 'READ',
      filename,
      content,
      size: stats.size,
      modifiedAt: stats.mtime.toISOString(),
    };
  } catch (err) {
    if (err.code === 'ENOENT') {
      return {
        success: false,
        operation: 'READ',
        error: 'ENOENT',
        message: `Target file not found: "${filename}"`,
      };
    }
    throw err;
  }
};

/**
 * FILE INJECTION — appends content to an existing file.
 * Simulates how malware injects code into existing files.
 *
 * @param {string} filename   - Name of the file to inject into.
 * @param {string} newContent - Content to inject (append).
 * @returns {Object} Result object with status and metadata.
 */
const updateFile = (filename, newContent) => {
  const filePath = safePath(filename);
  fs.appendFileSync(filePath, newContent, 'utf-8');
  const stats = fs.statSync(filePath);
  return {
    success: true,
    operation: 'UPDATE',
    filename,
    newSize: stats.size,
    modifiedAt: stats.mtime.toISOString(),
  };
};

/**
 * EVIDENCE CLEANUP — removes files to cover tracks.
 * Simulates how malware deletes logs and traces after execution.
 *
 * @param {string} filename - Name of the file to remove.
 * @returns {Object} Result object with status information.
 */
const deleteFile = (filename) => {
  const filePath = safePath(filename);

  try {
    fs.unlinkSync(filePath);
    return {
      success: true,
      operation: 'DELETE',
      filename,
      message: `Evidence removed: "${filename}" deleted.`,
    };
  } catch (err) {
    if (err.code === 'ENOENT') {
      return {
        success: false,
        operation: 'DELETE',
        error: 'ENOENT',
        message: `Target not found — cannot delete: "${filename}"`,
      };
    }
    throw err;
  }
};

/**
 * DIRECTORY SCAN — lists all files in the target workspace.
 * Simulates how malware scans directories for valuable data.
 *
 * @returns {Object} Result object with array of file entries.
 */
const listFiles = () => {
  try {
    const entries = fs.readdirSync(BASE_DIR, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => {
        const stats = fs.statSync(path.join(BASE_DIR, e.name));
        return {
          name: e.name,
          size: stats.size,
          modified: stats.mtime.toISOString(),
        };
      });

    return {
      success: true,
      operation: 'LIST',
      directory: BASE_DIR,
      fileCount: files.length,
      files,
    };
  } catch (err) {
    return {
      success: false,
      operation: 'LIST',
      error: err.code,
      message: `Directory scan failed: ${err.message}`,
    };
  }
};

export { createFile, readFile, updateFile, deleteFile, listFiles, BASE_DIR };
