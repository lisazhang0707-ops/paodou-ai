import type { Contract, ContractMeta } from "./types";

// All .md files under contracts/ — vite resolves / from project root
const rawModules = import.meta.glob("/contracts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parseMeta(raw: string): { meta: Record<string, unknown>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const yaml = match[1];
  const body = match[2];
  const meta: Record<string, unknown> = {};

  for (const line of yaml.split("\n")) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (!kv) continue;
    const [, key, val] = kv;
    const trimmed = val.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      meta[key] = trimmed
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (trimmed === "true") {
      meta[key] = true;
    } else if (trimmed === "false") {
      meta[key] = false;
    } else if (/^\d+(\.\d+)?$/.test(trimmed)) {
      meta[key] = Number(trimmed);
    } else {
      meta[key] = trimmed;
    }
  }

  return { meta, body };
}

function asMeta(raw: Record<string, unknown>): ContractMeta {
  return {
    projectName: String(raw.projectName ?? ""),
    date: String(raw.date ?? ""),
    budget: Number(raw.budget ?? 0),
    elevatorCount: Number(raw.elevatorCount ?? 0),
    elevatorTypes: Array.isArray(raw.elevatorTypes)
      ? raw.elevatorTypes.map(String)
      : [],
    bidder: String(raw.bidder ?? ""),
    projectType: String(raw.projectType ?? ""),
    bidMethod: String(raw.bidMethod ?? "综合评分法"),
    region: String(raw.region ?? ""),
    won: Boolean(raw.won),
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
  };
}

function extractFileName(path: string): string {
  const segments = path.split("/");
  const last = segments[segments.length - 1];
  return last.replace(/\.md$/, "");
}

let _contracts: Contract[] | null = null;

export function loadContracts(): Contract[] {
  if (_contracts) return _contracts;

  _contracts = Object.entries(rawModules).map(([path, raw]) => {
    const { meta, body } = parseMeta(raw);
    return {
      fileName: extractFileName(path),
      meta: asMeta(meta),
      body,
    };
  });

  // Sort by date descending (newest first)
  _contracts.sort((a, b) => b.meta.date.localeCompare(a.meta.date));

  return _contracts;
}

/** Force reload on next call — useful when source files change during dev */
export function invalidateCache(): void {
  _contracts = null;
}
