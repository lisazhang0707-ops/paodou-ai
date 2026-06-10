/**
 * 本地文档存储（localStorage）
 * 上传解析后的招标文件内容保存在浏览器中，做标书时可引用
 */

export interface StoredDoc {
  id: string;
  fileName: string;
  content: string;
  charCount: number;
  parsedAt: string; // ISO string
}

const STORAGE_KEY = "bid_docs_store";

export function loadDocs(): StoredDoc[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredDoc[];
  } catch {
    return [];
  }
}

export function saveDoc(fileName: string, content: string): StoredDoc {
  const docs = loadDocs();
  // remove duplicate by filename
  const filtered = docs.filter((d) => d.fileName !== fileName);
  const doc: StoredDoc = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    fileName,
    content,
    charCount: content.length,
    parsedAt: new Date().toISOString(),
  };
  filtered.unshift(doc);
  // keep max 10 docs
  if (filtered.length > 10) filtered.length = 10;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return doc;
}

export function deleteDoc(id: string): void {
  const docs = loadDocs().filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

export function getDoc(id: string): StoredDoc | undefined {
  return loadDocs().find((d) => d.id === id);
}
