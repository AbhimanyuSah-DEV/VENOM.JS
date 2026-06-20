import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

import { getSystemTelemetry } from './src/sysInfo.js';
import { createFile, readFile, updateFile, deleteFile, listFiles, BASE_DIR } from './src/fileCrud.js';
import {
  c, style, BANNER, SKULL, drawBox, progressBar,
  sectionHeader, divider, spinner, typewriter, kvPair, delay,
} from './src/utils.js';

// ── Resolve paths ────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORKSPACE_DIR = path.resolve(__dirname, 'workspace');

// ── Ensure workspace (sandbox) exists ───────────────────────────────
fs.mkdirSync(WORKSPACE_DIR, { recursive: true });

// ═══════════════════════════════════════════════════════════════════════
//  PHASE 1: TARGET RECONNAISSANCE
// ═══════════════════════════════════════════════════════════════════════

/**
 * Renders the full target reconnaissance dashboard.
 * Simulates how malware fingerprints the victim machine.
 */
const displayRecon = async () => {
  await spinner('Scanning target system...');
  const t = getSystemTelemetry();

  // ── Target Fingerprint ────────────────────────────────────────
  sectionHeader('RECON', 'Target Fingerprint');
  kvPair('OS Type',          t.system.osType);
  kvPair('Platform',         t.system.osPlatform);
  kvPair('OS Release',       t.system.osRelease);
  kvPair('CPU Architecture', t.system.cpuArchitecture);
  kvPair('Hostname',         t.system.hostname);
  kvPair('Node.js Version',  t.system.nodeVersion);
  kvPair('Home Directory',   t.system.userHomeDir);
  kvPair('System Uptime',    t.system.uptime);

  // ── CPU Intel ─────────────────────────────────────────────────
  sectionHeader('CPU', 'Processor Intel');
  kvPair('Model',            t.cpu.model);
  kvPair('Logical Cores',    String(t.cpu.cores));
  kvPair('Base Speed',       t.cpu.speed);

  // ── Memory Mapping ────────────────────────────────────────────
  sectionHeader('MEMORY', 'RAM Mapping');
  kvPair('Total',            t.memory.total);
  kvPair('Used',             t.memory.used);
  kvPair('Free',             t.memory.free);
  console.log(`    ${'Consumption'.padEnd(22)} ${progressBar(t.memory.usagePercent)}`);

  // ── Network Recon ─────────────────────────────────────────────
  sectionHeader('NETWORK', 'Network Interfaces Discovered');
  for (const iface of t.network) {
    kvPair('Interface',      iface.interface);
    kvPair('IPv4 Address',   iface.address);
    kvPair('MAC Address',    iface.mac);
    console.log('');
  }

  // ── Environment Harvesting ────────────────────────────────────
  sectionHeader('ENV', 'Environment Variables Harvested');
  const envMaxWidth = 70;
  for (const [key, val] of Object.entries(t.environment)) {
    const display = val.length > envMaxWidth ? val.slice(0, envMaxWidth) + '…' : val;
    kvPair(key, display);
  }

  console.log(`\n  ${style.success('Reconnaissance complete. Target fully profiled.')}`);
  return t;
};

// ═══════════════════════════════════════════════════════════════════════
//  PHASE 2: FULL ATTACK CHAIN (Automated Demo)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Runs a fully automated virus attack simulation.
 * Demonstrates: payload drop → data extraction → code injection →
 * verification → evidence cleanup → error handling → sandbox test.
 */
