export type RichMark = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
};

export type RichInline =
  | { kind: "text"; text: string; mark: RichMark }
  | { kind: "break" }
  | { kind: "image"; src: string };

export type RichBlock =
  | { kind: "p"; inlines: RichInline[] }
  | { kind: "list"; items: RichInline[][] };

export const EMPTY_RICH_MARK: RichMark = {
  bold: false,
  italic: false,
  underline: false,
};

const CANONICAL_TAGS = new Set(["p", "ul", "li", "br", "strong", "em", "u", "img"]);

const MAX_DATA_URL_LENGTH = 8_000_000;

type TagToken = {
  raw: string;
  name: string;
  closing: boolean;
  attrs: string;
};

/** Stored rich text always starts with a tag the serializer writes. Anything else is plain text. */
function isStoredRichHtml(value: string) {
  return /^<(?:p|ul)\b/i.test(value);
}

export function safeImageSrc(src: string) {
  const trimmed = src.trim().replace(/\s+/g, "");
  if (
    /^data:image\/(?:png|jpeg|jpg|gif|webp|bmp);base64,[a-z0-9+/=]+$/i.test(
      trimmed,
    ) &&
    trimmed.length <= MAX_DATA_URL_LENGTH
  ) {
    return trimmed;
  }
  try {
    const url = new URL(trimmed);
    if (url.protocol === "https:" || url.protocol === "http:") return url.href;
  } catch {
    return null;
  }
  return null;
}

export function imageHtml(src: string) {
  const safe = safeImageSrc(src);
  if (!safe) return null;
  return `<img src="${escapeAttr(safe)}" alt="">`;
}

export function richBlocks(value: string): RichBlock[] {
  const trimmed = value.trim();
  if (!trimmed) return [];
  if (isStoredRichHtml(trimmed)) return parseCanonical(trimmed);
  return normalizeBlocks(plainToBlocks(trimmed));
}

export function richTextIsBlank(value: string) {
  return richBlocks(value).every((block) => !blockHasContent(block));
}

/** Words a card list can show. Formatting and pictures are left out. */
export function richPlainParagraphs(value: string) {
  return richBlocks(value)
    .flatMap((block) =>
      block.kind === "list"
        ? block.items.map((item) => plainWords(item))
        : [plainWords(block.inlines)],
    )
    .filter((paragraph) => paragraph.length > 0);
}

/** Canonical rich HTML, or the original plain text when it is not stored rich HTML. */
export function canonicalRichText(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (!isStoredRichHtml(trimmed)) return trimmed;
  return serializeRich(parseCanonical(trimmed));
}

export function serializeRich(blocks: RichBlock[]) {
  return normalizeBlocks(blocks).map(serializeBlock).join("");
}

export function appendRichText(
  inlines: RichInline[],
  text: string,
  mark: RichMark,
) {
  if (!text) return;
  if (/^[\s\u00a0]+$/.test(text)) {
    if (!inlines.some(inlineHasContent)) return;
    const last = inlines[inlines.length - 1];
    if (last?.kind === "text" && /\s$/.test(last.text)) return;
    inlines.push({ kind: "text", text: " ", mark: EMPTY_RICH_MARK });
    return;
  }
  inlines.push({ kind: "text", text, mark: { ...mark } });
}

export function inlineHasContent(inline: RichInline) {
  if (inline.kind === "image") return true;
  if (inline.kind === "break") return false;
  return inline.text.trim().length > 0;
}

export function normalizeBlocks(blocks: RichBlock[]) {
  const next: RichBlock[] = [];
  for (const block of blocks) {
    if (block.kind === "list") {
      const items = block.items
        .map(trimEdgeBreaks)
        .filter((item) => item.some(inlineHasContent));
      if (items.length > 0) next.push({ kind: "list", items });
      continue;
    }
    const inlines = trimEdgeBreaks(block.inlines);
    if (inlines.some(inlineHasContent)) next.push({ kind: "p", inlines });
  }
  return next;
}

function trimEdgeBreaks(inlines: RichInline[]) {
  let start = 0;
  let end = inlines.length;
  while (start < end && inlines[start].kind === "break") start += 1;
  while (end > start && inlines[end - 1].kind === "break") end -= 1;
  if (start === 0 && end === inlines.length) return inlines;
  return inlines.slice(start, end);
}

function plainToBlocks(value: string): RichBlock[] {
  return value
    .split(/\n\s*\n/)
    .map((paragraph) => {
      const inlines: RichInline[] = [];
      const lines = paragraph.split("\n");
      lines.forEach((line, index) => {
        if (index > 0) inlines.push({ kind: "break" });
        if (line.length > 0) {
          inlines.push({ kind: "text", text: line, mark: EMPTY_RICH_MARK });
        }
      });
      return { kind: "p" as const, inlines };
    })
    .filter((block) => blockHasContent(block));
}

