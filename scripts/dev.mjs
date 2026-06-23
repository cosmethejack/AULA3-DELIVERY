// Sobe backend e frontend juntos a partir da raiz (npm run dev).
// Sem dependências externas — usa apenas child_process.
import { spawn } from "node:child_process";

const apps = [
  { name: "backend", cwd: "apps/backend" },
  { name: "frontend", cwd: "apps/frontend" },
];

const procs = apps.map(({ name, cwd }) => {
  const p = spawn("npm", ["run", "dev"], { cwd, stdio: "inherit", shell: true });
  p.on("exit", (code) => {
    console.log(`[${name}] encerrou (código ${code}). Finalizando os demais...`);
    shutdown();
  });
  return p;
});

let shuttingDown = false;
function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const p of procs) {
    if (!p.killed) p.kill();
  }
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
