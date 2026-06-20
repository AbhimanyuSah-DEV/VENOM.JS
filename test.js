// ═══════════════════════════════════════════════════════════════════════
//  GOD-LEVEL TEST SUITE — Security, Edge Cases & Crash Resistance
//  Tests: path traversal variants, null bytes, type coercion,
//         empty inputs, Unicode, concurrent operations, and more.
// ═══════════════════════════════════════════════════════════════════════

import { createFile, readFile, updateFile, deleteFile, listFiles, BASE_DIR } from './src/fileCrud.js';
import { getSystemTelemetry, formatBytes, formatUptime } from './src/sysInfo.js';
import { progressBar, drawBox, stripAnsi } from './src/utils.js';
import fs from 'node:fs';
import path from 'node:path';

// ── Test Framework ──────────────────────────────────────────────────
let passed = 0;
let failed = 0;
const failures = [];

const test = (name, fn) => {
  try {
    fn();
    passed++;
    console.log(`  \x1b[92m✔ PASS\x1b[0m  ${name}`);
  } catch (err) {
    failed++;
    failures.push({ name, error: err.message });
    console.log(`  \x1b[91m✖ FAIL\x1b[0m  ${name}`);
    console.log(`         \x1b[2m${err.message}\x1b[0m`);
  }
};

const assert = (condition, msg) => {
  if (!condition) throw new Error(msg || 'Assertion failed');
};

const assertThrows = (fn, expectedSubstring) => {
  try {
    fn();
    throw new Error('Expected function to throw, but it did not');
  } catch (err) {
    if (err.message === 'Expected function to throw, but it did not') throw err;
    if (expectedSubstring && !err.message.includes(expectedSubstring)) {
      throw new Error(`Expected error containing "${expectedSubstring}", got: "${err.message}"`);
    }
  }
};

// ── Ensure workspace exists ─────────────────────────────────────────
fs.mkdirSync(BASE_DIR, { recursive: true });

// ═══════════════════════════════════════════════════════════════════════
//  1. PATH TRAVERSAL ATTACKS
// ═══════════════════════════════════════════════════════════════════════
console.log('\n\x1b[96m\x1b[1m━━━ SECURITY: Path Traversal Attacks ━━━\x1b[0m\n');

test('Block simple ../', () => {
  assertThrows(() => createFile('../escape.txt', 'data'), 'SECURITY');
});

test('Block ../../ (double traversal)', () => {
  assertThrows(() => createFile('../../escape.txt', 'data'), 'SECURITY');
});

test('Block deeply nested traversal', () => {
  assertThrows(() => createFile('../../../../../../../etc/passwd', 'data'), 'SECURITY');
});

test('Block backslash traversal (Windows)', () => {
  assertThrows(() => createFile('..\\escape.txt', 'data'), 'SECURITY');
});

test('Block mixed slash traversal', () => {
  assertThrows(() => createFile('..\\..\\escape.txt', 'data'), 'SECURITY');
});

test('Block traversal hidden in subdirectory', () => {
  assertThrows(() => createFile('subdir/../../escape.txt', 'data'), 'SECURITY');
});

test('Block absolute path escape (C:\\)', () => {
  assertThrows(() => createFile('C:\\Windows\\System32\\evil.txt', 'data'), 'SECURITY');
});

test('Block absolute path escape (/etc)', () => {
  assertThrows(() => createFile('/etc/passwd', 'data'), 'SECURITY');
});

test('Block readFile with traversal', () => {
  assertThrows(() => readFile('../package.json'), 'SECURITY');
});

test('Block updateFile with traversal', () => {
  assertThrows(() => updateFile('../package.json', 'injected'), 'SECURITY');
});

test('Block deleteFile with traversal', () => {
  assertThrows(() => deleteFile('../package.json'), 'SECURITY');
});

// ═══════════════════════════════════════════════════════════════════════
//  2. NULL BYTE INJECTION
// ═══════════════════════════════════════════════════════════════════════
console.log('\n\x1b[96m\x1b[1m━━━ SECURITY: Null Byte Injection ━━━\x1b[0m\n');

test('Block null byte in filename', () => {
  assertThrows(() => createFile('test\x00.txt', 'data'), 'SECURITY');
});

// ═══════════════════════════════════════════════════════════════════════
//  3. CRUD HAPPY PATH
// ═══════════════════════════════════════════════════════════════════════
console.log('\n\x1b[96m\x1b[1m━━━ CRUD: Happy Path ━━━\x1b[0m\n');

