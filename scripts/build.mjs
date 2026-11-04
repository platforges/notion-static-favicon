// Builds the extension into dist/: bundles src/content.ts, copies public/,
// and writes dist/manifest.json with the version taken from package.json.
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import * as esbuild from "esbuild";

const watch = process.argv.includes("--watch");
const root = new URL("../", import.meta.url);
const dist = new URL("dist/", root);

const readJson = async (path) =>
  JSON.parse(await readFile(new URL(path, root), "utf8"));

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const pkg = await readJson("package.json");
const manifest = await readJson("src/manifest.json");
await writeFile(
  new URL("manifest.json", dist),
  `${JSON.stringify({ ...manifest, version: pkg.version }, null, 2)}\n`,
);
await cp(new URL("public/", root), dist, { recursive: true });

/** @type {esbuild.BuildOptions} */
const options = {
  entryPoints: [new URL("src/content.ts", root).pathname],
  outfile: new URL("content.js", dist).pathname,
  bundle: true,
  format: "iife", // content scripts are classic scripts, not ES modules
  target: "chrome120",
  // Unminified on purpose: easier Chrome Web Store review and debugging.
  minify: false,
  logLevel: "info",
};

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
} else {
  await esbuild.build(options);
}
