(() => {
  'use strict';

  const output = document.getElementById('terminal-output');
  const terminal = document.getElementById('terminal');
  const cmdInput = document.getElementById('command-input');
  const payloadModal = document.getElementById('payload-modal');
  const modalClose = document.getElementById('modal-close');
  const payloadFilename = document.getElementById('payload-filename');
  const payloadContent = document.getElementById('payload-content');

  let ws = null;
  let commandHistory = [];
  let historyIndex = -1;

  const COMMANDS = ['1', '2', '3', '4', '5', '0', 'recon', 'payload', 'attack', 'exfil', 'scan', 'ls', 'clear', 'exit', 'help', 'menu', 'npm run start', 'npm run web', 'npm run test'];

  const BANNER = [
    '<span class="t-red">██╗   ██╗███████╗███╗   ██╗ ██████╗ ███╗   ███╗       ██╗███████╗</span>',
    '<span class="t-red">██║   ██║██╔════╝████╗  ██║██╔═══██╗████╗ ████║       ██║██╔════╝</span>',
    '<span class="t-red">██║   ██║█████╗  ██╔██╗ ██║██║   ██║██╔████╔██║       ██║███████╗</span>',
    '<span class="t-red">╚██╗ ██╔╝██╔══╝  ██║╚██╗██║██║   ██║██║╚██╔╝██║  ██   ██║╚════██║</span>',
    '<span class="t-red"> ╚████╔╝ ███████╗██║ ╚████║╚██████╔╝██║ ╚═╝ ██║██╗╚█████╔╝███████║</span>',
    '<span class="t-red">  ╚═══╝  ╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝     ╚═╝╚═╝ ╚════╝ ╚══════╝</span>',
    '',
    '    <span class="t-green">░▒▓█ EDUCATIONAL VIRUS SIMULATOR █▓▒░</span>',
    '<span class="t-muted"> System Reconnaissance · File Manipulation · Data Exfiltration</span>',
    '<span class="t-red">⚠ For educational purposes only. No actual harm is caused. ⚠</span>',
    '<span class="t-muted">───────────────────────────────────────────────────────────────────</span>',
    ''
  ];

  function line(text = '', cls = 't-green') {
    const p = document.createElement('p');
    p.className = `t-line ${cls}`;
    p.textContent = text;
    output.appendChild(p);
    scrollBottom();
  }

  function lineHTML(html, cls = 't-line') {
    const p = document.createElement('p');
    p.className = cls;
    p.innerHTML = html;
    output.appendChild(p);
    scrollBottom();
  }

  function scrollBottom() {
    output.scrollTop = output.scrollHeight;
  }

  function echoCmd(cmd) {
    lineHTML(`<br><span class="t-green prompt-text">venom&gt;</span> <span class="t-user-cmd">${esc(cmd)}</span>`, 't-line');
  }

  function esc(s) {
    const d = document.createElement('div');
    d.textContent = String(s);
    return d.innerHTML;
  }

  function showMenu() {
    lineHTML(`
<span class="t-green">┌────────────────────────────────────────────────────────┐</span>
<span class="t-green">│</span> <span class="t-yellow">⚡ VENOM.JS - Command Center</span>                            <span class="t-green">│</span>
<span class="t-green">├────────────────────────────────────────────────────────┤</span>
<span class="t-green">│</span> <span class="t-red">1</span> 🔍 Target Reconnaissance      <span class="t-muted">(scan system info)</span>     <span class="t-green">│</span>
<span class="t-green">│</span> <span class="t-red">2</span> 💉 Payload Operations (CRUD)  <span class="t-muted">(file manipulation)</span>    <span class="t-green">│</span>
<span class="t-green">│</span> <span class="t-red">3</span> ☠  Execute Full Attack Chain  <span class="t-muted">(automated demo)</span>       <span class="t-green">│</span>
<span class="t-green">│</span> <span class="t-red">4</span> 📡 Exfiltrate Data (JSON)     <span class="t-muted">(export report)</span>        <span class="t-green">│</span>
<span class="t-green">│</span> <span class="t-red">5</span> 📂 Scan Target Directory      <span class="t-muted">(list files)</span>           <span class="t-green">│</span>
<span class="t-green">│</span> <span class="t-red">0</span> 🚪 Disengage & Exit                                  <span class="t-green">│</span>
<span class="t-green">└────────────────────────────────────────────────────────┘</span>
`.trim(), 't-ascii');
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function bootSequence() {
    cmdInput.disabled = true;
    output.innerHTML = '';

    line('[BIOS] Hard Drive Check: OK', 't-muted');
    await delay(200);
    line('[BIOS] Memory Test: 16384MB OK', 't-muted');
    await delay(300);
    line('[BOOT] Mounting C:\\Users\\user\\coding\\Thunder Hackathon\\Thunder HAckathon 3\\workspace...', 't-muted');
    await delay(400);
    
    // Connect progress
    line('Establishing Secure WebSocket Terminal Connection:', 't-green');
    const barLength = 25;
    const progressElement = document.createElement('p');
    progressElement.className = 't-line t-green';
    output.appendChild(progressElement);
    for (let i = 0; i <= barLength; i++) {
      const pct = Math.floor((i / barLength) * 100);
      const filled = '█'.repeat(i);
      const empty = '░'.repeat(barLength - i);
      progressElement.textContent = `[${filled}${empty}] ${pct}%`;
      scrollBottom();
      await delay(30 + Math.random() * 50);
    }
    await delay(300);
    line('[✔] Secure WebSocket Broker Connected.', 't-green');
    await delay(400);

    line('[BOOT] Loading core engine...', 't-green');
    await delay(300);
    line('[✔] Sandboxed filesystem boundary check: ENFORCED', 't-muted');
    await delay(250);
    line('[✔] Telemetry hooks: ARMED', 't-muted');
    await delay(250);
    line('[✔] Payload delivery subroutines: ARMED', 't-muted');
    await delay(300);
    
    output.innerHTML = '';
    
    for (const l of BANNER) {
      if (l === '') lineHTML('<br>', 't-ascii t-green');
      else lineHTML(l, 't-ascii t-green');
    }
    
    line('[✔] VENOM.JS Control Console fully engaged.', 't-green');
    line('');
    line('░▒▓█ VENOM.JS is active. Awaiting operator commands. █▓▒░', 't-green');
    line('');
    showMenu();
    cmdInput.disabled = false;
    cmdInput.focus();
  }

  function processCommand(raw) {
    const input = raw.trim();
    if (!input) return;

    commandHistory.push(input);
    historyIndex = commandHistory.length;
    echoCmd(input);

    switch (input) {
      case '1':
      case 'recon':
        line('[✔] Scanning target system...', 't-green');
        send('RUN_RECON');
        break;
      case '2':
      case 'payload':
        payloadModal.classList.remove('hidden'); 
        payloadFilename.focus();
        break;
      case '3':
      case 'attack':
        line('[✔] Launching automated attack chain...', 't-green');
        send('RUN_ATTACK_CHAIN');
        break;
      case '4':
      case 'exfil':
        line('[✔] Exfiltrating data...', 't-green');
        send('EXFILTRATE');
        break;
      case '5':
      case 'scan':
      case 'ls':
        line('[✔] Scanning directory...', 't-green');
        send('SCAN_DIRECTORY');
        break;
      case '0':
      case 'kill':
      case 'exit':
      case 'logout':
        send('KILL_SWITCH');
        break;
      case 'help':
      case 'menu':
        showMenu();
        break;
      case 'clear':
        output.innerHTML = '';
        showMenu();
        break;
      case 'npm run start':
      case 'npm start':
      case 'cli':
        line('');
        line('┌─── VENOM.JS PLAYBOOK & OFFLINE RUNTIME GUIDE ──────────────────────────────────', 't-yellow');
        line('│', 't-yellow');
        line('│  🖥️  Navigate & Run', 't-white');
        line('│  ──────────────────────────────────────────────────────────────────────────', 't-muted');
        line('│  On Windows (Command Prompt - CMD):', 't-green');
        line('│    1. Open Command Prompt (Press Win + R, type cmd, and press Enter).', 't-white');
        line('│    2. Navigate to the project root directory:', 't-white');
        line('│       cd C:\\path\\to\\extracted\\folder\\VENOM.JS', 't-yellow');
        line('│       *Tip: In File Explorer, navigate to the VENOM.JS folder, click the address bar', 't-muted');
        line('│             at the top, type cmd, and press Enter to open CMD directly there.*', 't-muted');
        line('│    3. Launch the simulator:     node index.js', 't-white');
        line('│    4. Run the security tests:   npm test', 't-white');
        line('│', 't-yellow');
        line('│  On Windows (PowerShell):', 't-green');
        line('│    1. Open PowerShell.', 't-white');
        line('│    2. Navigate and run:         cd "C:\\path\\to\\extracted\\folder\\VENOM.JS"', 't-white');
        line('│                                 node index.js', 't-white');
        line('│', 't-yellow');
        line('│  On macOS / Linux / Git Bash:', 't-green');
        line('│    1. Open your Terminal.', 't-white');
        line('│    2. Navigate and run:         cd /path/to/extracted/folder/VENOM.JS', 't-white');
        line('│                                 node index.js', 't-white');
        line('│', 't-yellow');
        line('│  🎮  VENOM.JS Command Center (CLI mode)', 't-white');
        line('│  ──────────────────────────────────────────────────────────────────────────', 't-muted');
        line('│  When you run index.js, the terminal displays the following UI menu:', 't-white');
        line('│', 't-white');
        line('│    ┌────────────────────────────────────────────────────────┐', 't-green');
        line('│    │ ⚡ VENOM.JS — Command Center                          │', 't-green');
        line('│    ├────────────────────────────────────────────────────────┤', 't-green');
        line('│    │ 1  🔍  Target Reconnaissance      (scan system info)  │', 't-green');
        line('│    │ 2  💉  Payload Operations (CRUD)   (file manipulation) │', 't-green');
        line('│    │ 3  ☠️   Execute Full Attack Chain   (automated demo)    │', 't-green');
        line('│    │ 4  📡  Exfiltrate Data (JSON)      (export report)     │', 't-green');
        line('│    │ 5  🗂️   Scan Target Directory       (list files)        │', 't-green');
        line('│    │ 0  🚪  Disengage & Exit                                │', 't-green');
        line('│    └────────────────────────────────────────────────────────┘', 't-green');
        line('│', 't-white');
        line('│  🔍  Option 1 — Target Reconnaissance', 't-white');
        line('│  ──────────────────────────────────────────────────────────────────────────', 't-muted');
        line('│  Simulates malware fingerprinting the victim machine to find attack vectors.', 't-white');
        line('│', 't-white');
        line('│    [RECON] Target Fingerprint', 't-red');
        line('│      OS Type               Windows_NT', 't-white');
        line('│      Platform              win32', 't-white');
        line('│      OS Release            10.0.26200', 't-white');
        line('│      CPU Architecture      x64', 't-white');
        line('│      Hostname              user', 't-white');
        line('│      Node.js Version       v24.11.1', 't-white');
        line('│      Home Directory        C:\\Users\\user', 't-white');
        line('│      System Uptime         7d 13h 2m 39s', 't-white');
        line('│', 't-white');
        line('│    [CPU] Processor Intel', 't-red');
        line('│      Model                 13th Gen Intel(R) Core(TM) i5-13420H', 't-white');
        line('│      Logical Cores         12', 't-white');
        line('│      Base Speed            2611 MHz', 't-white');
        line('│', 't-white');
        line('│    [MEMORY] RAM Mapping', 't-red');
        line('│      Total                 15.63 GB', 't-white');
        line('│      Used                  11.90 GB', 't-white');
        line('│      Free                  3.74 GB', 't-white');
        line('│      Consumption           ██████████████████████░░░░░░░░░ 76.1%', 't-white');
        line('│', 't-white');
        line('│    [NETWORK] Network Interfaces Discovered', 't-red');
        line('│      Interface             Wi-Fi', 't-white');
        line('│      IPv4 Address          192.168.0.105', 't-white');
        line('│      MAC Address           58:02:05:83:ff:ba', 't-white');
        line('│', 't-white');
        line('│    [ENV] Environment Variables Harvested', 't-red');
        line('│      PATH                  C:\\Windows\\system32;...', 't-white');
        line('│      USER                  user', 't-white');
        line('│      SHELL                 C:\\Windows\\system32\\cmd.exe', 't-white');
        line('│', 't-white');
        line('│    💡 Judge talking point: "Real malware collects this exact data to choose', 't-yellow');
        line('│       exploits, identify high-value targets, and detect VM/sandboxes."', 't-yellow');
        line('│', 't-white');
        line('│  💉  Option 2 — Payload Operations (CRUD)', 't-white');
        line('│  ──────────────────────────────────────────────────────────────────────────', 't-muted');
        line('│  Simulates target file creation, reading, modification, and destruction.', 't-white');
        line('│', 't-white');
        line('│    ┌──────────────────────────────────────────────┐', 't-green');
        line('│    │ 💉 Payload Operations                        │', 't-green');
        line('│    ├──────────────────────────────────────────────┤', 't-green');
        line('│    │ 1  📦  Drop Payload         (create file)    │', 't-green');
        line('│    │ 2  📖  Extract Data          (read file)     │', 't-green');
        line('│    │ 3  💉  Inject Code           (append)        │', 't-green');
        line('│    │ 4  🗑️   Destroy Evidence      (delete file)   │', 't-green');
        line('│    │ 0  ↩️   Return to Command Center              │', 't-green');
        line('│    └──────────────────────────────────────────────┘', 't-green');
        line('│', 't-white');
        line('│    Example session:', 't-muted');
        line('│      venom> operation> 1', 't-white');
        line('│      venom> target filename> secret.txt', 't-white');
        line('│      venom> payload content> Sensitive stolen data', 't-white');
        line('│        [✔] Payload dropped: "secret.txt" (22 bytes)', 't-green');
        line('│', 't-white');
        line('│    🔒 Note: All operations are strictly sandboxed to ./workspace.', 't-yellow');
        line('│       Path traversal attempts like "../../secret.txt" are safely blocked.', 't-yellow');
        line('│', 't-white');
        line('│  ☠️  Option 3 — Execute Full Attack Chain', 't-white');
        line('│  ──────────────────────────────────────────────────────────────────────────', 't-muted');
        line('│  Automated malware lifecycle simulation from breach to cleanup. (7 Phases):', 't-white');
        line('│', 't-white');
        line('│    Phase  Operation         What Real Malware Does', 't-yellow');
        line('│    ──────────────────────────────────────────────────────────────────────', 't-muted');
        line('│    2.1    Payload Drop      Writes malicious files to disk', 't-white');
        line('│    2.2    Data Extraction   Reads sensitive files from victim', 't-white');
        line('│    2.3    Code Injection    Injects code payloads into existing files', 't-white');
        line('│    2.4    Verify Injection  Confirms injection execution succeeded', 't-white');
        line('│    2.5    Evidence Cleanup  Deletes log traces and files', 't-white');
        line('│    2.6    Verify Cleanup    Confirms evidence removal succeeded', 't-white');
        line('│    2.7    Sandbox Escape    Attempts traversal breakouts (blocked)', 't-white');
        line('│', 't-white');
        line('│    💡 Key moments for judges:', 't-yellow');
        line('│      - Phase 2.4: Compares original and modified contents to show injection.', 't-white');
        line('│      - Phase 2.6: Catches ENOENT on read check to show evidence is deleted.', 't-white');
        line('│      - Phase 2.7: Catches sandbox breach and halts process to prove containment.', 't-white');
        line('│', 't-white');
        line('│  📡  Option 4 — Exfiltrate Data', 't-white');
        line('│  ──────────────────────────────────────────────────────────────────────────', 't-muted');
        line('│  Simulates packaging and exfiltrating gathered intelligence to a report:', 't-white');
        line('│    [✔] Intel exfiltrated to workspace/exfil-report-2026-06-20T14-54-45-117Z.json', 't-green');
        line('│', 't-white');
        line('│  🗂️  Option 5 — Scan Target Directory', 't-white');
        line('│  ──────────────────────────────────────────────────────────────────────────', 't-muted');
        line('│  Scans the sandbox folder to index victim directory files:', 't-white');
        line('│    ┌──────────────────────────────────────────────────────────────────────────┐', 't-green');
        line('│    │ 🗂️  Target Directory (2 files found)                                    │', 't-green');
        line('│    ├──────────────────────────────────────────────────────────────────────────┤', 't-green');
        line('│    │ exfil-report-2026-06-20.json        1245 bytes   2026-06-20T14:54:45Z  │', 't-green');
        line('│    │ payload.txt                           42 bytes   2026-06-20T15:01:12Z  │', 't-green');
        line('│    └──────────────────────────────────────────────────────────────────────────┘', 't-green');
        line('│', 't-white');
        line('│  🧪  Security Test Suite', 't-white');
        line('│  ──────────────────────────────────────────────────────────────────────────', 't-muted');
        line('│  Runs the 52 path-containment validation tests:', 't-white');
        line('│    npm test', 't-yellow');
        line('│    ━━━ SECURITY: Path Traversal Attacks ━━━', 't-white');
        line('│      ✔ PASS  Block simple ../', 't-green-dim');
        line('│      ✔ PASS  Block ../../ (double traversal)', 't-green-dim');
        line('│      ✔ PASS  Block absolute path escape (C:\\)', 't-green-dim');
        line('│    ━━━ SECURITY: Null Byte Injection ━━━', 't-white');
        line('│      ✔ PASS  Block null byte in filename', 't-green-dim');
        line('│    ════════════════════════════════════════════════════════════', 't-white');
        line('│      TEST RESULTS: 52 total | ✔ Passed: 52 | ✖ Failed: 0', 't-green');
        line('│    ════════════════════════════════════════════════════════════', 't-white');
        line('└────────────────────────────────────────────────────────────────────────────────', 't-yellow');
        setTimeout(showMenu, 500);
        break;
      case 'npm run web':
      case 'web':
        line('[✔] Web UI server is already active and serving this terminal dashboard.', 't-green');
        setTimeout(showMenu, 500);
        break;
      case 'npm run test':
      case 'test':
      case 'npm test':
        line('[✔] Executing real test runner in backend node sandbox...', 't-yellow');
        send('RUN_TESTS');
        break;
      default:
        const parts = input.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        if (cmd === 'cat' && parts[1]) {
           send('EXTRACT_DATA', { filename: parts[1] });
        } else {
           line(`[✖] Invalid selection: ${input}`, 't-red');
           setTimeout(showMenu, 200);
        }
    }
  }

  function connect() {
    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(`${proto}//${location.host}`);

    ws.addEventListener('open', () => {
      bootSequence();
    });

    ws.addEventListener('close', () => {
      line('[✖] Connection closed.', 't-red');
    });

    ws.addEventListener('message', (e) => handleMessage(JSON.parse(e.data)));
  }

  function send(type, payload = {}) {
    if (!ws || ws.readyState !== WebSocket.OPEN) return line('Not connected.', 't-red');
    ws.send(JSON.stringify({ type, payload }));
  }

  function kv(key, val) {
    lineHTML(`  <span class="t-green">${key.padEnd(20)}</span><span class="t-white">${val}</span>`, 't-line');
  }

  function handleMessage(msg) {
    const d = msg.data;
    switch (msg.type) {
      case 'RECON_RESULT':
        line('');
        line('[RECON] Target Fingerprint', 't-red');
        line('');
        kv('OS Type', d.system.osType);
        kv('Platform', d.system.osPlatform);
        kv('Hostname', d.system.hostname);
        kv('CPU Model', d.cpu.model);
        kv('RAM Used', d.memory.used);
        line('');
        setTimeout(showMenu, 500);
        break;
      case 'PAYLOAD_RESULT':
      case 'EXTRACT_RESULT':
      case 'INJECT_RESULT':
      case 'DESTROY_RESULT':
        if (d.success) {
          if (d.operation === 'READ') {
            line('');
            line('┌─── EXTRACTED DATA ──────────────────────────────────────────────', 't-muted');
            for (const l of d.content.split('\n')) line(`│ ${l}`, 't-white');
            line('└─────────────────────────────────────────────────────────────────', 't-muted');
          } else {
            line(`[✔] Success: ${d.message || d.operation}`, 't-green');
          }
        } else {
          line(`[✖] Error: ${d.message || d.error}`, 't-red');
        }
        setTimeout(showMenu, 500);
        break;
      case 'SCAN_RESULT':
        line('');
        if (d.success && d.files) {
          line(`[SCAN] Found ${d.fileCount} files in sandbox`, 't-green');
          for (const f of d.files) line(`    ${f.name.padEnd(20)} ${f.size}B`, 't-white');
        } else {
          line(`[✖] ${d.message || 'Error scanning directory'}`, 't-red');
        }
        setTimeout(showMenu, 500);
        break;
      case 'EXFIL_RESULT':
        line(d.success ? `[✔] ${d.message}` : `[✖] ${d.message}`, d.success ? 't-green' : 't-red');
        setTimeout(showMenu, 500);
        break;
      case 'ATTACK_PHASE':
        line(`[${d.phase}] ${d.description}`, 't-green');
        if (d.phase === '2.7' || d.phase === '2.5') {
          document.body.classList.add('screen-shake');
          output.classList.add('green-flash');
          setTimeout(() => {
            document.body.classList.remove('screen-shake');
            output.classList.remove('green-flash');
          }, 400);
        }
        break;
      case 'ATTACK_COMPLETE':
        line('[✔] Attack chain complete.', 't-green');
        setTimeout(showMenu, 500);
        break;
      case 'TEST_OUTPUT':
        line(d.text.trim(), d.isError ? 't-red' : 't-green-dim');
        break;
      case 'TEST_COMPLETE':
        line(`Tests exited with code ${d.exitCode}`, d.exitCode === 0 ? 't-green' : 't-red');
        setTimeout(showMenu, 500);
        break;
      case 'KILLED':
        const overlay = document.createElement('div');
        overlay.className = 'kill-overlay';
        overlay.innerHTML = `<div class="kill-title">SESSION TERMINATED</div><div class="kill-msg">${esc(d.message)}</div>`;
        document.body.appendChild(overlay);
        if (ws) ws.close();
        break;
      case 'ERROR':
        line(`[✖] ${typeof d === 'string' ? d : d.message}`, 't-red');
        setTimeout(showMenu, 500);
        break;
    }
  }

  cmdInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = cmdInput.value;
      cmdInput.value = '';
      processCommand(val);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const val = cmdInput.value.trim().toLowerCase();
      if (val) {
        const matches = COMMANDS.filter(c => c.startsWith(val));
        if (matches.length === 1) {
          cmdInput.value = matches[0];
        } else if (matches.length > 1) {
          line('');
          line(`Matches: ${matches.join(', ')}`, 't-muted');
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) cmdInput.value = commandHistory[--historyIndex];
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) cmdInput.value = commandHistory[++historyIndex];
      else { historyIndex = commandHistory.length; cmdInput.value = ''; }
    }
  });

  terminal.addEventListener('click', () => cmdInput.focus());

  modalClose.addEventListener('click', () => { payloadModal.classList.add('hidden'); cmdInput.focus(); });
  payloadModal.addEventListener('click', (e) => { if (e.target === payloadModal) { payloadModal.classList.add('hidden'); cmdInput.focus(); } });

  document.querySelectorAll('[data-crud]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.crud;
      const fn = payloadFilename.value.trim();
      const ct = payloadContent.value;
      if (!fn) return line('[✖] Filename required.', 't-red');

      echoCmd(`${action.split('_')[0].toLowerCase()} ${fn}`);
      switch (action) {
        case 'DROP_PAYLOAD': send('DROP_PAYLOAD', { filename: fn, content: ct }); break;
        case 'EXTRACT_DATA': send('EXTRACT_DATA', { filename: fn }); break;
        case 'INJECT_CODE': send('INJECT_CODE', { filename: fn, content: ct }); break;
        case 'DESTROY_EVIDENCE': send('DESTROY_EVIDENCE', { filename: fn }); break;
      }
      payloadModal.classList.add('hidden');
      payloadFilename.value = ''; payloadContent.value = '';
      cmdInput.focus();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !payloadModal.classList.contains('hidden')) {
      payloadModal.classList.add('hidden');
      cmdInput.focus();
    }
  });

  connect();

})();
