import Fuse from "fuse.js";
import { standardScoring, subjectiveTiers, pricingStrategy } from "./scoring";
import { schemeOutlines } from "./schemes";
import { historicalCases, historicalFileIndex } from "./cases";
import { reusableTemplates, digitalManagementIntro } from "./templates";

export interface KnowledgeChunk {
  type: "scoring" | "scheme" | "case" | "template" | "digital";
  title: string;
  content: string;
  score?: number;
}

// Flatten all knowledge into searchable chunks
function buildChunks(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];

  // Scoring items
  for (const item of standardScoring) {
    chunks.push({
      type: "scoring",
      title: item.name,
      score: item.maxScore,
      content: [
        `评分项：${item.name}`,
        `分值：${item.maxScore}分，${item.type}题`,
        `得分条件：${item.condition}`,
        `检查要点：${item.checkPoints.join("；")}`,
      ].join("\n"),
    });
  }
  chunks.push({
    type: "scoring",
    title: "主观分评审档次",
    content: [
      `${subjectiveTiers.excellent.label}：${subjectiveTiers.excellent.criteria}`,
      `${subjectiveTiers.passable.label}：${subjectiveTiers.passable.criteria}`,
      `${subjectiveTiers.poor.label}：${subjectiveTiers.poor.criteria}`,
      `${subjectiveTiers.none.label}：${subjectiveTiers.none.criteria}`,
    ].join("\n"),
  });
  chunks.push({
    type: "scoring",
    title: "价格分策略（30分）",
    content: `安全报价区间：${pricingStrategy.safeRange}。${pricingStrategy.riskWarning}。常用方法：${pricingStrategy.methods.join("、")}`,
  });

  // Schemes
  for (const s of schemeOutlines) {
    chunks.push({
      type: "scheme",
      title: s.name,
      score: s.score,
      content: [
        `方案：${s.name}（${s.score}分）`,
        `章节结构：${s.sections.join(" → ")}`,
        `关键点：${s.keyPoints.join("；")}`,
        `常见扣分：${s.pitfalls.join("；")}`,
      ].join("\n"),
    });
  }

  // Historical cases
  for (const c of historicalCases) {
    const scoreMappings = c.scoreMapping
      .map((m) => `  ${m.scoreItem} → ${m.source} [${m.reuseLevel}] ${m.note}`)
      .join("\n");
    chunks.push({
      type: "case",
      title: c.projectName,
      content: [
        `项目：${c.projectName}`,
        `日期：${c.date}，预算：${c.budget}，电梯：${c.elevatorCount}`,
        `投标方：${c.bidder}`,
        `关键信息：${c.keyContent.join("；")}`,
        `材料复用映射：\n${scoreMappings}`,
      ].join("\n"),
    });
  }

  // File index
  for (const [name, info] of Object.entries(historicalFileIndex.files)) {
    chunks.push({
      type: "case",
      title: `历史文件：${name}`,
      content: `历史投标文件「${name}」，${info.chars}字，包含：${info.keySections.join("、")}。${info.note}`,
    });
  }

  // Templates
  for (const t of reusableTemplates) {
    chunks.push({
      type: "template",
      title: t.name,
      score: t.score,
      content: `模板：${t.name}（${t.scoreItem}，${t.score}分）。用途：${t.usage}。正文：${t.content}`,
    });
  }

  // Digital management intros
  chunks.push({
    type: "digital",
    title: "OES在线电梯服务系统",
    content: digitalManagementIntro.oes,
  });
  chunks.push({
    type: "digital",
    title: "DOCTOR OTIS远程诊断系统",
    content: digitalManagementIntro.doctorOtis,
  });
  chunks.push({
    type: "digital",
    title: "SERVICE TOOL智能维保工具",
    content: digitalManagementIntro.serviceTool,
  });
  chunks.push({
    type: "digital",
    title: "OTIS CONNECT物联网平台",
    content: digitalManagementIntro.otisConnect,
  });

  return chunks;
}

const chunks = buildChunks();
const fuse = new Fuse(chunks, {
  keys: [
    { name: "title", weight: 3 },
    { name: "content", weight: 1 },
    { name: "type", weight: 0.5 },
  ],
  threshold: 0.5,
  includeScore: true,
  minMatchCharLength: 2,
});

export function searchBidKnowledge(query: string, limit = 3): KnowledgeChunk[] {
  if (!query.trim()) return [];
  return fuse.search(query).slice(0, limit).map((r) => r.item);
}

export function formatSearchResults(results: KnowledgeChunk[]): string {
  if (results.length === 0) return "";
  const blocks = results.map(
    (r, i) => `【参考知识 ${i + 1}】[${r.type}] ${r.title}${r.score != null ? ` (${r.score}分)` : ""}\n${r.content}`
  );
  return blocks.join("\n\n---\n\n");
}
