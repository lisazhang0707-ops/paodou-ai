import type { Contract, MatchQuery } from "./types";
import { loadContracts } from "./loader";

/**
 * Score a contract's relevance to the current bid query.
 * Higher score = better match.  Max ~100 (not strict, relative ordering is what matters).
 */
function scoreContract(c: Contract, q: MatchQuery): number {
  let score = 0;

  // --- project type (weight: 30) ---
  if (c.meta.projectType === q.projectType) {
    score += 30;
  }

  // --- elevator count similarity (weight: 20) ---
  // closer counts = higher score, fall-off outside ±50%
  if (q.elevatorCount > 0) {
    const ratio =
      Math.min(c.meta.elevatorCount, q.elevatorCount) /
      Math.max(c.meta.elevatorCount, q.elevatorCount);
    score += Math.round(20 * ratio);
  }

  // --- budget similarity (weight: 15) ---
  if (q.budget > 0 && c.meta.budget > 0) {
    const ratio =
      Math.min(c.meta.budget, q.budget) /
      Math.max(c.meta.budget, q.budget);
    score += Math.round(15 * ratio);
  }

  // --- elevator type overlap (weight: 15) ---
  if (q.elevatorTypes.length > 0 && c.meta.elevatorTypes.length > 0) {
    const overlap = q.elevatorTypes.filter((t) =>
      c.meta.elevatorTypes.includes(t)
    ).length;
    score += Math.round(15 * (overlap / q.elevatorTypes.length));
  }

  // --- region match (weight: 10) ---
  if (q.region && c.meta.region === q.region) {
    score += 10;
  }

  // --- tag overlap (weight: 10) ---
  if (q.tags.length > 0 && c.meta.tags.length > 0) {
    const overlap = q.tags.filter((t) => c.meta.tags.includes(t)).length;
    score += Math.round(10 * (overlap / Math.max(q.tags.length, 1)));
  }

  return score;
}

export function matchContracts(query: MatchQuery, topN = 4): Contract[] {
  const all = loadContracts();

  const scored = all.map((c) => ({
    ...c,
    matchScore: scoreContract(c, query),
  }));

  scored.sort((a, b) => b.matchScore! - a.matchScore!);

  return scored.filter((c) => c.matchScore! > 0).slice(0, topN);
}

/** Format matched contracts as context string for injection into LLM prompt */
export function formatContractContext(contracts: Contract[]): string {
  if (contracts.length === 0) return "";

  return contracts
    .map(
      (c, i) =>
        `【历史合同 ${i + 1}】${c.meta.projectName} | ${c.meta.date} | ` +
        `${c.meta.elevatorCount}台 | ${c.meta.budget / 10000}万 | ` +
        `${c.meta.projectType} | ${c.meta.bidMethod} | ` +
        `中标: ${c.meta.won ? "是" : "否"} | 匹配度: ${c.matchScore}\n\n${c.body}`
    )
    .join("\n\n---\n\n");
}
