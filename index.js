import readline from 'node:readline';

import {
  runRecon, dropPayload, extractData, injectCode,
  destroyEvidence, scanTargetDirectory, exfiltrateData,
  runAttackChain, WORKSPACE_DIR,
} from './src/engine.js';

import {
  c, style, BANNER, SKULL, drawBox, progressBar,
  sectionHeader, divider, spinner, typewriter, kvPair, delay,
} from './src/utils.js';

// ═══════════════════════════════════════════════════════════════════════
//  VENOM.JS — CLI Interface
//  Interactive terminal presentation layer consuming the core engine.
//  ⚠ EDUCATIONAL ONLY — no harmful actions are performed.
// ═══════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════
//  PHASE 1: TARGET RECONNAISSANCE
// ═══════════════════════════════════════════════════════════════════════

/**
 * Renders the full target reconnaissance dashboard.
 * Simulates how malware fingerprints the victim machine.
 */
const displayRecon = async () => {
  await spinner('Scanning target system...');
  const t = runRecon();

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
const runAttackChainCLI = async () => {
  divider();
  console.log(SKULL);
  console.log(`\n  ${c.bold}${c.bRed}☠  FULL ATTACK CHAIN SIMULATION${c.reset}`);
  console.log(`  ${c.dim}${c.green}Executing: Drop → Extract → Inject → Verify → Cleanup → Test${c.reset}\n`);

  await delay(300);

  const chain = runAttackChain();

  for (const step of chain) {
    await typewriter(`  [PHASE ${step.phase}] ${step.description}...`);
    await spinner(`${step.label}...`);

    switch (step.phase) {
      case '2.1':
        console.log(`    ${style.success(`Payload dropped: "${step.result.filename}" (${step.result.size} bytes)`)}`);
        break;

      case '2.2':
        drawBox('📄 Extracted Data', [`"${step.result.content}"`], c.green);
        break;

      case '2.3':
        console.log(`    ${style.success(`Code injected: "${step.result.filename}" (now ${step.result.newSize} bytes)`)}`);
        break;

      case '2.4':
        drawBox('📄 Post-Injection Content', step.result.content.split('\n'), c.bYellow);
        break;

      case '2.5':
        console.log(`    ${style.success(step.result.message)}`);
        break;

      case '2.6':
        drawBox('⚠ Graceful Error — File Destroyed', [
          `Success: ${step.result.success}`,
          `Error:   ${step.result.error}`,
          `Message: ${step.result.message}`,
        ], c.bRed);
        break;

      case '2.7':
        if (step.result.blocked) {
          console.log('');
          drawBox('🛡️  Sandbox Held — Attack Blocked', [
            `Attack:   ${step.result.attack}`,
            `Defense:  ${step.result.defense}`,
            `Result:   ${step.result.verdict}`,
          ], c.bMagenta);
        } else {
          console.log(`    ${style.error(step.result.message)}`);
        }
        break;
    }
  }

  console.log(`\n  ${c.bold}${c.bGreen}  ░▒▓█ Attack chain complete. All phases executed. █▓▒░${c.reset}\n`);
};



const completions = ['1', '2', '3', '4', '5', '0', 'recon', 'payload', 'attack', 'exfil', 'scan', 'ls', 'clear', 'exit', 'help', 'menu'];
const completer = (line) => {
  const hits = completions.filter((c) => c.startsWith(line.trim()));
  return [hits.length ? hits : completions, line];
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: completer,
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
          const result = dropPayload(name, content);
          console.log(`\n    ${style.success(`Payload dropped: "${name}" (${result.size} bytes)`)}`);
        } catch (err) { console.log(`\n    ${style.error(err.message)}`); }
        break;
      }
      case '2': {
        const name = (await prompt('target filename> ')).trim();
        if (!name) { console.log(`    ${style.warn('Target filename required.')}`); break; }
        try {
          const result = extractData(name);
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
          const result = injectCode(name, '\n' + content);
          console.log(`\n    ${style.success(`Code injected into "${name}" (now ${result.newSize} bytes)`)}`);
        } catch (err) { console.log(`\n    ${style.error(err.message)}`); }
        break;
      }
      case '4': {
        const name = (await prompt('target filename> ')).trim();
        if (!name) { console.log(`    ${style.warn('Target filename required.')}`); break; }
        try {
          const result = destroyEvidence(name);
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
 * Exfiltrates system telemetry to a JSON report — CLI presentation wrapper.
 */
const exfiltrateDataCLI = async () => {
  await spinner('Exfiltrating target data...');
  const result = exfiltrateData();
  console.log(`    ${style.success(result.message)}`);
  console.log(`    ${c.dim}${c.green}Drop location: ${result.filePath}${c.reset}`);
};

/**
 * Scans and displays all files in the target workspace — CLI presentation wrapper.
 */
const scanDirectoryCLI = () => {
  const result = scanTargetDirectory();

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
        await runAttackChainCLI();
        break;

      case '4':
        await exfiltrateDataCLI();
        break;

      case '5':
        scanDirectoryCLI();
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
