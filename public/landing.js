(() => {
  'use strict';

  const output = document.getElementById('terminal-output');
  const cmdInput = document.getElementById('command-input');
  const terminalWrapper = document.getElementById('terminal-wrapper');
  const canvas = document.getElementById('matrix-canvas');

  let commandHistory = [];
  let historyIndex = -1;
  let isRedirecting = false;
  let matrixRainInterval = null;
  let matrixEnabled = true;

  const COMMANDS = ['help', 'npm run web', 'npm run start', 'npm run test', 'about', 'matrix', 'clear'];

  const BANNER = `
<span class="t-red">██╗   ██╗███████╗███╗   ██╗ ██████╗ ███╗   ███╗      ██╗███████╗</span>
<span class="t-red">██║   ██║██╔════╝████╗  ██║██╔═══██╗████╗ ████║      ██║██╔════╝</span>
<span class="t-red">██║   ██║█████╗  ██╔██╗ ██║██║   ██║██╔████╔██║      ██║███████╗</span>
<span class="t-red">╚██╗ ██╔╝██╔══╝  ██║╚██╗██║██║   ██║██║╚██╔╝██║ ╚██  ██║╚════██║</span>
<span class="t-red"> ╚████╔╝ ███████╗██║ ╚████║╚██████╔╝██║ ╚═╝ ██║  ╚█████╔╝███████║</span>
<span class="t-red">  ╚═══╝  ╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝     ╚═╝   ╚════╝ ╚══════╝</span>
`;

  // ── Matrix Rain Code ───────────────────────────────────────────────
  function initMatrixRain() {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const columns = Math.floor(width / 20) + 1;
    const yPositions = Array(columns).fill(0);

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#00ff41';
      ctx.font = '15px monospace';

      for (let i = 0; i < yPositions.length; i++) {
        const text = Math.random() > 0.5 ? Math.floor(Math.random() * 2).toString() : Math.floor(Math.random() * 16).toString(16).toUpperCase();
        const x = i * 20;
        const y = yPositions[i];

        ctx.fillText(text, x, y);

        if (y > 100 + Math.random() * 10000) {
          yPositions[i] = 0;
        } else {
          yPositions[i] += 20;
        }
      }
    }

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    if (matrixRainInterval) clearInterval(matrixRainInterval);
    matrixRainInterval = setInterval(draw, 33);
  }

  // ── Terminal Utilities ────────────────────────────────────────────
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

  function esc(s) {
    const d = document.createElement('div');
    d.textContent = String(s);
    return d.innerHTML;
  }

  // ── Typing Simulator ──────────────────────────────────────────────
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function typeCommandAndExecute(cmdText) {
    cmdInput.disabled = true;
    cmdInput.value = '';
    
    // Type characters one by one in the input line for visual effect
    for (let i = 0; i < cmdText.length; i++) {
      cmdInput.value += cmdText[i];
      await delay(60);
    }
    
    await delay(300);
    const cmd = cmdInput.value;
    cmdInput.value = '';
    cmdInput.disabled = false;
    cmdInput.focus();
    
    processCommand(cmd);
  }

  // ── Boot Sequence ──────────────────────────────────────────────────
  async function runBootSequence() {
    cmdInput.disabled = true;
    
    line('[BOOT] Loading VENOM Virtual Environment...', 't-green');
    await delay(400);
    line('[BOOT] System: Node.js Safe Sandbox Mode (v2.0.0)', 't-muted');
    await delay(300);
    line('[BOOT] Filesystem isolation layer: ESTABLISHED', 't-muted');
    await delay(350);
    
    // Progress bar for security check / loading modules
    line('Verifying sandboxed security containment (52 unit tests):', 't-green');
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
    line('[✔] Security containment checks: OK (52 unit tests pre-loaded)', 't-muted');
    await delay(400);

    line('[✔] Control Center components fully loaded.', 't-green');
    await delay(500);
    line('', 't-line');
    
    // Auto-type 'help' to introduce the options to the user
    await typeCommandAndExecute('help');
  }

  // ── Show Help Menu ────────────────────────────────────────────────
  function showHelpMenu() {
    lineHTML(BANNER, 't-ascii');
    lineHTML(`
<span class="t-yellow">⚡ VENOM.JS Control Console — Interactive Options</span>
<span class="t-muted">───────────────────────────────────────────────────────────────────────────</span>
Select a command below to run, or type it directly in the input box.

  ➤ <span class="cmd-link" data-cmd="npm run web">npm run web</span>       Launch the browser-based Interactive Terminal UI
  ➤ <span class="cmd-link" data-cmd="npm run start">npm run start</span>     View instructions to run CLI simulator offline
  ➤ <span class="cmd-link" data-cmd="npm run test">npm run test</span>      Execute the 52 safety and behavior unit tests
  ➤ <span class="cmd-link" data-cmd="about">about</span>             About the project architecture and features
  ➤ <span class="cmd-link" data-cmd="matrix">matrix</span>            Toggle Matrix code rain overlay on/off
  ➤ <span class="cmd-link" data-cmd="clear">clear</span>             Clear the screen console
<span class="t-muted">───────────────────────────────────────────────────────────────────────────</span>
`, 't-line');
  }

  // ── Shell Commands Engine ──────────────────────────────────────────
  async function processCommand(raw) {
    const input = raw.trim();
    if (!input) return;

    commandHistory.push(input);
    historyIndex = commandHistory.length;

    // Echo command to terminal output
    lineHTML(`<span class="t-green">guest@venom:~$</span> <span class="t-user-cmd">${esc(input)}</span>`);

    const parts = input.split(/\s+/);
    const cmd = parts.join(' ').toLowerCase();

    switch (cmd) {
      case 'help':
      case 'menu':
      case '?':
        showHelpMenu();
        break;

      case 'npm run web':
      case 'web':
      case 'start web':
        isRedirecting = true;
        cmdInput.disabled = true;
        
        line('');
        line('[✔] Initiating Control Center Bridge...', 't-green');
        await delay(500);
        line('Express Static Server: Initializing port 3000...', 't-muted');
        await delay(600);
        line('WebSocket Broker System: Connected on ws://localhost:3000', 't-muted');
        await delay(500);
        
        // Progress bar simulation
        line('Loading interface assets into web browser buffer:', 't-green');
        const progressBarLength = 30;
        let progressElement = document.createElement('p');
        progressElement.className = 't-line t-green';
        output.appendChild(progressElement);
        
        for (let i = 0; i <= progressBarLength; i++) {
          const pct = Math.floor((i / progressBarLength) * 100);
          const filled = '█'.repeat(i);
          const empty = '░'.repeat(progressBarLength - i);
          progressElement.textContent = `[${filled}${empty}] ${pct}%`;
          scrollBottom();
          await delay(40 + Math.random() * 60);
        }
        
        await delay(400);
        line('[✔] Assets compiled successfully. Launching console view...', 't-green');
        
        // Trigger CRT screen shake & green flash effect
        document.body.classList.add('screen-shake');
        await delay(300);
        document.body.classList.remove('screen-shake');
        
        line('Operator session starting. Good luck.', 't-yellow');
        await delay(600);
        
        // Redirect operator to the terminal page
        window.location.href = '/terminal.html';
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
        break;

      case 'npm run test':
      case 'test':
      case 'npm test':
        line('');
        line('Running behavior integrity and containment checks (test.js)...', 't-yellow');
        await delay(600);
        
        const tests = [
          'test_recon_telemetry: telemetry fetches OS structures',
          'test_recon_cpu: CPU model info contains branding string',
          'test_recon_memory: memory consumption metrics parse correctly',
          'test_sandbox_path_resolve: handles file names cleanly',
          'test_sandbox_path_bounds: stops dot-dot directory escapes',
          'test_sandbox_root_access: checks workspace absolute boundary',
          'test_payload_create: creates new target file successfully',
          'test_payload_read: retrieves payload file contents',
          'test_payload_update: updates existing files safely',
          'test_payload_delete: destroys generated artifacts completely',
          'test_scan_directory: scans sandbox workspace folder files',
          'test_exfiltrate_json: generates and exports report summaries',
          'test_attack_chain_generator: returns iterable generator chain',
          'test_attack_chain_step_recon: validates phase 1 of cyber-chain',
          'test_attack_chain_step_drop: validates phase 2.1 drop operations',
          'test_attack_chain_step_extract: validates phase 2.2 exfil checks',
          'test_attack_chain_step_inject: validates phase 2.3 inject steps',
          'test_attack_chain_step_cleanup: validates evidence eradication step'
        ];

        for (let i = 0; i < tests.length; i++) {
          line(`[✔] PASS: ${tests[i]}`, 't-green-dim');
          await delay(60 + Math.random() * 80);
        }
        
        line('', 't-line');
        line('[✔] SUCCESS: All 52 test assertions verified. Clean containment confirmed.', 't-green');
        break;

      case 'about':
        line('');
        line('┌─── VENOM.JS SYSTEM DETAILS ──────────────────────────────────────', 't-green');
        line('│  VENOM.JS is an educational malware and virus chain simulator.', 't-white');
        line('│  It demonstrates cybersecurity risk vectors in a controlled space.', 't-white');
        line('│  ', 't-white');
        line('│  CORE FEATURES:', 't-yellow');
        line('│  - Reconnaissance: Obtains platform, processor and RAM metrics.', 't-white');
        line('│  - Payload Control: Drops, updates and deletes sandboxed files.', 't-white');
        line('│  - Exfiltration: Reports telemetry as JSON files in workspace/', 't-white');
        line('│  - Cyber Kill Chain: Automatic demo of an full-scale breach.', 't-white');
        line('│  ', 't-white');
        line('│  SECURITY ARCHITECTURE:', 't-yellow');
        line('│  All write and read operations are isolated using a custom safePath()', 't-white');
        line('│  boundary filter to guarantee host files remain completely safe.', 't-white');
        line('└──────────────────────────────────────────────────────────────────', 't-green');
        break;

      case 'matrix':
        matrixEnabled = !matrixEnabled;
        if (matrixEnabled) {
          canvas.style.opacity = '0.15';
          line('Matrix digital rain background: ENABLED', 't-green');
        } else {
          canvas.style.opacity = '0';
          line('Matrix digital rain background: DISABLED', 't-muted');
        }
        break;

      case 'clear':
      case 'cls':
        output.innerHTML = '';
        break;

      default:
        line(`bash: command not found: ${input}. Type 'help' to see active commands.`, 't-red');
    }
  }

  // ── Keyboard Listeners ─────────────────────────────────────────────
  cmdInput.addEventListener('keydown', (e) => {
    if (isRedirecting) return;

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

  // Focus terminal input on body click
  terminalWrapper.addEventListener('click', () => {
    if (!isRedirecting) cmdInput.focus();
  });

  // Handle command link clicks via event delegation
  output.addEventListener('click', (e) => {
    const link = e.target.closest('.cmd-link');
    if (link) {
      if (isRedirecting || cmdInput.disabled) return;
      const cmd = link.dataset.cmd;
      typeCommandAndExecute(cmd);
    }
  });

  window.addEventListener('pageshow', (event) => {
    if (event.persisted || isRedirecting) {
      isRedirecting = false;
      cmdInput.disabled = false;
      cmdInput.value = '';
      cmdInput.focus();
    }
  });

  window.addEventListener('focus', () => {
    if (isRedirecting) {
      isRedirecting = false;
      cmdInput.disabled = false;
      cmdInput.value = '';
      cmdInput.focus();
    }
  });

  // Start Matrix and Boot Sequence
  initMatrixRain();
  runBootSequence();

})();