test('CREATE returns structured result', () => {
  const result = createFile('test_happy.txt', 'Hello World');
  assert(result.success === true, 'success should be true');
  assert(result.operation === 'CREATE', 'operation should be CREATE');
  assert(result.size === 11, `size should be 11, got ${result.size}`);
  assert(typeof result.createdAt === 'string', 'createdAt should be ISO string');
});

test('READ returns correct content', () => {
  const result = readFile('test_happy.txt');
  assert(result.success === true, 'success should be true');
  assert(result.content === 'Hello World', `content mismatch: "${result.content}"`);
  assert(result.size === 11, `size should be 11, got ${result.size}`);
});

test('UPDATE appends content', () => {
  const result = updateFile('test_happy.txt', '\nLine 2');
  assert(result.success === true, 'success should be true');
  assert(result.operation === 'UPDATE', 'operation should be UPDATE');
  assert(result.newSize === 18, `size should be 18, got ${result.newSize}`);
});

test('READ after UPDATE shows both lines', () => {
  const result = readFile('test_happy.txt');
  assert(result.content === 'Hello World\nLine 2', `content mismatch: "${result.content}"`);
});

test('DELETE succeeds', () => {
  const result = deleteFile('test_happy.txt');
  assert(result.success === true, 'success should be true');
  assert(result.operation === 'DELETE', 'operation should be DELETE');
});

test('READ after DELETE returns structured error', () => {
  const result = readFile('test_happy.txt');
  assert(result.success === false, 'success should be false');
  assert(result.error === 'ENOENT', `error should be ENOENT, got ${result.error}`);
  assert(typeof result.message === 'string', 'message should exist');
});

// ═══════════════════════════════════════════════════════════════════════
//  4. CRUD EDGE CASES
// ═══════════════════════════════════════════════════════════════════════
console.log('\n\x1b[96m\x1b[1m━━━ CRUD: Edge Cases ━━━\x1b[0m\n');

test('Create file with empty string content', () => {
  const result = createFile('empty.txt', '');
  assert(result.success === true);
  assert(result.size === 0, `expected 0 bytes, got ${result.size}`);
  deleteFile('empty.txt');
});

test('Create file with very long content (100KB)', () => {
  const bigContent = 'A'.repeat(100 * 1024);
  const result = createFile('big.txt', bigContent);
  assert(result.success === true);
  assert(result.size === 100 * 1024);
  const read = readFile('big.txt');
  assert(read.content.length === 100 * 1024, 'read content size mismatch');
  deleteFile('big.txt');
});

test('Create file with Unicode content', () => {
  const content = '日本語テスト 🎉🚀 Ñoño';
  const result = createFile('unicode.txt', content);
  assert(result.success === true);
  const read = readFile('unicode.txt');
  assert(read.content === content, `Unicode mismatch: "${read.content}"`);
  deleteFile('unicode.txt');
});

test('Create file with special characters in content', () => {
  const content = 'Line1\nLine2\tTabbed\r\nWindows line';
  const result = createFile('special.txt', content);
  assert(result.success === true);
  const read = readFile('special.txt');
  assert(read.content === content);
  deleteFile('special.txt');
});

test('DELETE non-existent file returns graceful error (no crash)', () => {
  const result = deleteFile('ghost_file_that_does_not_exist.txt');
  assert(result.success === false);
  assert(result.error === 'ENOENT');
});

test('Multiple DELETEs on same file are idempotent', () => {
  createFile('temp_del.txt', 'temp');
  const r1 = deleteFile('temp_del.txt');
  assert(r1.success === true);
  const r2 = deleteFile('temp_del.txt');
  assert(r2.success === false);
  assert(r2.error === 'ENOENT');
});

test('CREATE overwrites existing file', () => {
  createFile('overwrite.txt', 'original');
  createFile('overwrite.txt', 'replaced');
  const read = readFile('overwrite.txt');
  assert(read.content === 'replaced', `expected "replaced", got "${read.content}"`);
  deleteFile('overwrite.txt');
});

test('UPDATE on non-existent file creates it (appendFileSync behavior)', () => {
  // appendFileSync creates the file if it doesn't exist
  const result = updateFile('append_new.txt', 'first line');
  assert(result.success === true);
  const read = readFile('append_new.txt');
  assert(read.content === 'first line');
  deleteFile('append_new.txt');
});

