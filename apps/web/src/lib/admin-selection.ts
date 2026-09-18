export type AdminSelection =
  | { kind: "pick" }
  | { kind: "module"; moduleId: string }
  | { kind: "topic"; moduleId: string; topicId: string }
  | { kind: "card"; moduleId: string; topicId: string; cardId: string }
  | { kind: "new-module"; nonce: number }
  | { kind: "new-topic"; moduleId: string; nonce: number }
  | { kind: "new-card"; moduleId: string; topicId: string; cardType: "theory" | "exercise"; nonce: number };

export function selectionKey(selection: AdminSelection) {
  switch (selection.kind) {
    case "pick":
      return "pick";
    case "module":
      return `module:${selection.moduleId}`;
    case "topic":
      return `topic:${selection.moduleId}:${selection.topicId}`;
    case "card":
      return `card:${selection.moduleId}:${selection.topicId}:${selection.cardId}`;
    case "new-module":
      return `new-module:${selection.nonce}`;
    case "new-topic":
      return `new-topic:${selection.moduleId}:${selection.nonce}`;
    case "new-card":
      return `new-card:${selection.moduleId}:${selection.topicId}:${selection.cardType}:${selection.nonce}`;
  }
}
