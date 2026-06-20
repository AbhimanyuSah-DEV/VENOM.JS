# 📋 VENOM.JS — Project Handoff Summary

> **Project**: VENOM.JS — Educational Virus Simulator
> **Hackathon Theme**: CREATE A VIRUS IN JS
> **Date**: June 20, 2026
> **Status**: ✅ Complete & Tested (52/52 tests pass)

---

## 🗂️ What Was Built

A **zero-dependency** Node.js CLI application that simulates real malware behavior (system reconnaissance, file manipulation, data exfiltration) inside a secure sandbox. Green "Matrix" hacker aesthetic throughout.

---

## 📁 File Structure & Purpose

```
Thunder HAckathon 3/
├── src/
│   ├── sysInfo.js        # Reconnaissance module — gathers OS, CPU, RAM, Network, Env vars
│   ├── fileCrud.js        # Payload engine — sandboxed CRUD with path-traversal security
│   └── utils.js           # Hacker UI toolkit — ANSI colors, ASCII art, spinners, typewriter
├── workspace/             # Sandbox directory (auto-created, all file I/O confined here)
├── index.js               # Main entry — interactive command center with 5 menu options
├── test.js                # 52-test security & vulnerability suite
├── package.json           # ES Module config ("type": "module"), zero dependencies
├── readme.md              # Full documentation with code flow, strategy, data dictionary
└── walkthrough.md         # Step-by-step demo guide with CMD/PowerShell/Bash instructions
```

---

## 🔧 Technical Decisions Already Made

| Decision | Choice | Reason |
|---|---|---|
| **Module system** | ES Modules (`import`/`export`) | Modern standard; `"type": "module"` in package.json |
| **Dependencies** | Zero — built-in only (`os`, `fs`, `path`, `readline`, `process`) | Hackathon constraint + no supply-chain risk |
| **Terminal UI** | Raw ANSI escape codes (`\x1b[xxm`) | No chalk/ora/boxen needed |
| **File sandbox** | `safePath()` validates every path before I/O | Blocks `../`, absolute paths, null bytes, empty strings |
| **Error handling** | Structured return objects `{ success, error, message }` | Never crashes on ENOENT or missing env vars |
| **Color scheme** | Green-on-black "Matrix" hacker theme | Matches "CREATE A VIRUS" hackathon theme |

---

## 🧩 Module API Reference

### `src/sysInfo.js`

```js
import { getSystemTelemetry, formatBytes, formatUptime } from './src/sysInfo.js';

const telemetry = getSystemTelemetry();
// Returns:
// {
//   system:      { osType, osPlatform, osRelease, cpuArchitecture, hostname, nodeVersion, userHomeDir, uptime, uptimeRaw }
//   cpu:         { model, cores, speed }
//   memory:      { total, free, used, usagePercent }
//   network:     [{ interface, address, mac }]
//   environment: { PATH, USER, SHELL, LANG, HOME, TERM, NODE_ENV }
// }

formatBytes(1073741824);  // → "1.00 GB"
formatUptime(90061);       // → "1d 1h 1m 1s"
```

### `src/fileCrud.js`

```js
import { createFile, readFile, updateFile, deleteFile, listFiles, BASE_DIR } from './src/fileCrud.js';

createFile('test.txt', 'content');    // → { success: true, operation: 'CREATE', filename, size, createdAt }
readFile('test.txt');                  // → { success: true, operation: 'READ', filename, content, size, modifiedAt }
                                       // → { success: false, error: 'ENOENT', message: '...' } if missing
updateFile('test.txt', '\nnew line');  // → { success: true, operation: 'UPDATE', filename, newSize, modifiedAt }
deleteFile('test.txt');                // → { success: true, operation: 'DELETE', filename, message }
                                       // → { success: false, error: 'ENOENT', message: '...' } if missing
listFiles();                           // → { success: true, operation: 'LIST', fileCount, files: [{name, size, modified}] }
```

**Security**: All functions call `safePath(filename)` first, which:
1. Rejects empty, whitespace-only, and non-string filenames
2. Blocks null bytes (`\0`)
3. Resolves to absolute path and checks it starts with `BASE_DIR + path.sep`
4. Blocks operations on the workspace directory itself

### `src/utils.js`

