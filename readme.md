<p align="center">
  <img src="./assets/venom_banner.png" alt="VENOM.JS Banner" width="800">
</p>

<p align="center">
  <strong>☠️ A JavaScript-based tool that gathers system information & environment variables and performs CRUD operations on code files — wrapped in a hacker-themed CLI & Web C2 Dashboard. ☠️</strong>
</p>

---

## 🦠 What is VENOM.JS?

**VENOM.JS** is a JavaScript-based virus simulator built for **Thunder Hackathon 3.0**. Like real malware, it begins by fingerprinting its host — silently harvesting OS details, CPU specs, hostname, Node.js version, platform info, home directory, and environment variables. It then deploys a sandboxed payload engine capable of full **CRUD operations** on code files — creating, reading, injecting, and destroying them on command.

Every piece of collected intelligence is displayed in a structured format (hacker-styled ANSI console + exportable JSON) with zero crashes on missing values. Pure Node.js. Zero external packages. Maximum chaos — completely contained.

> [!WARNING]
> **EDUCATIONAL PURPOSES ONLY** — All file operations are sandboxed to `./workspace`. No harm is caused to your system.

---

## 🖥️ Interfaces

VENOM.JS is available on two interfaces:

| Interface | How to Run | Best For |
| :--- | :--- | :--- |
| ☠️ **CLI Terminal** | `node index.js` | **Recommended** — reads your actual machine's data |
| 🌐 **Web C2 Dashboard** | `npm run web` → `localhost:3000` or [venom-js.onrender.com](https://venom-js.onrender.com/) | Visual demo only |

> [!IMPORTANT]
> **Use the CLI terminal for accurate results.** The web dashboard is hosted via Express, so system information displayed there reflects the **server's** hardware configuration, not your local machine. For real host telemetry, always run `node index.js`.

---

## 📥 Step 1 — Download the Project

Choose one of the two options below to get the project files on your machine:

**Option A: Clone using Git (Recommended)**
```bash
git clone https://github.com/AbhimanyuSah-DEV/VENOM.JS.git
cd VENOM.JS
```

**Option B: Download as a ZIP File**
1. Visit the [GitHub Repository](https://github.com/AbhimanyuSah-DEV/VENOM.JS).
2. Click the green **Code** button → **Download ZIP**.
3. Extract the `.zip` to a folder on your computer.

---

## 📦 Step 2 — Verify Prerequisites

Ensure you have **Node.js v18.0.0 or higher** installed:
```bash
node --version
```
> This project has **zero external dependencies** — you do not need to run `npm install`.

---

## 🖥️ Step 3 — Navigate & Run

**🖥️ Windows (Command Prompt)**
```cmd
cd C:\path\to\VENOM.JS
node index.js
```
> 💡 **Tip:** In File Explorer, navigate to the `VENOM.JS` folder, click the address bar, type `cmd`, and press Enter.

**🖥️ Windows (PowerShell)**
```powershell
cd "C:\path\to\VENOM.JS"
node index.js
```

**🖥️ macOS / Linux / Git Bash**
```bash
cd /path/to/VENOM.JS
node index.js
```

---

## 🌐 Local Hosting — Web C2 Dashboard

To run the interactive web dashboard locally:

1. Start the Express server:
   ```bash
   npm run web
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
3. You'll land on the **Matrix digital rain** boot screen. Click any command or type in the terminal to enter the Web C2 Dashboard.

> [!IMPORTANT]
> The web dashboard reads system information from the **machine running the server**, not the visitor's browser. For accurate local telemetry, always use `node index.js` (CLI mode) instead.

**Hosted live on Render:** [venom-js.onrender.com](https://venom-js.onrender.com/)

---

## 🎮 VENOM.JS Command Center

When you run `node index.js`, you'll see the ASCII banner and the main menu:

```
  ┌────────────────────────────────────────────────────────┐
  │ ⚡ VENOM.JS — Command Center                          │
  ├────────────────────────────────────────────────────────┤
  │ 1  🔍  Target Reconnaissance      (scan system info)  │
  │ 2  💉  Payload Operations (CRUD)   (file manipulation) │
  │ 3  ☠️   Execute Full Attack Chain   (automated demo)   │
  │ 4  📡  Exfiltrate Data (JSON)      (export report)    │
  │ 5  🗂️   Scan Target Directory       (list files)       │
  │ 0  🚪  Disengage & Exit                               │
  └────────────────────────────────────────────────────────┘

  venom>
```

Type a number and press Enter to execute.

---

## 🔍 Option 1 — Target Reconnaissance

**What it simulates:** Malware fingerprinting the victim machine to determine the attack surface.

Type `1` and press Enter. You'll see:

```
  [RECON] Target Fingerprint
  ──────────────────────────────────────────────────────────────
    OS Type               Windows_NT
    Platform              win32
    OS Release            10.0.26200
    CPU Architecture      x64
    Hostname              user
    Node.js Version       v24.11.1
    Home Directory        C:\Users\user
    System Uptime         7d 13h 2m 39s

  [CPU] Processor Intel
  ──────────────────────────────────────────────────────────────
    Model                 13th Gen Intel(R) Core(TM) i5-13420H
    Logical Cores         12
    Base Speed            2611 MHz

  [MEMORY] RAM Mapping
  ──────────────────────────────────────────────────────────────
    Total                 15.63 GB
    Used                  11.90 GB
    Free                  3.74 GB
    Consumption           ██████████████████████░░░░░░░░░ 76.1%

  [NETWORK] Network Interfaces Discovered
  ──────────────────────────────────────────────────────────────
    Interface             Wi-Fi
    IPv4 Address          192.168.0.105
    MAC Address           58:02:05:83:ff:ba

  [ENV] Environment Variables Harvested
  ──────────────────────────────────────────────────────────────
    PATH                  C:\Windows\system32;...
    USER                  user
    SHELL                 C:\Windows\system32\cmd.exe
```

> **Judge talking point:** *"Real malware collects this exact data to choose exploits, identify high-value targets, and detect VM/sandbox environments."*

---

## 💉 Option 2 — Payload Operations (CRUD)

**What it simulates:** Malware's ability to create, read, modify, and delete files on the victim's machine.

```
  ┌──────────────────────────────────────────────┐
  │ 💉 Payload Operations                        │
  ├──────────────────────────────────────────────┤
  │ 1  📦  Drop Payload         (create file)    │
  │ 2  📖  Extract Data          (read file)     │
  │ 3  💉  Inject Code           (append)        │
  │ 4  🗑️   Destroy Evidence      (delete file)   │
  │ 0  ↩️   Return to Command Center              │
  └──────────────────────────────────────────────┘
```

Example session:
```
  venom> operation> 1
  venom> target filename> secret.txt
  venom> payload content> Sensitive stolen data

    [✔] Payload dropped: "secret.txt" (22 bytes)
```

> All operations are sandboxed to `./workspace`. Path traversal like `../secret.txt` is **blocked**.

---

## ☠️ Option 3 — Execute Full Attack Chain

**What it simulates:** A complete malware lifecycle — from initial payload drop through evidence cleanup.

Type `3` and press Enter. Sit back and watch the attack unfold across **7 phases**:

| Phase | Operation | What Real Malware Does |
| :--- | :--- | :--- |
| 2.1 | Payload Drop | Writes malicious file to disk |
| 2.2 | Data Extraction | Reads sensitive files from victim |
| 2.3 | Code Injection | Injects code into existing files |
| 2.4 | Verify Injection | Confirms the injection succeeded |
| 2.5 | Evidence Cleanup | Deletes logs and traces |
| 2.6 | Verify Cleanup | Confirms traces are destroyed |
| 2.7 | Sandbox Escape | Tries to break out of confinement |

**Key moments for judges:**
- **Phase 2.4** — shows both original + injected content → proves code injection works
- **Phase 2.6** — returns `{ success: false, error: "ENOENT" }` → proves graceful error handling
- **Phase 2.7** — sandbox catches `../escape.txt` → proves security works

---

## 📡 Option 4 — Exfiltrate Data

**What it simulates:** Malware saving stolen intel to a drop file for later extraction.

```
  [✔] Intel exfiltrated to workspace/exfil-report-2026-06-20T14-54-45-117Z.json
```

---

## 🗂️ Option 5 — Scan Target Directory

**What it simulates:** Malware scanning the filesystem for valuable files.

```
  ┌──────────────────────────────────────────────────────────────────────────┐
  │ 🗂️  Target Directory (2 files found)                                    │
  ├──────────────────────────────────────────────────────────────────────────┤
  │ exfil-report-2026-06-20.json        1245 bytes   2026-06-20T14:54:45Z  │
  │ payload.txt                           42 bytes   2026-06-20T15:01:12Z  │
  └──────────────────────────────────────────────────────────────────────────┘
```

---

## 🧪 Security Test Suite

Run the 52-test security suite to prove the simulator is safe:

```bash
npm test
```

```
━━━ SECURITY: Path Traversal Attacks ━━━
  ✔ PASS  Block simple ../
  ✔ PASS  Block ../../ (double traversal)
  ✔ PASS  Block deeply nested traversal
  ...
━━━ SECURITY: Null Byte Injection ━━━
  ✔ PASS  Block null byte in filename
  ...
════════════════════════════════════════════════════════════
  TEST RESULTS: 52 total
  ✔ Passed: 52
  ✖ Failed: 0
════════════════════════════════════════════════════════════
```

---
## 🧠 Code Flow & Strategy

VENOM.JS is built in **3 layers** — each file has one job:

| Layer | Files | Responsibility |
| :--- | :--- | :--- |
| **Presentation** | `index.js`, `public/` | User menus, ANSI styling, WebSocket UI — no business logic |
| **Engine** | `src/engine.js` | Orchestrates calls, returns pure JSON — no `console.log` |
| **Data** | `src/sysInfo.js`, `src/fileCrud.js` | Raw OS APIs + sandboxed file I/O |

---

### Flow 1 — Reconnaissance (Option 1)

```
User selects Option 1
        ↓
index.js  calls  engine.runRecon()
        ↓
engine.js  calls  getSystemTelemetry()  in  src/sysInfo.js
        ↓
sysInfo.js calls Node.js built-in APIs:
  • os.type() / os.platform() / os.release()  → OS details
  • os.arch() / os.cpus()                     → CPU model, cores, speed
  • os.hostname()                             → machine name
  • process.version                           → Node.js version
  • os.homedir()                              → home directory
  • os.totalmem() / os.freemem()              → RAM usage + progress bar
  • os.networkInterfaces()                    → IPv4 address + MAC
  • process.env.PATH / USER / SHELL / HOME…  → env vars (with || fallbacks)
        ↓
Returns a structured JSON object  →  engine.js  →  index.js
        ↓
index.js renders it using src/utils.js  (ANSI color + box formatting)
OR server.js broadcasts it as a WebSocket message to the browser
```

---

### Flow 2 — CRUD File Operations (Option 2)

```
User picks an operation + enters filename & content
        ↓
index.js calls the matching engine function:
  dropPayload()      →  engine calls  createFile()    (CREATE)
  extractData()      →  engine calls  readFile()      (READ)
  injectCode()       →  engine calls  updateFile()    (UPDATE / append)
  destroyEvidence()  →  engine calls  deleteFile()    (DELETE)
        ↓
Every call first runs through  safePath()  in src/fileCrud.js:
  1. Checks filename is a non-empty string
  2. Blocks null-byte injection  (\0)
  3. Resolves absolute path using  path.resolve()
  4. Verifies path starts with  BASE_DIR  (./workspace)
  5. Rejects if path equals  BASE_DIR  itself
        ↓
If all checks pass → executes:
  fs.writeFileSync / readFileSync / appendFileSync / unlinkSync
        ↓
Returns  { success, operation, filename, size, message }  to index.js
        ↓
index.js renders the result with color-coded ANSI output
```

---

