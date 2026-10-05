import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import * as esm from "@aaarnv/sexy-table";
const cjs = createRequire(import.meta.url)("@aaarnv/sexy-table");
for (const library of [esm, cjs]) {
  const html = renderToString(
    createElement(library.SexyTable, {
      groups: [
        {
          id: "consumer",
          label: "Consumer group",
          issues: [{ id: "one", title: "Installed and server rendered" }],
        },
      ],
    }),
  );
  assert.match(html, /Installed and server rendered/);
  assert.match(html, /Consumer group/);
}
console.log("Installed ESM and CommonJS server rendering passed.");
