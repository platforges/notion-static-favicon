// Packs dist/ into release/notion-static-favicon-<version>.zip (manifest at the zip root).
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const pkg = JSON.parse(await readFile(`${root}package.json`, "utf8"));

if (!existsSync(`${root}dist/manifest.json`)) {
  console.error("dist/manifest.json not found. Run `npm run build` first.");
  process.exit(1);
}

const out = `${root}release/${pkg.name}-${pkg.version}.zip`;
await mkdir(`${root}release`, { recursive: true });
await rm(out, { force: true });
execFileSync("zip", ["-r", "-X", out, "."], {
  cwd: `${root}dist`,
  stdio: "inherit",
});
console.log(`Created ${out}`);
