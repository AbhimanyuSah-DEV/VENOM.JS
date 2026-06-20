// ═══════════════════════════════════════════════════════════════════════
//  VENOM.JS — Terminal Formatting & Hacker UI Toolkit
//  Zero Dependencies. Raw ANSI escape codes.
//  Green-on-black "Matrix" aesthetic for the virus theme.
// ═══════════════════════════════════════════════════════════════════════

// ── ANSI Escape Codes ────────────────────────────────────────────────
const c = {
  reset:       '\x1b[0m',
  bold:        '\x1b[1m',
  dim:         '\x1b[2m',
  italic:      '\x1b[3m',
  underline:   '\x1b[4m',
  blink:       '\x1b[5m',

  black:       '\x1b[30m',
  red:         '\x1b[31m',
  green:       '\x1b[32m',
  yellow:      '\x1b[33m',
  blue:        '\x1b[34m',
  magenta:     '\x1b[35m',
  cyan:        '\x1b[36m',
  white:       '\x1b[37m',

  bRed:        '\x1b[91m',
  bGreen:      '\x1b[92m',
  bYellow:     '\x1b[93m',
  bBlue:       '\x1b[94m',
  bMagenta:    '\x1b[95m',
  bCyan:       '\x1b[96m',
  bWhite:      '\x1b[97m',

  bgBlack:     '\x1b[40m',
  bgRed:       '\x1b[41m',
  bgGreen:     '\x1b[42m',
  bgYellow:    '\x1b[43m',
  bgBlue:      '\x1b[44m',
  bgMagenta:   '\x1b[45m',
  bgCyan:      '\x1b[46m',
};

// ── Virus-Themed Style Helpers ───────────────────────────────────────
const style = {
  heading:  (t) => `${c.bold}${c.bGreen}${t}${c.reset}`,
  success:  (t) => `${c.bGreen}[✔] ${t}${c.reset}`,
  error:    (t) => `${c.bRed}[✖] ${t}${c.reset}`,
  warn:     (t) => `${c.bYellow}[!] ${t}${c.reset}`,
  info:     (t) => `${c.green}[i] ${t}${c.reset}`,
  dim:      (t) => `${c.dim}${t}${c.reset}`,
  label:    (t) => `${c.bold}${c.white}${t}${c.reset}`,
  value:    (t) => `${c.bGreen}${t}${c.reset}`,
  accent:   (t) => `${c.bRed}${t}${c.reset}`,
  virus:    (t) => `${c.bold}${c.bGreen}${t}${c.reset}`,
  danger:   (t) => `${c.bold}${c.bRed}${t}${c.reset}`,
  tag:      (label, color = c.bGreen) => `${c.bold}${color}[${label}]${c.reset}`,
};

// ── ASCII Art Banner — Skull & Virus Theme ───────────────────────────
const BANNER = `
${c.bRed}${c.bold}
    ██╗   ██╗███████╗███╗   ██╗ ██████╗ ███╗   ███╗       ██╗███████╗
    ██║   ██║██╔════╝████╗  ██║██╔═══██╗████╗ ████║       ██║██╔════╝
    ██║   ██║█████╗  ██╔██╗ ██║██║   ██║██╔████╔██║       ██║███████╗
    ╚██╗ ██╔╝██╔══╝  ██║╚██╗██║██║   ██║██║╚██╔╝██║  ██   ██║╚════██║
     ╚████╔╝ ███████╗██║ ╚████║╚██████╔╝██║ ╚═╝ ██║██╗╚█████╔╝███████║
      ╚═══╝  ╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝     ╚═╝╚═╝ ╚════╝ ╚══════╝${c.reset}

${c.bGreen}${c.bold}          ░▒▓█ EDUCATIONAL VIRUS SIMULATOR █▓▒░${c.reset}
${c.dim}${c.green}       System Reconnaissance · File Manipulation · Data Exfiltration${c.reset}
${c.dim}${c.red}   ⚠  For educational purposes only. No actual harm is caused.  ⚠${c.reset}
${c.dim}${c.green}  ─────────────────────────────────────────────────────────────────────${c.reset}
`;

// ── Skull ASCII (for infection sequence) ─────────────────────────────
const SKULL = `${c.bRed}
        ██████████████████
      ██${c.bWhite}░░░░░░░░░░░░░░░░░░${c.bRed}██
    ██${c.bWhite}░░░░░░░░░░░░░░░░░░░░░░${c.bRed}██
    ██${c.bWhite}░░░░${c.bRed}████${c.bWhite}░░░░${c.bRed}████${c.bWhite}░░░░${c.bRed}██
    ██${c.bWhite}░░░░${c.bRed}████${c.bWhite}░░░░${c.bRed}████${c.bWhite}░░░░${c.bRed}██
    ██${c.bWhite}░░░░░░░░${c.bRed}████${c.bWhite}░░░░░░░░${c.bRed}██
    ██${c.bWhite}░░${c.bRed}██${c.bWhite}░░░░░░░░░░░░${c.bRed}██${c.bWhite}░░${c.bRed}██
    ██${c.bWhite}░░░░${c.bRed}██████████${c.bWhite}░░░░${c.bRed}██
      ██${c.bWhite}░░░░░░░░░░░░░░░░░░${c.bRed}██
        ██████████████████${c.reset}`;

