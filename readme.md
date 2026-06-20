# ☠️ VENOM.JS — Educational Virus Simulator

> **⚠️ DISCLAIMER: This is a safe, educational simulation. No actual malicious actions are performed. All file operations are sandboxed.**

> A **zero-dependency** Node.js virus simulator that demonstrates how real malware performs **system reconnaissance**, **environment harvesting**, and **file manipulation** — all within a secure sandbox.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Dependencies](https://img.shields.io/badge/Dependencies-0-brightgreen?style=flat-square)
![Theme](https://img.shields.io/badge/Theme-Create%20A%20Virus%20In%20JS-red?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

---

## 🦠 What Is This?

This project simulates the **core behaviors of real-world malware**, built entirely in JavaScript for educational purposes:

| Real Malware Behavior | VENOM.JS Simulation | How It Works |
|---|---|---|
| **Target Reconnaissance** | 🔍 System fingerprinting | Collects OS, CPU, memory, network, hostname, uptime |
| **Environment Harvesting** | 🌐 Env variable extraction | Reads PATH, USER, SHELL, HOME, NODE_ENV |
| **Payload Delivery** | 📦 File creation (CRUD) | Writes files to the target filesystem |
| **Code Injection** | 💉 File append | Injects content into existing files |
| **Data Exfiltration** | 📡 JSON export | Saves stolen intel to a drop file |
| **Evidence Cleanup** | 🗑️ File deletion | Removes traces after execution |
| **Sandbox Escape Attempt** | 🛡️ Path traversal test | Tries to break out (and fails!) |

> **The key difference**: Real malware does this silently and maliciously. VENOM.JS does it **transparently and safely** inside a sandboxed `./workspace` directory.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Target Reconnaissance** | OS, CPU (model/cores/speed), Memory (visual usage bar), Network IPs, Uptime |
| 💉 **Payload Operations** | Create, Read, Update (inject), Delete files via interactive prompts |
| ☠️ **Full Attack Chain** | Automated 7-phase sequence with skull ASCII art and typewriter effects |
| 📡 **Data Exfiltration** | Export complete target intel to timestamped JSON |
| 🛡️ **Security Sandbox** | All I/O confined to `./workspace` — path traversal attacks are blocked |
| 🎨 **Hacker Terminal UI** | Green Matrix aesthetic, ASCII art, spinners, typewriter, box drawing |
| 0️⃣ **Zero Dependencies** | Built-in Node.js modules only (`os`, `fs`, `path`, `readline`, `process`) |
| 🧪 **52 Security Tests** | Comprehensive test suite covering path traversal, null bytes, edge cases |

---

## 📋 Requirements Checklist

| # | Requirement | Status | Implementation |
|---|-------------|--------|----------------|
| 1 | Operating System details | ✅ | `os.type()`, `os.platform()`, `os.release()` |
| 2 | CPU Architecture | ✅ | `os.arch()`, model, cores, speed via `os.cpus()` |
| 3 | Hostname | ✅ | `os.hostname()` |
| 4 | Node.js Version | ✅ | `process.version` |
| 5 | Platform Information | ✅ | `os.platform()` |
| 6 | User Home Directory | ✅ | `os.homedir()` |
| 7 | Environment Variables | ✅ | PATH, USER, SHELL, LANG, HOME, TERM, NODE_ENV |
| 8 | Structured output | ✅ | Key-value display, boxes, JSON export |
| 9 | Graceful error handling | ✅ | `\|\|` fallbacks, ENOENT catch, try/catch guards |
| 10 | CRUD on files | ✅ | Create, Read, Update, Delete + List |
| 11 | Code flow in README | ✅ | This document |

---

## 🏗️ Project Structure

```
/
├── src/
│   ├── sysInfo.js       # 🔍 Reconnaissance module (OS, CPU, Memory, Network, Env)
│   ├── fileCrud.js       # 💉 Payload engine (sandboxed CRUD with security guard)
│   └── utils.js          # 🎨 Hacker UI toolkit (ANSI colors, boxes, typewriter)
├── workspace/            # 🔒 Sandbox directory (auto-created, all I/O confined here)
├── index.js              # ☠️ Main virus simulator — interactive command center
├── test.js               # 🧪 52-test security & vulnerability suite
├── package.json          # ES Module config, zero external dependencies
├── readme.md             # This file
└── walkthrough.md        # Step-by-step demo guide for judges
```

---

## 🔄 Code Flow & Strategy

### How Real Malware Works vs. VENOM.JS

```
REAL MALWARE                          VENOM.JS (Safe Simulation)
───────────                          ──────────────────────────
1. Silently installs on target   →   1. User runs `node index.js`
2. Fingerprints the system       →   2. getSystemTelemetry() collects OS/CPU/RAM/Net
3. Harvests environment vars     →   3. Reads PATH, USER, SHELL with || fallbacks
4. Drops payload to filesystem   →   4. createFile() writes to ./workspace ONLY
5. Injects code into files       →   5. updateFile() appends to existing files
6. Exfiltrates data to C2 server →   6. Exports JSON report to ./workspace
7. Deletes logs/evidence         →   7. deleteFile() removes traces
8. Spreads to other systems      →   8. ❌ NOT SIMULATED (safe boundary)
```

### Execution Flow

```
node index.js
  │
  ├─► BOOT SEQUENCE
  │     ├── Display VENOM.JS ASCII art banner
  │     ├── Typewriter-style initialization messages
  │     ├── Establish sandbox (fs.mkdirSync ./workspace)
  │     └── Load reconnaissance & payload modules
  │
  ├─► COMMAND CENTER (Interactive Menu Loop)
  │     │
  │     ├── [1] 🔍 Target Reconnaissance
  │     │     ├── Scan target fingerprint (OS, Platform, Hostname, Uptime)
  │     │     ├── Gather CPU intel (Model, Cores, Speed)
  │     │     ├── Map memory (Total/Used/Free + visual progress bar)
  │     │     ├── Discover network interfaces (IPv4, MAC)
  │     │     └── Harvest environment variables (7 variables + fallbacks)
  │     │
  │     ├── [2] 💉 Payload Operations (CRUD Sub-Menu)
  │     │     ├── 📦 Drop Payload    → create file
  │     │     ├── 📖 Extract Data    → read file
  │     │     ├── 💉 Inject Code     → append to file
  │     │     └── 🗑️ Destroy Evidence → delete file
  │     │
  │     ├── [3] ☠️ Execute Full Attack Chain (Automated Demo)
  │     │     ├── Phase 2.1: Payload Drop       (create payload.txt)
  │     │     ├── Phase 2.2: Data Extraction     (read payload)
  │     │     ├── Phase 2.3: Code Injection      (append to payload)
  │     │     ├── Phase 2.4: Verify Injection    (read modified file)
  │     │     ├── Phase 2.5: Evidence Cleanup    (delete payload)
  │     │     ├── Phase 2.6: Verify Cleanup      (read deleted → error)
  │     │     └── Phase 2.7: Sandbox Escape Test (blocked by security)
  │     │
  │     ├── [4] 📡 Exfiltrate Data → export JSON report to workspace
  │     ├── [5] 🗂️ Scan Target Directory → list all files
  │     └── [0] 🚪 Disengage & Exit
  │
  └─► CLEANUP
        └── Close readline, print disconnect message
```

### Architecture: Separation of Concerns

| Module | Virus Analogy | Responsibility |
|---|---|---|
| `src/sysInfo.js` | **Reconnaissance payload** | Pure data-gathering — reads system state, returns plain object. No side effects. |
| `src/fileCrud.js` | **File manipulation engine** | All file I/O + security validation. Every function returns structured results. |
| `src/utils.js` | **Stealth UI layer** | Terminal formatting, hacker aesthetics, animations. Zero business logic. |
| `index.js` | **Command & Control (C2)** | Orchestrates modules, manages interactive menu, delegates operations. |

### Security Sandbox — Why VENOM.JS Is Safe

```
User Input: "../../../etc/passwd"
    ↓
safePath() resolves to absolute path
    ↓
Check: does resolved path start with BASE_DIR + path.sep?
    ↓
NO → throw Error("[SECURITY] Path traversal blocked...")
    ↓
File operation NEVER executes
```

**Defense layers:**
1. **Input validation** — rejects empty, whitespace-only, and non-string filenames
2. **Null byte detection** — blocks `\0` injection before path resolution
3. **Path traversal guard** — `safePath()` validates every path before any I/O
4. **Directory protection** — prevents operations on the workspace directory itself
5. **Graceful errors** — ENOENT and deletion errors return objects, never crash

---

## 🚀 How to Run

```bash
# No installation needed — zero dependencies!
node index.js

# Or using npm
npm start

# Run the 52-test security suite
npm test
```

### Prerequisites
- **Node.js** v18.0.0 or higher
- No other dependencies required

---

## 📊 What Data is Collected (Reconnaissance Report)

| Data Point | Source | What Real Malware Uses This For |
|---|---|---|
| **OS Type** | `os.type()` | Selecting OS-specific exploits |
| **Platform** | `os.platform()` | Choosing compatible payloads |
| **OS Release** | `os.release()` | Checking for known vulnerabilities |
| **CPU Architecture** | `os.arch()` | Deploying architecture-specific shellcode |
| **CPU Model** | `os.cpus()[0].model` | Identifying high-value targets |
| **CPU Cores** | `os.cpus().length` | Calibrating crypto-mining intensity |
| **Hostname** | `os.hostname()` | Identifying the target on a network |
| **Node.js Version** | `process.version` | Exploiting runtime vulnerabilities |
| **Home Directory** | `os.homedir()` | Locating user files for encryption/theft |
| **System Uptime** | `os.uptime()` | Detecting sandbox/VM environments |
| **Memory** | `os.totalmem()` / `os.freemem()` | Detecting analysis VMs (low RAM = likely VM) |
| **Network IPs** | `os.networkInterfaces()` | Lateral movement and data exfiltration routing |
| **MAC Address** | Network interface data | Fingerprinting hardware, evading MAC-based blocks |
| **PATH** | `process.env.PATH` | Finding installed tools to abuse |
| **USER** | `process.env.USER` | Privilege level assessment |
| **SHELL** | `process.env.SHELL` | Command execution target |

> All environment variables use `||` fallbacks to `"Not Available"` — the app **never crashes** on missing values.

---

## 🧪 Security Test Suite

Run with `npm test` — 52 tests covering:

| Category | Tests | Description |
|---|---|---|
| Path Traversal | 11 | `../`, `..\..\`, absolute paths, hidden in subdirs |
| Null Byte Injection | 1 | `filename\0.txt` |
| CRUD Happy Path | 6 | Full create→read→update→read→delete→read cycle |
| CRUD Edge Cases | 11 | Empty content, 100KB files, Unicode, special chars |
| Input Validation | 4 | Empty, whitespace, non-string, `.` filenames |
| Telemetry Integrity | 7 | All fields present, types correct, no undefined |
| Utility Functions | 9 | formatBytes, formatUptime, progressBar boundaries |
| Sandbox Boundaries | 3 | Exact prefix matching, hidden files allowed |

---

## 🛠️ Technologies Used

- **Runtime**: Node.js (v18+)
- **Language**: JavaScript (ES6+ with ES Modules)
- **Dependencies**: `0` — built-in modules only
- **UI**: Raw ANSI escape codes (no chalk, no ora, no boxen)
- **Testing**: Custom 52-test security suite (zero framework)

---

## 📜 License

MIT — For educational purposes only.
