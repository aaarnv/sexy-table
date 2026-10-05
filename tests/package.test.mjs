import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile, readdir } from "node:fs/promises";
import { test } from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import * as esm from "../dist/lib/index.js";

const require = createRequire(import.meta.url);
const cjs = require("../dist/lib/index.cjs");

test("ESM and CommonJS expose the same components", () => {
  const names = ["SexyTable", "SexyTableStatusIcon", "SlidingTabs"];
  assert.deepEqual(Object.keys(esm).sort(), names.sort());
  assert.deepEqual(Object.keys(cjs).sort(), names.sort());
});

for (const [format, library] of Object.entries({ esm, cjs })) {
  test(`${format} renders caller data on the server without browser globals`, () => {
    const groups = [
      {
        id: "a-custom-id",
        label: "Customer requests",
        icon: createElement(library.SexyTableStatusIcon, { status: "todo" }),
        issues: [
          { id: "request-1", title: "A minimal issue" },
          {
            id: "request-2",
            title: "All fields",
            priority: "urgent",
            estimate: 0,
            label: { name: "Custom label", color: "#c0ffee" },
            pullRequest: { label: "PR-42", state: "merged" },
            due: "Tomorrow",
            assignees: [{ id: "caller-user", name: "Ada Lovelace" }],
          },
        ],
      },
    ];
    const html = renderToString(
      createElement(library.SexyTable, { groups, theme: "dark" }),
    );
    assert.match(html, /Customer requests/);
    assert.match(html, /A minimal issue/);
    assert.match(html, /PR-42/);
    assert.match(html, /0 points/);
    assert.match(html, /AL/);
    assert.doesNotMatch(html, /\/assets\/|abc-diatype|undefined priority/);
    assert.match(
      renderToString(
        createElement(library.SlidingTabs, {
          items: [],
          value: "",
          onValueChange() {},
        }),
      ),
      /role="group"/,
    );
    assert.match(
      renderToString(createElement(library.SexyTable, { groups: [] })),
      /data-slot="grouped-table"/,
    );
  });
}

test("distribution contains only library code, declarations, and scoped CSS", async () => {
  assert.deepEqual(
    (await readdir(new URL("../dist/lib/", import.meta.url))).sort(),
    [
      "index.cjs",
      "index.d.cts",
      "index.d.ts",
      "index.js",
      "styles.css",
      "styles.d.ts",
    ],
  );
  const css = await readFile(
    new URL("../dist/lib/styles.css", import.meta.url),
    "utf8",
  );
  const js = await readFile(
    new URL("../dist/lib/index.js", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(
    css,
    /@font-face|url\(|(^|\n)(?:body|html|button|\*)\s*\{/,
  );
  assert.doesNotMatch(js, /\/assets\/|ABC Diatype|Cache map tiles/);
  assert.match(js, /^"use client";/);
});
