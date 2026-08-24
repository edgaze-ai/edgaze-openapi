#!/usr/bin/env node
/**
 * Pull the live production OpenAPI document and refresh openapi.json / openapi.yaml.
 * README and LICENSE are left alone.
 */
import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const yaml = require("js-yaml");

const SPEC_URL = process.env.OPENAPI_SOURCE_URL || "https://www.edgaze.ai/openapi.json";
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function toYaml(doc) {
  const dumped = yaml.dump(doc, {
    noRefs: true,
    lineWidth: 120,
    quotingType: '"',
    forceQuotes: false,
  });
  return dumped.endsWith("\n") ? dumped : `${dumped}\n`;
}

async function main() {
  const res = await fetch(SPEC_URL, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${SPEC_URL}: HTTP ${res.status}`);
  }
  const jsonText = await res.text();
  const doc = JSON.parse(jsonText);
  if (doc?.openapi !== "3.1.0") {
    throw new Error("Production document must declare openapi: 3.1.0.");
  }
  if (typeof doc?.info?.version !== "string" || !/^\d+\.\d+\.\d+$/.test(doc.info.version)) {
    throw new Error("Production document is missing a semver info.version.");
  }

  const nextJson = jsonText.endsWith("\n") ? jsonText : `${jsonText}\n`;
  const nextYaml = toYaml(doc);
  const jsonPath = path.join(root, "openapi.json");
  const yamlPath = path.join(root, "openapi.yaml");
  const prevJson = readFileSync(jsonPath, "utf8");
  const prevYaml = readFileSync(yamlPath, "utf8");

  writeFileSync(jsonPath, nextJson, "utf8");
  writeFileSync(yamlPath, nextYaml, "utf8");

  const changed = [];
  if (nextJson !== prevJson) changed.push("openapi.json");
  if (nextYaml !== prevYaml) changed.push("openapi.yaml");
  if (changed.length === 0) {
    process.stdout.write("sync-from-production: already up to date.\n");
    return;
  }
  process.stdout.write(`sync-from-production: updated ${changed.join(", ")}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
