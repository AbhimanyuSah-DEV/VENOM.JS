import os from 'node:os';

// ═══════════════════════════════════════════════════════════════════════
//  VENOM.JS — Target Reconnaissance Module
//  Gathers comprehensive host machine intel using ONLY built-in
//  Node.js modules (os, process). Simulates what real malware collects.
//  ⚠ EDUCATIONAL ONLY — no harmful actions are performed.
// ═══════════════════════════════════════════════════════════════════════

/**
 * Formats bytes into a human-readable string (e.g., "7.84 GB").
 * @param {number} bytes - Raw byte count.
 * @returns {string} Formatted string with appropriate unit.
 */
const formatBytes = (bytes) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let value = bytes;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(2)} ${units[i]}`;
};

/**
 * Converts seconds into a human-readable uptime string.
 * @param {number} seconds - Raw uptime in seconds.
 * @returns {string} Formatted string (e.g., "2d 5h 32m 10s").
 */
const formatUptime = (seconds) => {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);

  return parts.join(' ');
};

/**
 * Extracts primary network interface IPs (IPv4, non-internal only).
 * Simulates network reconnaissance — identifies reachable interfaces.
 * @returns {Object[]} Array of { interface, address, mac } objects.
 */
const getNetworkInfo = () => {
  const interfaces = os.networkInterfaces();
  const results = [];

  for (const [name, addrs] of Object.entries(interfaces)) {
    for (const addr of addrs) {
      if (addr.family === 'IPv4' && !addr.internal) {
        results.push({
          interface: name,
          address: addr.address,
          mac: addr.mac,
        });
      }
    }
  }

  return results.length > 0 ? results : [{ interface: 'N/A', address: 'Not Available', mac: 'N/A' }];
};

/**
 * PHASE 1: TARGET RECONNAISSANCE
 *
 * Gathers comprehensive host machine telemetry safely.
 * This simulates what real malware does in its first stage:
 * fingerprinting the target to determine the attack surface.
 *
 * CRITICAL: Environment variables use logical OR (||) fallbacks.
 * If a variable is undefined or access is restricted, it returns
 * "Not Available" — the application will NEVER crash due to
 * missing environment variables.
 *
 * @returns {Object} Structured JSON object with all recon data.
 */
const getSystemTelemetry = () => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memUsagePercent = (usedMem / totalMem) * 100;

  const cpus = os.cpus();
  const uptimeSeconds = os.uptime();

  return {
    // ── Target Fingerprint ───────────────────────────────────────
    system: {
      osType:          os.type(),
      osPlatform:      os.platform(),
      osRelease:       os.release(),
      cpuArchitecture: os.arch(),
      hostname:        os.hostname(),
      nodeVersion:     process.version,
      userHomeDir:     os.homedir(),
      uptime:          formatUptime(uptimeSeconds),
      uptimeRaw:       uptimeSeconds,
    },

    // ── CPU Intel ────────────────────────────────────────────────
    cpu: {
      model:     cpus.length > 0 ? cpus[0].model.trim() : 'Not Available',
      cores:     cpus.length,
      speed:     cpus.length > 0 ? `${cpus[0].speed} MHz` : 'Not Available',
    },

    // ── Memory Mapping ──────────────────────────────────────────
    memory: {
      total:        formatBytes(totalMem),
      free:         formatBytes(freeMem),
      used:         formatBytes(usedMem),
      usagePercent: memUsagePercent,
    },

    // ── Network Recon ───────────────────────────────────────────
    network: getNetworkInfo(),

    // ── Environment Harvesting (with safe fallbacks) ─────────────
    environment: {
      PATH:     process.env.PATH     || 'Not Available',
      USER:     process.env.USER     || process.env.USERNAME || 'Not Available',
      SHELL:    process.env.SHELL    || process.env.ComSpec  || 'Not Available',
      LANG:     process.env.LANG     || 'Not Available',
      HOME:     process.env.HOME     || process.env.USERPROFILE || 'Not Available',
      TERM:     process.env.TERM     || 'Not Available',
      NODE_ENV: process.env.NODE_ENV || 'Not Available',
    },
  };
};

export { getSystemTelemetry, formatBytes, formatUptime };