test('LIST files works correctly', () => {
  createFile('list_test_1.txt', 'a');
  createFile('list_test_2.txt', 'bb');
  const result = listFiles();
  assert(result.success === true);
  assert(result.fileCount >= 2, `expected at least 2 files, got ${result.fileCount}`);
  const names = result.files.map(f => f.name);
  assert(names.includes('list_test_1.txt'), 'list_test_1.txt not found in listing');
  assert(names.includes('list_test_2.txt'), 'list_test_2.txt not found in listing');
  deleteFile('list_test_1.txt');
  deleteFile('list_test_2.txt');
});

test('Files with dots in name work correctly', () => {
  const result = createFile('my.config.json', '{"key": "value"}');
  assert(result.success === true);
  const read = readFile('my.config.json');
  assert(read.content === '{"key": "value"}');
  deleteFile('my.config.json');
});

test('Files with spaces in name work correctly', () => {
  const result = createFile('my file name.txt', 'content');
  assert(result.success === true);
  const read = readFile('my file name.txt');
  assert(read.content === 'content');
  deleteFile('my file name.txt');
});

// ═══════════════════════════════════════════════════════════════════════
//  5. INPUT VALIDATION
// ═══════════════════════════════════════════════════════════════════════
console.log('\n\x1b[96m\x1b[1m━━━ INPUT: Type Safety & Validation ━━━\x1b[0m\n');

test('Empty filename is rejected with VALIDATION error', () => {
  assertThrows(() => createFile('', 'data'), 'VALIDATION');
});

test('Whitespace-only filename is rejected', () => {
  assertThrows(() => createFile('   ', 'data'), 'VALIDATION');
});

test('Filename "." resolves to BASE_DIR and is rejected', () => {
  assertThrows(() => createFile('.', 'data'), 'VALIDATION');
});

test('Non-string filename is rejected', () => {
  assertThrows(() => createFile(123, 'data'), 'VALIDATION');
  assertThrows(() => createFile(null, 'data'), 'VALIDATION');
  assertThrows(() => createFile(undefined, 'data'), 'VALIDATION');
});

// ═══════════════════════════════════════════════════════════════════════
//  6. SYSTEM TELEMETRY
// ═══════════════════════════════════════════════════════════════════════
console.log('\n\x1b[96m\x1b[1m━━━ TELEMETRY: System Information ━━━\x1b[0m\n');

test('getSystemTelemetry returns complete object', () => {
  const t = getSystemTelemetry();
  assert(t.system !== undefined, 'system section missing');
  assert(t.cpu !== undefined, 'cpu section missing');
  assert(t.memory !== undefined, 'memory section missing');
  assert(t.network !== undefined, 'network section missing');
  assert(t.environment !== undefined, 'environment section missing');
});

test('System section has all required fields', () => {
  const s = getSystemTelemetry().system;
  const required = ['osType', 'osPlatform', 'osRelease', 'cpuArchitecture', 'hostname', 'nodeVersion', 'userHomeDir', 'uptime'];
  for (const field of required) {
    assert(s[field] !== undefined, `system.${field} is missing`);
    assert(typeof s[field] === 'string', `system.${field} should be string, got ${typeof s[field]}`);
    assert(s[field].length > 0, `system.${field} is empty`);
  }
});

test('CPU section has all required fields', () => {
  const cpu = getSystemTelemetry().cpu;
  assert(typeof cpu.model === 'string', 'cpu.model should be string');
  assert(typeof cpu.cores === 'number', 'cpu.cores should be number');
  assert(cpu.cores > 0, 'cpu.cores should be > 0');
  assert(typeof cpu.speed === 'string', 'cpu.speed should be string');
});

test('Memory values are sane', () => {
  const mem = getSystemTelemetry().memory;
  assert(typeof mem.usagePercent === 'number', 'usagePercent should be number');
  assert(mem.usagePercent >= 0 && mem.usagePercent <= 100, `usagePercent out of range: ${mem.usagePercent}`);
  assert(mem.total.includes('GB') || mem.total.includes('TB'), 'total should be in GB or TB');
});

test('Network section is an array with at least one entry', () => {
  const net = getSystemTelemetry().network;
  assert(Array.isArray(net), 'network should be array');
  assert(net.length > 0, 'network should have at least one entry');
  assert(typeof net[0].interface === 'string', 'interface should be string');
  assert(typeof net[0].address === 'string', 'address should be string');
});

