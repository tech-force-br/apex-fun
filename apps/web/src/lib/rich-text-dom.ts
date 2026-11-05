import {
  appendRichText,
  EMPTY_RICH_MARK,
  inlineHasContent,
  normalizeBlocks,
  safeImageSrc,
  type RichBlock,
  type RichInline,
  type RichMark,
} from "@/lib/rich-text";

const DROP_TAGS = new Set([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "svg",
  "math",
  "noscript",
  "template",
  "head",
  "title",
  "link",
  "meta",
  "col",
  "colgroup",
  "input",
  "button",
  "textarea",
  "select",
  "option",
  "video",
  "audio",
  "canvas",
]);

const PASTE_TAGS = new Set([
  ...DROP_TAGS,
  "p",
  "div",
  "br",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "ul",
  "ol",
  "li",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "span",
  "font",
  "img",
  "table",
  "tbody",
  "thead",
  "tfoot",
  "tr",
  "td",
  "th",
  "a",
  "html",
  "body",
  "form",
]);

const BLOCK_TAGS = new Set([
  "p",
  "div",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "td",
  "th",
]);

export type TextCaret = { start: number; end: number };

/** Keep Apex generics as text. Only the tags the paste walker understands stay tags. */
export function escapeUnknownTags(html: string) {
  return html.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b/g, (match, name: string) => {
    if (PASTE_TAGS.has(name.toLowerCase())) return match;
    return `&lt;${match.slice(1)}`;
  });
}

export function domToBlocks(root: ParentNode): RichBlock[] {
  const blocks: RichBlock[] = [];
  let inlines: RichInline[] = [];
  let list: RichInline[][] | null = null;
  let mark: RichMark = EMPTY_RICH_MARK;

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

  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      appendRichText(target(), node.textContent ?? "", mark);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    if (DROP_TAGS.has(tag)) return;

    if (tag === "br") {
      target().push({ kind: "break" });
      return;
    }

    if (tag === "img") {
      const src = safeImageSrc(el.getAttribute("src") ?? "");
      if (src) target().push({ kind: "image", src });
      return;
    }

    if (tag === "ul" || tag === "ol") {
      const started = list === null;
      if (started) {
        finishParagraph();
        list = [];
      }
      for (const child of el.childNodes) {
        if (isBlankText(child)) continue;
        walk(child);
      }
      if (started) finishList();
      return;
    }

    if (tag === "li") {
      const started = list === null;
      if (started) {
        finishParagraph();
        list = [];
      }
      const items = list ?? [];
      const last = items[items.length - 1];
      if (!last || last.some(inlineHasContent)) items.push([]);
      list = items;
      for (const child of el.childNodes) walk(child);
      if (started) finishList();
      return;
    }

    if (BLOCK_TAGS.has(tag)) {
      if (list) {
        const item = target();
        if (item.some(inlineHasContent)) item.push({ kind: "break" });
        for (const child of el.childNodes) walk(child);
        return;
      }
      finishList();
      finishParagraph();
      for (const child of el.childNodes) walk(child);
      finishParagraph();
      return;
    }

    const previous = mark;
    mark = markFromElement(el, mark);
    for (const child of el.childNodes) walk(child);
    mark = previous;
  }

  for (const child of root.childNodes) walk(child);
  finishParagraph();
  finishList();
  return normalizeBlocks(blocks);
}

export function blocksFromPastedHtml(html: string) {
  const holder = document.createElement("div");
  holder.innerHTML = escapeUnknownTags(html);
  return domToBlocks(holder);
}

export function captureTextCaret(root: HTMLElement): TextCaret | null {
  try {
    const selection = document.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) {
      return null;
    }
    return {
      start: textOffset(root, range.startContainer, range.startOffset),
      end: textOffset(root, range.endContainer, range.endOffset),
    };
  } catch {
    return null;
  }
}

export function restoreTextCaret(root: HTMLElement, caret: TextCaret | null) {
  const selection = document.getSelection();
  if (!selection) return;
  try {
    const start = caret ? locateText(root, caret.start) : null;
    const end = caret ? locateText(root, caret.end) : null;
    const range = document.createRange();
    if (start && end) {
      range.setStart(start.node, start.offset);
      range.setEnd(end.node, end.offset);
    } else {
      range.selectNodeContents(root);
      range.collapse(false);
    }
    selection.removeAllRanges();
    selection.addRange(range);
  } catch {
    root.focus();
  }
}

export function selectionMarks(root: HTMLElement) {
  const marks = { bold: false, italic: false, underline: false, bullets: false };
  const selection = document.getSelection();
  if (!selection || selection.rangeCount === 0) return marks;
  let node: Node | null = selection.anchorNode;
  if (!node || !root.contains(node)) return marks;
  while (node && node !== root) {
    if (node instanceof HTMLElement) {
      const tag = node.tagName.toLowerCase();
      if (tag === "b" || tag === "strong") marks.bold = true;
      if (tag === "i" || tag === "em") marks.italic = true;
      if (tag === "u") marks.underline = true;
      if (tag === "li" || tag === "ul" || tag === "ol") marks.bullets = true;
      const weight = node.style.fontWeight;
      if (
        weight === "bold" ||
        weight === "bolder" ||
        (/^\d+$/.test(weight) && Number(weight) >= 600)
      ) {
        marks.bold = true;
      }
      if (node.style.fontStyle === "italic" || node.style.fontStyle === "oblique") {
        marks.italic = true;
      }
      const decoration = `${node.style.textDecorationLine} ${node.style.textDecoration}`;
      if (decoration.includes("underline")) marks.underline = true;
    }
    node = node.parentNode;
  }
  return marks;
}

function isBlankText(node: Node) {
  return (
    node.nodeType === Node.TEXT_NODE &&
    /^[\s\u00a0]*$/.test(node.textContent ?? "")
  );
}

function markFromElement(el: HTMLElement, current: RichMark): RichMark {
  const tag = el.tagName.toLowerCase();
  const next: RichMark = { ...current };
  if (tag === "b" || tag === "strong") next.bold = true;
  if (tag === "i" || tag === "em") next.italic = true;
  if (tag === "u") next.underline = true;
  const weight = el.style.fontWeight;
  if (
    weight === "bold" ||
    weight === "bolder" ||
    (/^\d+$/.test(weight) && Number(weight) >= 600)
  ) {
    next.bold = true;
  }
  if (el.style.fontStyle === "italic" || el.style.fontStyle === "oblique") {
    next.italic = true;
  }
  const decoration = `${el.style.textDecorationLine} ${el.style.textDecoration}`;
  if (decoration.includes("underline")) next.underline = true;
  return next;
}

function textOffset(root: HTMLElement, container: Node, offset: number) {
  const range = document.createRange();
  range.selectNodeContents(root);
  const safeOffset =
    container.nodeType === Node.TEXT_NODE
      ? Math.min(offset, container.textContent?.length ?? 0)
      : Math.min(offset, container.childNodes.length);
  range.setEnd(container, safeOffset);
  return range.cloneContents().textContent?.length ?? 0;
}

function locateText(root: HTMLElement, target: number) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let remaining = Math.max(0, target);
  let last: Text | null = null;
  let node = walker.nextNode() as Text | null;
  while (node) {
    if (remaining <= node.data.length) return { node, offset: remaining };
    remaining -= node.data.length;
    last = node;
    node = walker.nextNode() as Text | null;
  }
  if (last) return { node: last, offset: last.data.length };
  return null;
}