// ── Box Drawing ──────────────────────────────────────────────────────
/**
 * Draws a hacker-styled box around text content.
 * @param {string} title - Box title
 * @param {string[]} lines - Array of content lines
 * @param {string} color - ANSI color code for the border
 */
const drawBox = (title, lines, color = c.bGreen) => {
  const maxLen = Math.max(title.length, ...lines.map(l => stripAnsi(l).length));
  const width = maxLen + 4;
  const pad = (text) => {
    const visible = stripAnsi(text).length;
    return text + ' '.repeat(Math.max(0, width - visible - 2));
  };

  console.log(`${color}  ┌${'─'.repeat(width)}┐${c.reset}`);
  console.log(`${color}  │${c.reset} ${c.bold}${c.bGreen}${pad(title)}${c.reset}${color} │${c.reset}`);
  console.log(`${color}  ├${'─'.repeat(width)}┤${c.reset}`);
  for (const line of lines) {
    console.log(`${color}  │${c.reset} ${pad(line)} ${color}│${c.reset}`);
  }
  console.log(`${color}  └${'─'.repeat(width)}┘${c.reset}`);
};

// ── Progress Bar ─────────────────────────────────────────────────────
/**
 * Renders a "hacking" progress bar.
 * @param {number} percent - Value between 0 and 100
 * @param {number} width - Bar width in characters
 * @returns {string} Formatted progress bar string
 */
const progressBar = (percent, width = 30) => {
  const clamped = Math.max(0, Math.min(100, percent));
  const filled = Math.round((clamped / 100) * width);
  const empty = width - filled;

  let barColor = c.bGreen;
  if (clamped >= 85) barColor = c.bRed;
  else if (clamped >= 60) barColor = c.bYellow;

  const bar = `${barColor}${'█'.repeat(filled)}${c.dim}${'░'.repeat(empty)}${c.reset}`;
  return `${bar} ${c.bold}${barColor}${clamped.toFixed(1)}%${c.reset}`;
};

// ── Section Header ───────────────────────────────────────────────────
/**
 * Prints a hacker-themed section header.
 * @param {string} tag - Short tag label
 * @param {string} title - Section title
 */
const sectionHeader = (tag, title) => {
  console.log('');
  console.log(`  ${style.tag(tag, c.bRed)} ${c.bold}${c.bGreen}${title}${c.reset}`);
  console.log(`  ${c.dim}${c.green}${'─'.repeat(60)}${c.reset}`);
};

// ── Divider ──────────────────────────────────────────────────────────
const divider = () => {
  console.log(`\n  ${c.dim}${c.green}${'═'.repeat(70)}${c.reset}\n`);
};

// ── Strip ANSI (for length calculation) ──────────────────────────────
const stripAnsi = (str) => str.replace(/\x1b\[[0-9;]*m/g, '');

// ── Delay (for animations) ──────────────────────────────────────────
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ── Hacker Spinner Animation ────────────────────────────────────────
/**
 * Displays a hacker-style spinner with a message.
 * @param {string} message - Text to display next to the spinner
 * @param {number} durationMs - How long to spin
 */
const spinner = async (message, durationMs = 600) => {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  const start = Date.now();
  let i = 0;

  while (Date.now() - start < durationMs) {
    process.stdout.write(`\r  ${c.bGreen}${frames[i % frames.length]}${c.reset} ${c.green}${message}${c.reset}`);
    i++;
    await delay(80);
  }
  process.stdout.write(`\r  ${style.success(message)}\n`);
};

// ── Typewriter Effect ────────────────────────────────────────────────
/**
 * Types text character-by-character like a hacker terminal.
 * @param {string} text - Text to type out
 * @param {number} charDelay - Delay between characters in ms
 */
const typewriter = async (text, charDelay = 15) => {
  for (const char of text) {
    process.stdout.write(`${c.bGreen}${char}${c.reset}`);
    await delay(charDelay);
  }
  console.log('');
};

// ── Key-Value Pair Display ───────────────────────────────────────────
/**
 * Prints a formatted key-value pair with hacker styling.
 * @param {string} key - Label
 * @param {string} val - Value
 * @param {number} keyWidth - Fixed width for alignment
 */
const kvPair = (key, val, keyWidth = 22) => {
  const paddedKey = key.padEnd(keyWidth);
  console.log(`    ${c.green}${paddedKey}${c.reset} ${c.bGreen}${val}${c.reset}`);
};

export { c, style, BANNER, SKULL, drawBox, progressBar, sectionHeader, divider, stripAnsi, delay, spinner, typewriter, kvPair };
