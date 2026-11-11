import { canonicalRichText } from "@/lib/rich-text";

/**
 * Seed exercise prompts: Apex types bold, variable names italic, values
 * underlined, and a break between separate instructions.
 */

const TYPES = ["Integer", "String", "Boolean", "Decimal", "Date"] as const;

const INSTRUCTION_BOUNDARY =
  /\.\s+(?=(?:On the next line,|Then declare|Declare |Na linha seguinte,|Depois declare))/g;

type MarkKind = "bold" | "italic" | "underline";

type Range = {
  start: number;
  end: number;
  kind: MarkKind;
};

type Mark = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
};

export function styleExercisePrompt(plain: string) {
  const trimmed = plain.trim();
  if (!trimmed) return "";
  if (/^<(?:p|ul)\b/i.test(trimmed)) return canonicalRichText(trimmed);

  const names = variableNames(trimmed);
  const parts = splitInstructions(trimmed).map((part) =>
    renderMarked(part, rangesFor(part, names)),
  );
  return canonicalRichText(`<p>${parts.join("<br>")}</p>`);
}

function splitInstructions(text: string) {
  const parts: string[] = [];
  let last = 0;
  for (const match of text.matchAll(INSTRUCTION_BOUNDARY)) {
    const index = match.index ?? 0;
    parts.push(text.slice(last, index) + ".");
    last = index + match[0].length;
  }
  parts.push(text.slice(last));
  return parts.filter((part) => part.length > 0);
}

function variableNames(text: string) {
  const names = new Set<string>();
  for (const match of text.matchAll(
    /\b(?:named|chamado|chamada) ([A-Za-z_]\w*)/g,
  )) {
    names.add(match[1]);
  }
  return [...names].sort((left, right) => right.length - left.length);
}

function rangesFor(text: string, names: string[]) {
  const ranges: Range[] = [];
  for (const typeName of TYPES) {
    for (const match of text.matchAll(new RegExp(`\\b${typeName}\\b`, "g"))) {
      ranges.push({
        start: match.index ?? 0,
        end: (match.index ?? 0) + typeName.length,
        kind: "bold",
      });
    }
  }
  for (const name of names) {
    for (const match of text.matchAll(new RegExp(`\\b${name}\\b`, "g"))) {
      const start = match.index ?? 0;
      if (isInstructionWord(text, start, name)) continue;
      ranges.push({ start, end: start + name.length, kind: "italic" });
    }
  }
  addStoreValues(text, names, ranges);
  addJoiningValues(text, ranges);
  return ranges;
}

function isInstructionWord(text: string, index: number, name: string) {
  const before = text.slice(Math.max(0, index - 5), index);
  if (name === "line" && before.endsWith("next ")) return true;
  if (name === "code" && before.endsWith("this ")) return true;
  return false;
}

function addStoreValues(text: string, names: string[], ranges: Range[]) {
  for (const match of text.matchAll(/\b(?:store|guarde) /g)) {
    const start = (match.index ?? 0) + match[0].length;
    let end = text.length;
    const join = /,?\s*(?:by joining|juntando)\b/.exec(text.slice(start));
    if (join) end = start + join.index;
    let slice = text.slice(start, end);
    const period = /\.\s*$/.exec(slice);
    if (period) {
      end -= period[0].length;
      slice = text.slice(start, end);
    }
    const inName = / (?:in|em) ([A-Za-z_]\w*)$/.exec(slice);
    if (inName && names.includes(inName[1])) {
      end -= inName[0].length;
      slice = text.slice(start, end);
    }
    addValuePhrase(start, slice, ranges);
  }
}

function addValuePhrase(start: number, phrase: string, ranges: Range[]) {
  const contrasted = [
    /^(?:the text|o texto) (\d+)$/,
    /^(?:the number|o número) (\d+), (?:not the text|não o texto) (\d+)$/,
    /^(true|false), (?:not the text|não o texto) (true|false)$/,
  ];
  for (const pattern of contrasted) {
    const match = pattern.exec(phrase);
    if (!match) continue;
    let from = 0;
    for (const piece of match.slice(1)) {
      const index = phrase.indexOf(piece, from);
      ranges.push({
        start: start + index,
        end: start + index + piece.length,
        kind: "underline",
      });
      from = index + piece.length;
    }
    return;
  }
  if (phrase === "the text for that day" || phrase === "o texto desse dia") return;
  if (phrase.length > 0) {
    ranges.push({ start, end: start + phrase.length, kind: "underline" });
  }
}

function addJoiningValues(text: string, ranges: Range[]) {
  const join = /(?:by joining|juntando)\b/.exec(text);
  if (!join || join.index === undefined) return;
  const clause = text.slice(join.index);
  const base = join.index;

  for (const match of clause.matchAll(
    /(?:the text|o texto) ([^,]+?)(?=,|\s+and\b|\s+e\b|\s*$)/g,
  )) {
    const lead = match[0].startsWith("the text")
      ? "the text ".length
      : "o texto ".length;
    let literal = match[1];
    if (literal.endsWith(".")) literal = literal.slice(0, -1);
    if (!literal || /^(?:for|desse)\b/.test(literal)) continue;
    const start = base + (match.index ?? 0) + lead;
    let end = start + literal.length;
    if (literal.endsWith(":") && text[end] === " ") end += 1;
    ranges.push({ start, end, kind: "underline" });
  }

  for (const match of clause.matchAll(/(?:by joining|juntando) ([A-Za-z]+:)/g)) {
    const literal = match[1];
    const start = base + (match.index ?? 0) + match[0].length - literal.length;
    ranges.push({ start, end: start + literal.length, kind: "underline" });
  }

  for (const match of clause.matchAll(/\b(?:a space|um espaço)\b/g)) {
    const start = base + (match.index ?? 0);
    ranges.push({ start, end: start + match[0].length, kind: "underline" });
  }
}

function renderMarked(text: string, ranges: Range[]) {
  const marks = Array.from({ length: text.length }, () => ({
    bold: false,
    italic: false,
    underline: false,
  }));
  for (const range of ranges) {
    for (let index = range.start; index < range.end; index += 1) {
      const mark = marks[index];
      if (!mark) continue;
      if (range.kind === "bold") mark.bold = true;
      if (range.kind === "italic") mark.italic = true;
      if (range.kind === "underline") mark.underline = true;
    }
  }
  for (const mark of marks) {
    if (mark.italic) {
      mark.bold = false;
      mark.underline = false;
    } else if (mark.bold) {
      mark.underline = false;
    }
  }

  let html = "";
  let index = 0;
  while (index < text.length) {
    const mark = marks[index] ?? { bold: false, italic: false, underline: false };
    let end = index + 1;
    while (end < text.length && sameMark(marks[end], mark)) end += 1;
    html += wrap(escapeText(text.slice(index, end)), mark);
    index = end;
  }
  return html;
}

function sameMark(left: Mark | undefined, right: Mark) {
  if (!left) return false;
  return (
    left.bold === right.bold &&
    left.italic === right.italic &&
    left.underline === right.underline
  );
}

function wrap(text: string, mark: Mark) {
  let out = text;
  if (mark.underline) out = `<u>${out}</u>`;
  if (mark.italic) out = `<em>${out}</em>`;
  if (mark.bold) out = `<strong>${out}</strong>`;
  return out;
}

function escapeText(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
