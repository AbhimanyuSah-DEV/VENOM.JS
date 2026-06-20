# 🚀 Walkthrough — VENOM.JS Virus Simulator

> **⚠️ Educational simulation only. No actual harm is caused.**

A step-by-step guide to running and demonstrating VENOM.JS for hackathon judges.

---

## 📦 Prerequisites

| Requirement | Minimum Version | Check Command |
|---|---|---|
| **Node.js** | v18.0.0+ | `node --version` |

> This project has **zero external dependencies** — no `npm install` is needed.

---

## 🖥️ How to Run on Command Prompt (Windows)

### Step 1 — Open Command Prompt

Press `Win + R`, type `cmd`, and hit Enter.

### Step 2 — Navigate to the Project Folder

```cmd
cd C:\Users\Vidushi\coding\Thunder Hackathon\Thunder HAckathon 3
```

> **Tip:** Open the folder in File Explorer, click the address bar, type `cmd`, and press Enter.

### Step 3 — Launch VENOM.JS

```cmd
node index.js
```

Or using npm:

```cmd
npm start
```

### Step 4 — Run Security Tests

```cmd
npm test
```

---

## 🖥️ How to Run on PowerShell

```powershell
cd "C:\Users\Vidushi\coding\Thunder Hackathon\Thunder HAckathon 3"
node index.js
```

---

## 🖥️ How to Run on Git Bash / Linux / macOS

```bash
cd "/path/to/Thunder HAckathon 3"
node index.js
```

---

## 🎮 VENOM.JS Command Center

When you run `node index.js`, you'll see:

```
    ██╗   ██╗███████╗███╗   ██╗ ██████╗ ███╗   ███╗       ██╗███████╗
    ██║   ██║██╔════╝████╗  ██║██╔═══██╗████╗ ████║       ██║██╔════╝
    ...
          ░▒▓█ EDUCATIONAL VIRUS SIMULATOR █▓▒░
       System Reconnaissance · File Manipulation · Data Exfiltration
   ⚠  For educational purposes only. No actual harm is caused.  ⚠

  ┌────────────────────────────────────────────────────────┐
  │ ⚡ VENOM.JS — Command Center                          │
  ├────────────────────────────────────────────────────────┤
  │ 1  🔍  Target Reconnaissance      (scan system info)  │
  │ 2  💉  Payload Operations (CRUD)   (file manipulation) │
  │ 3  ☠️   Execute Full Attack Chain   (automated demo)    │
  │ 4  📡  Exfiltrate Data (JSON)      (export report)     │
  │ 5  🗂️   Scan Target Directory       (list files)        │
  │ 0  🚪  Disengage & Exit                                │
  └────────────────────────────────────────────────────────┘

  venom>
```

Type a number and press **Enter** to execute.

---

## 🔍 Option 1 — Target Reconnaissance

**What it simulates**: Malware fingerprinting the victim machine to determine the attack surface.

**Type**: `1` and press Enter.

**What you'll see**:

```
  [RECON] Target Fingerprint
  ──────────────────────────────────────────────────────────────
    OS Type               Windows_NT
    Platform              win32
    OS Release            10.0.26200
    CPU Architecture      x64
    Hostname              Abhimanyu
    Node.js Version       v24.11.1
    Home Directory        C:\Users\Vidushi
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
    USER                  Vidushi
    SHELL                 C:\Windows\system32\cmd.exe
```

> **Judge talking point**: "Real malware collects this exact data to choose exploits, identify high-value targets, and detect VM/sandbox environments."

---

## 💉 Option 2 — Payload Operations (CRUD)

**What it simulates**: Malware's ability to create, read, modify, and delete files on the victim's machine.

**Submenu**:
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

**Example session**:
```
  venom> operation> 1
  venom> target filename> secret.txt
  venom> payload content> Sensitive stolen data

    [✔] Payload dropped: "secret.txt" (22 bytes)
```

> **All operations are sandboxed** to `./workspace`. Path traversal like `../secret.txt` is blocked.

---

## ☠️ Option 3 — Execute Full Attack Chain

**What it simulates**: A complete malware lifecycle — from initial payload drop through evidence cleanup.

**Type**: `3` and press Enter. Sit back and watch the attack unfold.

**The 7 phases**:

| Phase | Operation | What Real Malware Does |
|---|---|---|
| 2.1 | **Payload Drop** | Writes malicious file to disk |
| 2.2 | **Data Extraction** | Reads sensitive files from victim |
| 2.3 | **Code Injection** | Injects code into existing files |
| 2.4 | **Verify Injection** | Confirms the injection succeeded |
| 2.5 | **Evidence Cleanup** | Deletes logs and traces |
| 2.6 | **Verify Cleanup** | Confirms traces are destroyed |
| 2.7 | **Sandbox Escape** | Tries to break out of confinement |

**Key moments for judges**:
- Phase 2.4 shows both original + injected content — **proves code injection works**
- Phase 2.6 returns `{ success: false, error: "ENOENT" }` — **proves graceful error handling**
- Phase 2.7 shows the sandbox catching `../escape.txt` — **proves security works**
- Skull ASCII art and typewriter effects — **innovation and presentation**

---

## 📡 Option 4 — Exfiltrate Data

**What it simulates**: Malware saving stolen intel to a "drop file" for later extraction.

```
  [✔] Intel exfiltrated to workspace/exfil-report-2026-06-20T14-54-45-117Z.json
```

---

## 🗂️ Option 5 — Scan Target Directory

**What it simulates**: Malware scanning the filesystem for valuable files.

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

```cmd
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

## 🎯 Recommended Demo Flow for Judges

For maximum impact during your hackathon presentation:

1. **Open Command Prompt** → `cd` to project → `node index.js`
2. The VENOM.JS banner and boot sequence create immediate visual impact
3. **Option 3** → Run the Full Attack Chain first (hands-free, shows everything)
4. **Option 1** → Show reconnaissance data (memory bar is eye-catching)
5. **Option 2** → Quick interactive payload drop + extract to show interactivity
6. **Option 4** → Exfiltrate data, then **Option 5** to show the drop file
7. **Option 0** → Disengage cleanly
8. **Run `npm test`** → Show 52/52 passing security tests

**Total demo time: ~3 minutes**

> **Key pitch**: "VENOM.JS simulates every phase of a real malware attack — reconnaissance, payload delivery, code injection, data exfiltration, and evidence cleanup — while being completely safe. It demonstrates that JavaScript alone, using only built-in Node.js modules, has the power to perform all of these operations."

---

## ✅ What Was Built

- 🔍 **Reconnaissance Module** — 17 data points gathered from built-in APIs
- 💉 **Payload Engine** — Create, Read, Inject, Delete with path-traversal protection
- 🎨 **Hacker UI Toolkit** — ANSI colors, skull ASCII, typewriter, spinners — all from scratch
- ☠️ **Attack Chain Simulator** — 7-phase automated demo sequence
- 📡 **Data Exfiltration** — Timestamped JSON intel reports
- 🛡️ **Security Sandbox** — 52 tests prove it can't escape
- 0️⃣ **Zero Dependencies** — Built-in modules only
