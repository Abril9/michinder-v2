import { spawn } from "node:child_process";
import { existsSync } from "node:fs";

const isWindows = process.platform === "win32";
const npx = isWindows ? "npx.cmd" : "npx";
const npm = isWindows ? "npm.cmd" : "npm";
const reset = process.argv.includes("--reset");
const setupOnly = process.argv.includes("--no-dev");

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: isWindows,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`"${command} ${args.join(" ")}" terminó con código ${code}.`));
    });
  });
}

async function main() {
  if (!existsSync(".env.local")) {
    console.error("Falta .env.local. Copiá .env.example y completá las credenciales de Supabase.");
    process.exit(1);
  }

  console.log("→ Iniciando Supabase local...");
  await run(npx, ["supabase", "start"]);

  if (reset) {
    console.log("→ Reiniciando base y aplicando migraciones...");
    await run(npx, ["supabase", "db", "reset"]);
  }

  console.log("→ Cargando datos demo...");
  await run(npm, ["run", "seed"]);

  if (setupOnly) {
    console.log("→ Base y datos listos (sin iniciar Next).");
    return;
  }

  console.log("→ Iniciando Michinder en http://localhost:3000\n");
  const dev = spawn(npm, ["run", "dev"], {
    stdio: "inherit",
    shell: isWindows,
  });

  const stop = (signal) => dev.kill(signal);
  process.on("SIGINT", () => stop("SIGINT"));
  process.on("SIGTERM", () => stop("SIGTERM"));
  dev.on("exit", (code) => process.exit(code ?? 0));
}

main().catch((error) => {
  console.error(`\nNo pudimos iniciar Michinder: ${error.message}`);
  process.exit(1);
});
