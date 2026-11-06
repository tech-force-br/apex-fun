/**
 * Exercise editor text for this browser tab.
 * A reload drops it. The account does not keep it.
 */
const drafts = new Map<string, string>();

export function editorDraft(cardId: string) {
  return drafts.get(cardId) ?? "";
}

export function rememberEditorDraft(cardId: string, code: string) {
  drafts.set(cardId, code);
}
