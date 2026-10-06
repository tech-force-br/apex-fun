"use client";

import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import { java } from "@codemirror/lang-java";
import {
  bracketMatching,
  HighlightStyle,
  indentOnInput,
  syntaxHighlighting,
} from "@codemirror/language";
import { EditorState, Prec, type Extension } from "@codemirror/state";
import { tags } from "@lezer/highlight";
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

const apexHighlight = HighlightStyle.define([
  { tag: [tags.keyword, tags.typeName, tags.className], color: "#032d60", fontWeight: "600" },
  { tag: [tags.string, tags.special(tags.string)], color: "#032d60" },
  { tag: [tags.number, tags.bool, tags.null], color: "#0176d3" },
  { tag: [tags.comment, tags.lineComment, tags.blockComment], color: "#706e6b", fontStyle: "italic" },
  { tag: [tags.operator, tags.punctuation, tags.variableName, tags.propertyName], color: "#181818" },
]);

function editorTheme(minHeight: string): Extension {
  return Prec.highest(
    EditorView.theme(
      {
        "&.cm-editor": {
          backgroundColor: "#ffffff",
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
          backgroundColor: "var(--color-space)",
          color: "var(--color-muted)",
          borderRight: "1px solid var(--color-line)",
          minHeight,
        },
        "& .cm-activeLine": {
          backgroundColor: "var(--color-highlight)",
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
      { dark: false },
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
  id,
  initialValue = "",
  onChange,
  readOnly = false,
  blockClipboard = false,
  label,
  minHeight = "0",
}: {
  id?: string;
  initialValue?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  blockClipboard?: boolean;
  label: string;
  minHeight?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const labelRef = useRef(label);
  const idRef = useRef(id);
  const onChangeRef = useRef(onChange);
  // Latest text for a real remount. Keystrokes stay in the editor.
  const docRef = useRef(initialValue);

  useEffect(() => {
    labelRef.current = label;
    idRef.current = id;
    onChangeRef.current = onChange;
    docRef.current = initialValue;
  }, [id, initialValue, label, onChange]);

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
      syntaxHighlighting(apexHighlight),
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
        ...(idRef.current ? { id: idRef.current } : {}),
        ...(readOnly ? { "aria-readonly": "true" } : {}),
      }),
      EditorView.updateListener.of((update) => {
        if (!update.docChanged) return;
        onChangeRef.current?.(update.state.doc.toString());
      }),
      ...(readOnly
        ? [EditorState.readOnly.of(true), EditorView.editable.of(false)]
        : [highlightActiveLine(), highlightActiveLineGutter()]),
      ...(blockClipboard ? [clipboardBlock()] : []),
    ];

    const view = new EditorView({
      parent,
      state: EditorState.create({
        doc: docRef.current,
        extensions,
      }),
    });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [blockClipboard, minHeight, readOnly]);

  useEffect(() => {
    const content = viewRef.current?.contentDOM;
    if (!content) return;
    content.setAttribute("aria-label", label);
    if (id) content.setAttribute("id", id);
    else content.removeAttribute("id");
  }, [id, label]);

  return (
    <div
      ref={hostRef}
      className="min-w-0 overflow-hidden rounded-lg border border-line bg-white"
    />
  );
}
