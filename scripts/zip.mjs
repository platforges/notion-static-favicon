// Packs dist/extension/ into dist/notion-static-favicon-<version>.zip (manifest at the zip root).
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const pkg = JSON.parse(await readFile(`${root}package.json`, "utf8"));

if (!existsSync(`${root}dist/extension/manifest.json`)) {
  console.error(
    "dist/extension/manifest.json not found. Run `npm run build` first.",
  );
  process.exit(1);
}

const out = `${root}dist/${pkg.name}-${pkg.version}.zip`;
await rm(out, { force: true });
execFileSync("zip", ["-r", "-X", out, "."], {
  cwd: `${root}dist/extension`,
  stdio: "inherit",
});
console.log(`Created ${out}`);