test('Environment variables never return undefined', () => {
  const env = getSystemTelemetry().environment;
  for (const [key, val] of Object.entries(env)) {
    assert(val !== undefined, `env.${key} is undefined`);
    assert(val !== null, `env.${key} is null`);
    assert(typeof val === 'string', `env.${key} should be string, got ${typeof val}`);
    assert(val.length > 0, `env.${key} is empty string`);
  }
});

test('getSystemTelemetry is idempotent (no side effects)', () => {
  const t1 = getSystemTelemetry();
  const t2 = getSystemTelemetry();
  assert(t1.system.osType === t2.system.osType, 'osType changed between calls');
  assert(t1.system.hostname === t2.system.hostname, 'hostname changed between calls');
  assert(t1.cpu.model === t2.cpu.model, 'cpu model changed between calls');
});

// ═══════════════════════════════════════════════════════════════════════
//  7. UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════
console.log('\n\x1b[96m\x1b[1m━━━ UTILS: Helper Functions ━━━\x1b[0m\n');

test('formatBytes handles zero', () => {
  assert(formatBytes(0) === '0.00 B', `got "${formatBytes(0)}"`);
});

test('formatBytes handles kilobytes', () => {
  assert(formatBytes(1024) === '1.00 KB', `got "${formatBytes(1024)}"`);
});

test('formatBytes handles gigabytes', () => {
  assert(formatBytes(1073741824) === '1.00 GB', `got "${formatBytes(1073741824)}"`);
});

test('formatUptime handles zero seconds', () => {
  assert(formatUptime(0) === '0s', `got "${formatUptime(0)}"`);
});

test('formatUptime handles complex duration', () => {
  const result = formatUptime(90061); // 1d 1h 1m 1s
  assert(result === '1d 1h 1m 1s', `got "${result}"`);
});

test('progressBar clamps negative values', () => {
  const bar = stripAnsi(progressBar(-10));
  assert(bar.includes('0.0%'), `expected 0.0%, got "${bar}"`);
});

test('progressBar clamps values over 100', () => {
  const bar = stripAnsi(progressBar(150));
  assert(bar.includes('100.0%'), `expected 100.0%, got "${bar}"`);
});

test('stripAnsi removes all ANSI codes', () => {
  const colored = '\x1b[91m\x1b[1mHello\x1b[0m';
  assert(stripAnsi(colored) === 'Hello', `got "${stripAnsi(colored)}"`);
});

test('drawBox does not throw with empty lines array', () => {
  // Should not crash
  drawBox('Test', [], '\x1b[96m');
});

// ═══════════════════════════════════════════════════════════════════════
//  8. SANDBOX BOUNDARY — EXACT MATCH TEST
// ═══════════════════════════════════════════════════════════════════════
console.log('\n\x1b[96m\x1b[1m━━━ SECURITY: Sandbox Boundary Precision ━━━\x1b[0m\n');

test('File at workspace root is allowed', () => {
  const result = createFile('boundary.txt', 'ok');
  assert(result.success === true);
  deleteFile('boundary.txt');
});

test('Filename "." resolves to BASE_DIR (blocked by validation)', () => {
  assertThrows(() => createFile('.', 'data'), 'VALIDATION');
});

test('Filename with leading dot is allowed (.hidden)', () => {
  const result = createFile('.hidden', 'secret');
  assert(result.success === true);
  deleteFile('.hidden');
});

// ═══════════════════════════════════════════════════════════════════════
//  RESULTS SUMMARY
// ═══════════════════════════════════════════════════════════════════════

console.log('\n\x1b[1m' + '═'.repeat(60) + '\x1b[0m');
console.log(`\x1b[1m  TEST RESULTS: ${passed + failed} total\x1b[0m`);
console.log(`  \x1b[92m✔ Passed: ${passed}\x1b[0m`);
console.log(`  \x1b[91m✖ Failed: ${failed}\x1b[0m`);

if (failures.length > 0) {
  console.log('\n\x1b[91m\x1b[1m  FAILURES:\x1b[0m');
  for (const f of failures) {
    console.log(`  \x1b[91m• ${f.name}\x1b[0m`);
    console.log(`    \x1b[2m${f.error}\x1b[0m`);
  }
}

console.log('\x1b[1m' + '═'.repeat(60) + '\x1b[0m\n');

process.exit(failed > 0 ? 1 : 0);
