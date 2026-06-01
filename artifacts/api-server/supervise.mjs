import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const entry = path.resolve(dir, "dist/index.mjs");

const MAX_RESTARTS = 5;
const RESTART_WINDOW_MS = 30_000;
const SHUTDOWN_GRACE_MS = 5_000;

let child = null;
let shuttingDown = false;
let restartTimes = [];

function killChild(signal) {
  if (!child) return;
  try {
    process.kill(-child.pid, signal);
  } catch {
    try {
      child.kill(signal);
    } catch {
      /* child already gone */
    }
  }
}

function start() {
  child = spawn(process.execPath, ["--enable-source-maps", entry], {
    stdio: "inherit",
    env: process.env,
    detached: true,
  });

  child.on("exit", (code, signal) => {
    child = null;

    if (shuttingDown) {
      process.exit(0);
      return;
    }

    const now = Date.now();
    restartTimes = restartTimes.filter((t) => now - t < RESTART_WINDOW_MS);
    restartTimes.push(now);

    if (restartTimes.length > MAX_RESTARTS) {
      console.error(
        `[supervisor] api-server crashed ${restartTimes.length} times within ${
          RESTART_WINDOW_MS / 1000
        }s (last exit code=${code}, signal=${signal}); giving up.`,
      );
      process.exit(1);
      return;
    }

    console.error(
      `[supervisor] api-server exited (code=${code}, signal=${signal}); restarting in 1s [${restartTimes.length}/${MAX_RESTARTS}]...`,
    );
    setTimeout(start, 1000);
  });
}

function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;

  if (!child) {
    process.exit(0);
    return;
  }

  killChild("SIGTERM");

  setTimeout(() => {
    killChild("SIGKILL");
    process.exit(0);
  }, SHUTDOWN_GRACE_MS).unref();
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

start();