```js
import { c, style, BANNER, SKULL, drawBox, progressBar, sectionHeader, divider,
         stripAnsi, delay, spinner, typewriter, kvPair } from './src/utils.js';

// Colors:    c.bGreen, c.bRed, c.bold, c.reset, c.dim, etc.
// Styles:    style.success('msg'), style.error('msg'), style.warn('msg'), style.tag('LABEL')
// Display:   BANNER (ASCII art), SKULL (skull art)
// Layout:    drawBox('title', ['line1', 'line2'], c.bGreen)
//            sectionHeader('TAG', 'Title')
//            kvPair('Key', 'Value', 22)
//            divider()
// Data viz:  progressBar(76.5)  → "██████████████████████░░░░░░░░░ 76.5%"
// Animation: await spinner('Loading...', 600)
//            await typewriter('Hacking in progress...', 15)
// Utility:   stripAnsi('\x1b[91mHello\x1b[0m')  → "Hello"
//            await delay(500)
```

---

## 🎮 Interactive Menu Structure

```
MAIN MENU (index.js)
├── [1] 🔍 Target Reconnaissance     → displayRecon()
├── [2] 💉 Payload Operations         → handlePayloadMenu()
│   ├── [1] 📦 Drop Payload           → createFile()
│   ├── [2] 📖 Extract Data           → readFile()
│   ├── [3] 💉 Inject Code            → updateFile()
│   ├── [4] 🗑️  Destroy Evidence       → deleteFile()
│   └── [0] ↩️  Back
├── [3] ☠️  Full Attack Chain          → runAttackChain()  [7 automated phases]
├── [4] 📡 Exfiltrate Data            → exfiltrateData()  [JSON export]
├── [5] 🗂️  Scan Target Directory      → scanDirectory()   [listFiles()]
└── [0] 🚪 Disengage & Exit
```

---

## 🧪 Test Suite Coverage

Run with: `npm test` or `node test.js`

| Category | # Tests | What's Tested |
|---|---|---|
| Path Traversal Attacks | 11 | `../`, `..\..\`, absolute paths, hidden traversal, all 4 CRUD functions |
| Null Byte Injection | 1 | `filename\0.txt` |
| CRUD Happy Path | 6 | Create → Read → Update → Read → Delete → Read |
| CRUD Edge Cases | 11 | Empty content, 100KB file, Unicode, special chars, idempotent delete, overwrite |
| Input Validation | 4 | Empty, whitespace, `.`, non-string (`123`, `null`, `undefined`) |
| Telemetry Integrity | 7 | All fields present, types correct, values sane, idempotent |
| Utility Functions | 9 | formatBytes, formatUptime, progressBar clamping, stripAnsi, drawBox |
| Sandbox Boundaries | 3 | Root file allowed, `.` blocked, `.hidden` allowed |
| **Total** | **52** | **All pass ✅** |

---

## ⚠️ Known Limitations & Future Work

| Item | Current State | Possible Enhancement |
|---|---|---|
| Subdirectories in workspace | Not supported | Add recursive directory creation/listing |
| Binary file support | Text only (`utf-8`) | Add binary read/write modes |
| Process scanning | Not implemented | Use `child_process.execSync('tasklist')` to list running processes |
| Disk usage | Not implemented | Could add via `child_process` or `fs.statfsSync()` (Node 18.15+) |
| File search/grep | Not implemented | Add `searchFiles(pattern)` using `fs.readFileSync` + regex |
| Network port scanning | Not implemented | Could simulate with `net.createConnection()` |
| Auto-run on startup | Not implemented | Could demonstrate persistence mechanisms (cron/registry) |
| Web-based dashboard | Not built | Could add Express server + HTML report viewer |
| Encryption/decryption | Not implemented | Could simulate ransomware with `crypto` module |

---

## 🏃 How to Run

```bash
# Launch interactive virus simulator
node index.js
# or
npm start

# Run 52-test security suite
npm test
# or
node test.js
```

**No `npm install` needed.** Zero dependencies.

---

## 📐 Code Conventions Used

- **ES6+**: Arrow functions, destructuring, template literals, `const`/`let`
- **ES Modules**: `import`/`export` throughout (not CommonJS `require`)
- **JSDoc**: All public functions have `@param`, `@returns`, `@throws` documentation
- **Return objects**: All CRUD functions return `{ success, operation, ... }` objects
- **Error handling**: `try/catch` for I/O, `||` fallbacks for env vars, structured error objects for user-facing errors
- **Naming**: `camelCase` for functions/variables, `UPPER_CASE` for constants (`BASE_DIR`, `BANNER`)
- **File organization**: Data (sysInfo) / I/O (fileCrud) / Presentation (utils) / Orchestration (index)
