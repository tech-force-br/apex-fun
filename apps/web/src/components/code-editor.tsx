"use client";

import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import { java } from "@codemirror/lang-java";
import { bracketMatching, indentOnInput } from "@codemirror/language";
import { EditorState, Prec, type Extension } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import {
  drawSelection,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
  type KeyBinding,
} from "@codemirror/view";
import { useEffect, useRef } from "react";

const clipboardKeys: readonly KeyBinding[] = [
  { key: "Mod-c", run: () => true },
  { key: "Mod-v", run: () => true },
  { key: "Mod-x", run: () => true },
  { key: "Mod-Insert", run: () => true },
  { key: "Shift-Insert", run: () => true },
  { key: "Shift-Delete", run: () => true },
];

function blockClipboardEvent(event: Event) {
  event.preventDefault();
  return true;
}

function blockClipboardInsert(event: Event) {
  if (!(event instanceof InputEvent)) return false;
  if (
    event.inputType === "insertFromPaste" ||
    event.inputType === "insertFromDrop" ||
    event.inputType === "deleteByCut"
  ) {
    return blockClipboardEvent(event);
  }
  return false;
}

function editorTheme(minHeight: string): Extension {
  return Prec.highest(
    EditorView.theme(
      {
        "&.cm-editor": {
          backgroundColor: "var(--color-space)",
          color: "var(--color-ink)",
          fontSize: "0.875rem",
        },
        "& .cm-scroller": {
          fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
          lineHeight: "1.6",
        },
        "& .cm-content": {
          minHeight,
          caretColor: "var(--color-accent)",
        },
        "& .cm-gutters": {
          backgroundColor: "var(--color-space-mid)",
          color: "var(--color-muted)",
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
          minHeight,
        },
        "& .cm-activeLine": {
          backgroundColor: "color-mix(in srgb, var(--color-accent) 8%, transparent)",
        },
        "& .cm-activeLineGutter": {
          backgroundColor: "var(--color-space-card)",
        },
        "& .cm-cursor, & .cm-dropCursor": {
          borderLeftColor: "var(--color-accent)",
        },
        "&.cm-focused": {
          outline: "2px solid color-mix(in srgb, var(--color-accent) 45%, transparent)",
          outlineOffset: "-2px",
        },
      },
      { dark: true },
    ),
  );
}

function clipboardBlock(): Extension {
  return Prec.highest([
    keymap.of(clipboardKeys),
    EditorView.domEventHandlers({
      copy: blockClipboardEvent,
      cut: blockClipboardEvent,
      paste: blockClipboardEvent,
      drop: blockClipboardEvent,
      dragstart: blockClipboardEvent,
      beforeinput: blockClipboardInsert,
    }),
  ]);
}

export function CodeEditor({
  initialValue = "",
  readOnly = false,
  blockClipboard = false,
  label,
  minHeight = "0",
}: {
  initialValue?: string;
  readOnly?: boolean;
  blockClipboard?: boolean;
  label: string;
  minHeight?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const labelRef = useRef(label);

  useEffect(() => {
    labelRef.current = label;
    viewRef.current?.contentDOM.setAttribute("aria-label", label);
  }, [label]);

  useEffect(() => {
    const parent = hostRef.current;
    if (!parent) return;

    const extensions: Extension[] = [
      lineNumbers(),
      history(),
      drawSelection(),
      indentOnInput(),
      bracketMatching(),
      EditorView.lineWrapping,
      java(),
      oneDark,
      keymap.of([
        ...historyKeymap,
        ...defaultKeymap,
        ...(readOnly ? [] : [indentWithTab]),
      ]),
      editorTheme(minHeight),
      EditorView.contentAttributes.of({
        "aria-label": labelRef.current,
        "aria-multiline": "true",
        spellcheck: "false",
        ...(readOnly ? { "aria-readonly": "true" } : {}),
      }),
      ...(readOnly
        ? [EditorState.readOnly.of(true), EditorView.editable.of(false)]
        : [highlightActiveLine(), highlightActiveLineGutter()]),
      ...(blockClipboard ? [clipboardBlock()] : []),
    ];

    const view = new EditorView({
      parent,
      state: EditorState.create({ doc: initialValue, extensions }),
    });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [blockClipboard, initialValue, minHeight, readOnly]);

  return (
    <div
      ref={hostRef}
      className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-space"
    />
  );
}