const runAttackChain = async () => {
  const PAYLOAD_FILE = 'payload.txt';
  divider();
  console.log(SKULL);
  console.log(`\n  ${c.bold}${c.bRed}☠  FULL ATTACK CHAIN SIMULATION${c.reset}`);
  console.log(`  ${c.dim}${c.green}Executing: Drop → Extract → Inject → Verify → Cleanup → Test${c.reset}\n`);

  await delay(300);

  // ── PHASE 2.1: PAYLOAD DROP ────────────────────────────────────
  await typewriter('  [PHASE 2.1] Dropping payload to target filesystem...');
  await spinner('Writing payload...');
  const createResult = createFile(PAYLOAD_FILE, 'VENOM.JS was here. Initial payload delivered.');
  console.log(`    ${style.success(`Payload dropped: "${PAYLOAD_FILE}" (${createResult.size} bytes)`)}`);

  // ── PHASE 2.2: DATA EXTRACTION ────────────────────────────────
  await typewriter('  [PHASE 2.2] Extracting payload data from target...');
  await spinner('Reading target file...');
  const read1 = readFile(PAYLOAD_FILE);
  drawBox('📄 Extracted Data', [`"${read1.content}"`], c.green);

  // ── PHASE 2.3: CODE INJECTION ─────────────────────────────────
  await typewriter('  [PHASE 2.3] Injecting additional code into target file...');
  await spinner('Injecting code...');
  const updateResult = updateFile(PAYLOAD_FILE, '\n[INJECTED] Secondary payload activated.');
  console.log(`    ${style.success(`Code injected: "${PAYLOAD_FILE}" (now ${updateResult.newSize} bytes)`)}`);

  // ── PHASE 2.4: VERIFY INJECTION ───────────────────────────────
  await typewriter('  [PHASE 2.4] Verifying injection success...');
  await spinner('Verifying modified target...');
  const read2 = readFile(PAYLOAD_FILE);
  drawBox('📄 Post-Injection Content', read2.content.split('\n'), c.bYellow);

  // ── PHASE 2.5: EVIDENCE CLEANUP ───────────────────────────────
  await typewriter('  [PHASE 2.5] Cleaning up evidence — removing traces...');
  await spinner('Deleting payload...');
  const delResult = deleteFile(PAYLOAD_FILE);
  console.log(`    ${style.success(delResult.message)}`);

  // ── PHASE 2.6: VERIFY CLEANUP ─────────────────────────────────
  await typewriter('  [PHASE 2.6] Confirming evidence destruction...');
  await spinner('Attempting to read deleted payload...');
  const read3 = readFile(PAYLOAD_FILE);
  drawBox('⚠ Graceful Error — File Destroyed', [
    `Success: ${read3.success}`,
    `Error:   ${read3.error}`,
    `Message: ${read3.message}`,
  ], c.bRed);

  // ── PHASE 2.7: SANDBOX ESCAPE ATTEMPT ─────────────────────────
  console.log('');
  await typewriter('  [PHASE 2.7] Attempting sandbox escape...');
  await spinner('Trying path traversal attack...');
  try {
    createFile('../escape.txt', 'Attempting to break free from sandbox.');
    console.log(`    ${style.error('BREACH! File written outside sandbox!')}`);
  } catch (err) {
    drawBox('🛡️  Sandbox Held — Attack Blocked', [
      'Attack:   createFile("../escape.txt", ...)',
      `Defense:  ${err.message}`,
      'Result:   CONTAINED ✔',
    ], c.bMagenta);
  }

  console.log(`\n  ${c.bold}${c.bGreen}  ░▒▓█ Attack chain complete. All phases executed. █▓▒░${c.reset}\n`);
};

// ═══════════════════════════════════════════════════════════════════════
//  INTERACTIVE COMMAND CENTER
// ═══════════════════════════════════════════════════════════════════════

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let rlClosed = false;
rl.on('close', () => { rlClosed = true; });

/** Prompts the operator for input. */
const prompt = (question) =>
  new Promise((resolve) => {
    if (rlClosed) return resolve('0');
    rl.question(`  ${c.bGreen}${c.bold}venom>${c.reset} ${question}`, resolve);
  });

/** Displays the main command center menu. */
const showMainMenu = () => {
  console.log('');
  drawBox('⚡ VENOM.JS — Command Center', [
    `${c.bRed}1${c.reset}  ${c.green}🔍  Target Reconnaissance      ${c.dim}(scan system info)${c.reset}`,
    `${c.bRed}2${c.reset}  ${c.green}💉  Payload Operations (CRUD)   ${c.dim}(file manipulation)${c.reset}`,
    `${c.bRed}3${c.reset}  ${c.green}☠️   Execute Full Attack Chain   ${c.dim}(automated demo)${c.reset}`,
    `${c.bRed}4${c.reset}  ${c.green}📡  Exfiltrate Data (JSON)      ${c.dim}(export report)${c.reset}`,
    `${c.bRed}5${c.reset}  ${c.green}🗂️   Scan Target Directory       ${c.dim}(list files)${c.reset}`,
    `${c.bRed}0${c.reset}  ${c.green}🚪  Disengage & Exit${c.reset}`,
  ], c.bGreen);
  console.log('');
};

/** Displays the payload operations submenu. */
const showPayloadMenu = () => {
  console.log('');
  drawBox('💉 Payload Operations', [
    `${c.bRed}1${c.reset}  ${c.green}📦  Drop Payload         ${c.dim}(create file)${c.reset}`,
    `${c.bRed}2${c.reset}  ${c.green}📖  Extract Data          ${c.dim}(read file)${c.reset}`,
    `${c.bRed}3${c.reset}  ${c.green}💉  Inject Code           ${c.dim}(append to file)${c.reset}`,
    `${c.bRed}4${c.reset}  ${c.green}🗑️   Destroy Evidence      ${c.dim}(delete file)${c.reset}`,
    `${c.bRed}0${c.reset}  ${c.green}↩️   Return to Command Center${c.reset}`,
  ], c.bRed);
  console.log('');
};

/**
 * Handles payload (CRUD) operations interactively.
 */
