import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const directory = await mkdtemp(join(tmpdir(), "grouped-table-consumer-"));
try {
  const archives = join(directory, "package");
  await mkdir(archives);
  const output = execFileSync(
    "npm",
    ["pack", "--ignore-scripts", "--json", "--pack-destination", archives],
    { encoding: "utf8" },
  );
  const result = JSON.parse(output);
  const filename = result[0]?.filename;
  if (typeof filename !== "string")
    throw new Error("npm pack did not return an archive");
  for (const version of ["19", "18"]) {
    const app = join(directory, `react-${version}`);
    await cp("tests/consumer", app, { recursive: true });
    const manifestPath = join(app, "package.json");
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    manifest.dependencies.react = version === "19" ? "19.2.0" : "18.3.1";
    manifest.dependencies["react-dom"] = manifest.dependencies.react;
    manifest.devDependencies["@types/react"] = `^${version}.0.0`;
    manifest.devDependencies["@types/react-dom"] = `^${version}.0.0`;
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    const run = (args) =>
      execFileSync("npm", args, { cwd: app, stdio: "inherit" });
    run(["install", "--no-audit", "--no-fund", join(archives, filename)]);
    run(["run", "build"]);
    run(["test"]);
  }
  console.log(
    "Independent packed consumer builds and SSR passed with React 19 and 18, including ESM and CommonJS type imports.",
  );
} finally {
  await rm(directory, { recursive: true, force: true });
}
