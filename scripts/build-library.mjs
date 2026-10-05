import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import { rollup } from "rollup";
import { dts } from "rollup-plugin-dts";

const bundle = await rollup({
  input: "dist/types/index.d.ts",
  plugins: [dts()],
});
try {
  await bundle.write({ file: "dist/lib/index.d.ts", format: "es" });
  await bundle.write({ file: "dist/lib/index.d.cts", format: "es" });
} finally {
  await bundle.close();
}
await mkdir("dist/lib", { recursive: true });
await copyFile("src/grouped-table.css", "dist/lib/styles.css");
await writeFile("dist/lib/styles.d.ts", "export {};\n");
await rm("dist/types", { recursive: true, force: true });
