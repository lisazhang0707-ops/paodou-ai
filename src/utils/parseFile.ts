import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

export interface ParseResult {
  text: string;
  fileName: string;
  fileType: string;
}

export async function parseFile(file: File): Promise<ParseResult> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (ext === "pdf") {
    const text = await parsePdf(file);
    return { text, fileName: file.name, fileType: "pdf" };
  }
  if (ext === "docx") {
    const text = await parseDocx(file);
    return { text, fileName: file.name, fileType: "docx" };
  }
  if (ext === "doc" || ext === "txt" || ext === "md") {
    const text = await parseText(file);
    return { text, fileName: file.name, fileType: ext };
  }
  throw new Error(`不支持的文件格式: .${ext}，请上传 .pdf / .docx / .txt 文件`);
}

async function parsePdf(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    pages.push(text);
  }
  return pages.join("\n\n");
}

async function parseDocx(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value;
}

function parseText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("文件读取失败"));
    reader.readAsText(file, "UTF-8");
  });
}