const handlePayloadMenu = async () => {
  let back = false;

  while (!back) {
    showPayloadMenu();
    const choice = (await prompt('operation> ')).trim();

    switch (choice) {
      case '1': {
        const name = (await prompt('target filename> ')).trim();
        const content = (await prompt('payload content> ')).trim();
        if (!name) { console.log(`    ${style.warn('Target filename required.')}`); break; }
        try {
          const result = createFile(name, content);
          console.log(`\n    ${style.success(`Payload dropped: "${name}" (${result.size} bytes)`)}`);
        } catch (err) { console.log(`\n    ${style.error(err.message)}`); }
        break;
      }
      case '2': {
        const name = (await prompt('target filename> ')).trim();
        if (!name) { console.log(`    ${style.warn('Target filename required.')}`); break; }
        try {
          const result = readFile(name);
          if (result.success) {
            drawBox(`📄 Extracted: ${name} (${result.size} bytes)`, result.content.split('\n'), c.green);
          } else {
            console.log(`\n    ${style.error(result.message)}`);
          }
        } catch (err) { console.log(`\n    ${style.error(err.message)}`); }
        break;
      }
      case '3': {
        const name = (await prompt('target filename> ')).trim();
        const content = (await prompt('inject content> ')).trim();
        if (!name) { console.log(`    ${style.warn('Target filename required.')}`); break; }
        try {
          const result = updateFile(name, '\n' + content);
          console.log(`\n    ${style.success(`Code injected into "${name}" (now ${result.newSize} bytes)`)}`);
        } catch (err) { console.log(`\n    ${style.error(err.message)}`); }
        break;
      }
      case '4': {
        const name = (await prompt('target filename> ')).trim();
        if (!name) { console.log(`    ${style.warn('Target filename required.')}`); break; }
        try {
          const result = deleteFile(name);
          if (result.success) {
            console.log(`\n    ${style.success(result.message)}`);
          } else {
            console.log(`\n    ${style.warn(result.message)}`);
          }
        } catch (err) { console.log(`\n    ${style.error(err.message)}`); }
        break;
      }
      case '0':
        back = true;
        break;
      default:
        console.log(`    ${style.warn('Invalid operation. Choose 0-4.')}`);
    }
  }
};

/**
 * Exfiltrates system telemetry to a JSON report in the workspace.
 * Simulates data exfiltration — saving stolen intel to a drop file.
 */
const exfiltrateData = async () => {
  await spinner('Exfiltrating target data...');
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
  console.log(`    ${style.success(`Intel exfiltrated to workspace/${filename}`)}`);
  console.log(`    ${c.dim}${c.green}Drop location: ${filePath}${c.reset}`);
};

/**
 * Scans and displays all files in the target workspace.
 */
const scanDirectory = () => {
  const result = listFiles();

  if (!result.success) {
    console.log(`    ${style.error(result.message)}`);
    return;
  }

  if (result.fileCount === 0) {
    console.log(`\n    ${style.info('Target directory is clean. No files found.')}`);
    return;
  }

  const lines = result.files.map(
    (f) => `${c.bGreen}${f.name.padEnd(30)}${c.reset} ${c.dim}${String(f.size).padStart(8)} bytes${c.reset}   ${c.dim}${f.modified}${c.reset}`
  );

  console.log('');
  drawBox(`🗂️  Target Directory (${result.fileCount} file${result.fileCount !== 1 ? 's' : ''} found)`, lines, c.green);
};

// ═══════════════════════════════════════════════════════════════════════
//  BOOT SEQUENCE
// ═══════════════════════════════════════════════════════════════════════

const main = async () => {
  console.clear();
  console.log(BANNER);

  // ── Fake infection sequence ───────────────────────────────────
  await typewriter('  [BOOT] Initializing VENOM.JS virus simulator...');
  await spinner('Establishing sandbox environment...');
  await spinner('Loading payload engine...');
  await spinner('Activating reconnaissance module...');
  console.log(`    ${c.dim}${c.green}Sandbox: ${WORKSPACE_DIR}${c.reset}`);
  console.log(`\n  ${c.bold}${c.bGreen}  ░▒▓█ VENOM.JS is active. Awaiting operator commands. █▓▒░${c.reset}\n`);

  let running = true;

  while (running) {
    showMainMenu();
    const choice = (await prompt('')).trim();

    switch (choice) {
      case '1':
        await displayRecon();
        break;

      case '2':
        await handlePayloadMenu();
        break;

      case '3':
        await runAttackChain();
        break;

      case '4':
        await exfiltrateData();
        break;

      case '5':
        scanDirectory();
        break;

      case '0':
        running = false;
        divider();
        await typewriter('  [EXIT] Disengaging VENOM.JS...');
        console.log(`  ${c.bold}${c.bRed}  ☠  Connection terminated. No traces left behind.${c.reset}\n`);
        break;

      default:
        console.log(`    ${style.warn('Unknown command. Enter a number from the menu.')}`);
    }
  }

  rl.close();
};

main();
