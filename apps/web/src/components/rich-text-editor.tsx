"use client";

import { useRef, useState, type ReactNode } from "react";
import { useLocale } from "@/components/locale-provider";
import { adminCopy } from "@/lib/admin-copy";
import {
  blocksFromPastedHtml,
  captureTextCaret,
  domToBlocks,
  restoreTextCaret,
  selectionMarks,
} from "@/lib/rich-text-dom";
import { imageHtml, richBlocks, serializeRich } from "@/lib/rich-text";

export function RichTextEditor({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const { locale } = useLocale();
  const copy = adminCopy[locale];
  const ref = useRef<HTMLDivElement>(null);
  // Stable across keystrokes so React does not wipe what the owner just typed.
  const [initialHtml] = useState(() =>
    value.trim() ? serializeRich(richBlocks(value)) : "",
  );
  const [rejected, setRejected] = useState(false);
  const [marks, setMarks] = useState({
    bold: false,
    italic: false,
    underline: false,
    bullets: false,
  });

  function storedHtml() {
    const root = ref.current;
    if (!root) return "";
    return serializeRich(domToBlocks(root));
  }

  function emit() {
    onChange(storedHtml());
  }

  function syncMarks() {
    const root = ref.current;
    if (!root) return;
    setMarks(selectionMarks(root));
  }

  // Toolbar and paste rewrite the box to the stored HTML. Typing leaves the live DOM.
  function commitDom() {
    const root = ref.current;
    if (!root) return;
    const caret = captureTextCaret(root);
    const html = serializeRich(domToBlocks(root));
    root.innerHTML = html;
    restoreTextCaret(root, caret);
    onChange(html);
    syncMarks();
  }

  function format(command: "bold" | "italic" | "underline" | "insertUnorderedList") {
    const root = ref.current;
    if (!root) return;
    root.focus();
    document.execCommand(command);
    commitDom();
  }

  async function onPaste(event: React.ClipboardEvent<HTMLDivElement>) {
    const images = imageFiles(event.clipboardData);
    event.preventDefault();
    const root = ref.current;
    if (!root) return;

    if (images.length > 0) {
      const htmls = await Promise.all(
        images.map(async (file) => {
          try {
            return imageHtml(await readDataUrl(file));
          } catch {
            return null;
          }
        }),
      );
      if (ref.current !== root) return;
      root.focus();
      let failed = false;
      for (const html of htmls) {
        if (!html) {
          failed = true;
          continue;
        }
        document.execCommand("insertHTML", false, html);
      }
      setRejected(failed);
      commitDom();
      return;
    }

    setRejected(false);
    root.focus();
    const html = event.clipboardData.getData("text/html");
    const text = event.clipboardData.getData("text/plain");
    const inserted = html.trim()
      ? serializeRich(blocksFromPastedHtml(html))
      : serializeRich(richBlocks(text));
    if (inserted) document.execCommand("insertHTML", false, inserted);
    else if (text) document.execCommand("insertText", false, text);
    commitDom();
  }

  return (
    <div className="mt-1.5">
      <div className="overflow-hidden rounded-md border border-line bg-white focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30">
        <div className="flex gap-1 border-b border-line bg-space px-2 py-1.5">
          <FormatButton
            label={copy.bold}
            pressed={marks.bold}
            className="font-bold"
            onClick={() => format("bold")}
          >
            B
          </FormatButton>
          <FormatButton
            label={copy.italic}
            pressed={marks.italic}
            className="italic"
            onClick={() => format("italic")}
          >
            I
          </FormatButton>
          <FormatButton
            label={copy.underline}
            pressed={marks.underline}
            className="underline"
            onClick={() => format("underline")}
          >
            U
          </FormatButton>
          <FormatButton
            label={copy.bullets}
            pressed={marks.bullets}
            className=""
            onClick={() => format("insertUnorderedList")}
          >
            <span aria-hidden="true" className="inline-flex h-3.5 w-4 flex-col justify-between">
              <span className="flex items-center gap-0.5">
                <span className="size-[3px] shrink-0 rounded-[1px] bg-current" />
                <span className="h-0.5 flex-1 rounded-sm bg-current" />
              </span>
              <span className="flex items-center gap-0.5">
                <span className="size-[3px] shrink-0 rounded-[1px] bg-current" />
                <span className="h-0.5 flex-1 rounded-sm bg-current" />
              </span>
              <span className="flex items-center gap-0.5">
                <span className="size-[3px] shrink-0 rounded-[1px] bg-current" />
                <span className="h-0.5 flex-1 rounded-sm bg-current" />
              </span>
            </span>
          </FormatButton>
        </div>
        <div
          id={id}
          ref={ref}
          role="textbox"
          aria-multiline="true"
          contentEditable
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: initialHtml }}
          onPaste={(event) => void onPaste(event)}
          onInput={() => {
            setRejected(false);
            emit();
          }}
          onFocus={() => {
            try {
              document.execCommand("defaultParagraphSeparator", false, "p");
            } catch {
              // Older browsers ignore the paragraph separator.
            }
            syncMarks();
          }}
          className="rich-editor min-h-32 px-3 py-2.5 text-base leading-7 text-ink outline-none"
          onKeyUp={syncMarks}
          onMouseUp={syncMarks}
        />
      </div>
      {rejected ? (
        <span className="mt-1 block text-xs text-[#ba0517]" role="status">
          {copy.imageRejected}
        </span>
      ) : null}
    </div>
  );
}

function FormatButton({
  label,
  pressed,
  className,
  onClick,
  children,
}: {
  label: string;
  pressed: boolean;
  className: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center rounded-md px-2 py-1 text-sm text-ink hover:bg-white ${className} ${
        pressed ? "bg-highlight text-accent-deep" : ""
      }`}
    >
      {children}
    </button>
  );
}

function imageFiles(data: DataTransfer) {
  const fromFiles = Array.from(data.files).filter((file) =>
    file.type.startsWith("image/"),
  );
  if (fromFiles.length > 0) return fromFiles;
  return Array.from(data.items)
    .filter((item) => item.type.startsWith("image/"))
    .map((item) => item.getAsFile())
    .filter((file): file is File => file !== null);
}

function readDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