function parseCanonical(html: string): RichBlock[] {
  const blocks: RichBlock[] = [];
  let inlines: RichInline[] = [];
  let list: RichInline[][] | null = null;
  let mark: RichMark = EMPTY_RICH_MARK;
  const markStack: { tag: string; mark: RichMark }[] = [];
  let i = 0;

  function target() {
    if (list) {
      if (list.length === 0) list.push([]);
      return list[list.length - 1];
    }
    return inlines;
  }

  function finishParagraph() {
    if (list) return;
    if (inlines.length === 0) return;
    blocks.push({ kind: "p", inlines });
    inlines = [];
  }

  function finishList() {
    if (!list) return;
    const items = list.filter((item) => item.some(inlineHasContent));
    if (items.length > 0) blocks.push({ kind: "list", items });
    list = null;
  }

  function openMark(tag: string) {
    markStack.push({ tag, mark });
    mark = {
      bold: mark.bold || tag === "strong",
      italic: mark.italic || tag === "em",
      underline: mark.underline || tag === "u",
    };
  }

  function closeMark(tag: string) {
    for (let index = markStack.length - 1; index >= 0; index -= 1) {
      if (markStack[index].tag !== tag) continue;
      mark = markStack[index].mark;
      markStack.length = index;
      return;
    }
  }

  while (i < html.length) {
    if (html[i] !== "<") {
      const next = html.indexOf("<", i);
      const raw = html.slice(i, next === -1 ? html.length : next);
      appendRichText(target(), decodeEntities(raw), mark);
      i = next === -1 ? html.length : next;
      continue;
    }

    const tag = readTag(html, i);
    if (!tag) {
      appendRichText(target(), "<", mark);
      i += 1;
      continue;
    }
    i += tag.raw.length;

    if (tag.closing) {
      if (isMarkTag(tag.name)) closeMark(tag.name);
      else if (tag.name === "ul") finishList();
      else if (tag.name === "p") finishParagraph();
      continue;
    }

    if (tag.name === "br") {
      target().push({ kind: "break" });
      continue;
    }

    if (tag.name === "img") {
      const src = safeImageSrc(attr(tag.attrs, "src") ?? "");
      if (src) target().push({ kind: "image", src });
      continue;
    }

    if (tag.name === "ul") {
      if (!list) {
        finishParagraph();
        list = [];
      }
      continue;
    }

    if (tag.name === "li") {
      if (!list) {
        finishParagraph();
        list = [];
      }
      const last = list[list.length - 1];
      if (!last || last.some(inlineHasContent)) list.push([]);
      continue;
    }

    if (tag.name === "p") {
      if (list) {
        const item = target();
        if (item.some(inlineHasContent)) item.push({ kind: "break" });
        continue;
      }
      finishList();
      finishParagraph();
      continue;
    }

    if (isMarkTag(tag.name)) openMark(tag.name);
  }

  finishParagraph();
  finishList();
  return normalizeBlocks(blocks);
}

function readTag(input: string, index: number): TagToken | null {
  if (input[index] !== "<") return null;
  const closing = input[index + 1] === "/";
  const start = index + (closing ? 2 : 1);
  const nameMatch = /^([a-zA-Z][a-zA-Z0-9]*)\b/.exec(input.slice(start));
  if (!nameMatch) return null;
  const name = nameMatch[1].toLowerCase();
  if (!CANONICAL_TAGS.has(name)) return null;
  const end = findTagEnd(input, start);
  if (end === -1) return null;
  const raw = input.slice(index, end + 1);
  const attrs = input.slice(start + nameMatch[1].length, end).replace(/\/\s*$/, "");
  return { raw, name, closing, attrs };
}

function findTagEnd(input: string, start: number) {
  let quote: string | null = null;
  for (let i = start; i < input.length; i += 1) {
    const ch = input[i];
    if (quote) {
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === ">") return i;
  }
  return -1;
}

function attr(attrs: string, name: string) {
  const match = new RegExp(
    `${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>]+))`,
    "i",
  ).exec(attrs);
  if (!match) return null;
  return decodeEntities(match[1] ?? match[2] ?? match[3] ?? "");
}

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number(code)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&amp;/gi, "&");
}

function isMarkTag(tag: string) {
  return tag === "strong" || tag === "em" || tag === "u";
}

function blockHasContent(block: RichBlock) {
  const inlines = block.kind === "list" ? block.items.flat() : block.inlines;
  return inlines.some(inlineHasContent);
}

function plainWords(inlines: RichInline[]) {
  return inlines
    .map((inline) => {
      if (inline.kind === "text") return inline.text;
      if (inline.kind === "break") return " ";
      return "";
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

function serializeBlock(block: RichBlock) {
  if (block.kind === "list") {
    const items = block.items
      .filter((item) => item.some(inlineHasContent))
      .map((item) => `<li>${serializeInlines(item)}</li>`)
      .join("");
    return `<ul>${items}</ul>`;
  }
  return `<p>${serializeInlines(block.inlines)}</p>`;
}

function serializeInlines(inlines: RichInline[]) {
  return mergeInlines(inlines)
    .map((inline) => {
      if (inline.kind === "break") return "<br>";
      if (inline.kind === "image") {
        return `<img src="${escapeAttr(inline.src)}" alt="">`;
      }
      return wrapMark(escapeText(inline.text), inline.mark);
    })
    .join("");
}

function mergeInlines(inlines: RichInline[]) {
  const merged: RichInline[] = [];
  for (const inline of inlines) {
    const last = merged[merged.length - 1];
    if (
      inline.kind === "text" &&
      last?.kind === "text" &&
      sameMark(last.mark, inline.mark)
    ) {
      last.text += inline.text;
      continue;
    }
    if (inline.kind === "text") {
      merged.push({ ...inline, mark: { ...inline.mark } });
      continue;
    }
    merged.push(inline);
  }
  return merged;
}

function sameMark(a: RichMark, b: RichMark) {
  return a.bold === b.bold && a.italic === b.italic && a.underline === b.underline;
}

function wrapMark(text: string, mark: RichMark) {
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

function escapeAttr(value: string) {
  return escapeText(value).replace(/"/g, "&quot;");
}
