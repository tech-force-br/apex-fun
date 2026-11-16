/** One Apex variable name. Curriculum names are ASCII identifiers. */
const IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]*$/u;

export type ReplacementInput = {
  id?: string;
  name: string;
  value: string;
};

export type ClassifiedReplacements = {
  /** Rows that may run. Empty when one row is incomplete or a name is repeated. */
  accepted: ReplacementInput[];
  fields: boolean;
  duplicate: boolean;
};

export function isApexIdentifier(name: string) {
  return IDENTIFIER.test(name);
}

/**
 * The new right-hand side, as one line of Apex.
 * A semicolon after the value belongs to the student's statement.
 */
export function normalizeReplacementValue(value: string) {
  return value
    .trim()
    .replace(/[\r\n\t]+/gu, " ")
    .replace(/;+\s*$/u, "")
    .trim();
}

/** Blank rows are dropped. Any incomplete or repeated name rejects the whole list. */
export function classifyReplacements(
  rows: readonly ReplacementInput[],
): ClassifiedReplacements {
  const accepted: ReplacementInput[] = [];
  const seen = new Set<string>();
  let fields = false;
  let duplicate = false;

  for (const row of rows) {
    const name = row.name.trim();
    const value = normalizeReplacementValue(row.value);
    if (!name && !value) continue;
    if (!isApexIdentifier(name) || value.length === 0) {
      fields = true;
      continue;
    }
    const key = name.toLowerCase();
    if (seen.has(key)) {
      duplicate = true;
      continue;
    }
    seen.add(key);
    accepted.push(row.id ? { id: row.id, name, value } : { name, value });
  }

  if (fields || duplicate) return { accepted: [], fields, duplicate };
  return { accepted, fields, duplicate };
}

type Chunk = {
  kind: "whitespace" | "comment" | "code";
  start: number;
  end: number;
  text: string;
};

type Token = {
  text: string;
  start: number;
  end: number;
  statement: number;
};

type Edit = {
  start: number;
  end: number;
  text: string;
};

const TWO_CHAR = new Set([
  "==",
  "!=",
  "<=",
  ">=",
  "+=",
  "-=",
  "*=",
  "/=",
  "&&",
  "||",
  "=>",
  "++",
  "--",
]);

function readChunk(source: string, index: number): Chunk {
  const end = source.length;
  const char = source[index] ?? "";
  const next = source[index + 1] ?? "";

  if (char === " " || char === "\t" || char === "\n" || char === "\r") {
    let cursor = index + 1;
    while (cursor < end && /[ \t\n\r]/u.test(source[cursor] ?? "")) cursor += 1;
    return {
      kind: "whitespace",
      start: index,
      end: cursor,
      text: source.slice(index, cursor),
    };
  }

  if (char === "/" && next === "/") {
    let cursor = index + 2;
    while (cursor < end && source[cursor] !== "\n") cursor += 1;
    return {
      kind: "comment",
      start: index,
      end: cursor,
      text: source.slice(index, cursor),
    };
  }

  if (char === "/" && next === "*") {
    let cursor = index + 2;
    while (cursor < end && !(source[cursor] === "*" && source[cursor + 1] === "/")) {
      cursor += 1;
    }
    cursor = Math.min(end, cursor + 2);
    return {
      kind: "comment",
      start: index,
      end: cursor,
      text: source.slice(index, cursor),
    };
  }

  if (char === "'") {
    let cursor = index + 1;
    while (cursor < end) {
      if (source[cursor] === "'" && source[cursor + 1] === "'") {
        cursor += 2;
        continue;
      }
      if (source[cursor] === "'") {
        cursor += 1;
        break;
      }
      cursor += 1;
    }
    return {
      kind: "code",
      start: index,
      end: cursor,
      text: source.slice(index, cursor),
    };
  }

  if (/[A-Za-z_]/u.test(char)) {
    let cursor = index + 1;
    while (cursor < end && /[A-Za-z0-9_]/u.test(source[cursor] ?? "")) cursor += 1;
    return {
      kind: "code",
      start: index,
      end: cursor,
      text: source.slice(index, cursor),
    };
  }

  const pair = `${char}${next}`;
  if (TWO_CHAR.has(pair)) {
    return { kind: "code", start: index, end: index + 2, text: pair };
  }

  return { kind: "code", start: index, end: index + 1, text: char };
}

function tokenize(source: string) {
  const tokens: Token[] = [];
  let index = 0;
  let paren = 0;
  let statement = 0;

  while (index < source.length) {
    const chunk = readChunk(source, index);
    index = chunk.end;
    if (chunk.kind !== "code") continue;
    if (chunk.text === ";" && paren === 0) {
      statement += 1;
      continue;
    }
    if (chunk.text === "(") paren += 1;
    else if (chunk.text === ")") paren = Math.max(0, paren - 1);
    tokens.push({
      text: chunk.text,
      start: chunk.start,
      end: chunk.end,
      statement,
    });
  }

  return tokens;
}

function skipTrivia(source: string, start: number, limit: number) {
  let index = start;
  while (index < limit) {
    const chunk = readChunk(source, index);
    if (chunk.kind === "code") break;
    index = chunk.end;
  }
  return index;
}

function opensTypeArguments(tokens: readonly Token[], index: number) {
  const token = tokens[index];
  const previous = tokens[index - 1];
  if (!token || token.text !== "<" || !previous) return false;
  if (previous.end !== token.start) return false;
  return IDENTIFIER.test(previous.text);
}

/**
 * Index of the first token after the right-hand side.
 * Null when a nested `(`, `{`, `[`, or type argument never closes.
 * A `)`, `}`, or `]` that is already at depth 0 belongs to the surrounding code.
 * `<` is a type argument only when it is glued to a name (`Map<String>`).
 * `score < 70` stays a comparison, so a later comma can end the declaration.
 */
function rhsTokenEnd(
  tokens: readonly Token[],
  start: number,
  statement: number,
) {
  let paren = 0;
  let brace = 0;
  let bracket = 0;
  let angle = 0;
  let index = start;

  while (index < tokens.length) {
    const token = tokens[index];
    if (!token || token.statement !== statement) return index;
    const text = token.text;
    if (text === ";") return index;
    if (text === ")" && paren === 0) return index;
    if (text === "}" && brace === 0) return index;
    if (text === "]" && bracket === 0) return index;
    if (
      text === "," &&
      paren === 0 &&
      brace === 0 &&
      bracket === 0 &&
      angle === 0
    ) {
      return index;
    }
    if (text === "(") paren += 1;
    else if (text === ")") paren -= 1;
    else if (text === "{") brace += 1;
    else if (text === "}") brace -= 1;
    else if (text === "[") bracket += 1;
    else if (text === "]") bracket -= 1;
    else if (opensTypeArguments(tokens, index)) angle += 1;
    else if (text === ">" && angle > 0) angle -= 1;
    index += 1;
  }

  if (paren !== 0 || brace !== 0 || bracket !== 0 || angle !== 0) return null;
  return index;
}

function collectEdits(
  source: string,
  tokens: readonly Token[],
  values: ReadonlyMap<string, string>,
) {
  const edits: Edit[] = [];

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token || !values.has(token.text.toLowerCase())) continue;
    const equals = tokens[index + 1];
    if (!equals || equals.text !== "=" || equals.statement !== token.statement) {
      continue;
    }
    const previous = tokens[index - 1];
    if (
      previous &&
      previous.statement === token.statement &&
      previous.text === "."
    ) {
      continue;
    }

    const rhsStart = index + 2;
    const rhsEnd = rhsTokenEnd(tokens, rhsStart, token.statement);
    if (rhsEnd == null) continue;
    const value = values.get(token.text.toLowerCase()) ?? "";
    const expressionStart = skipTrivia(source, equals.end, source.length);
    const expressionEnd =
      rhsEnd > rhsStart ? (tokens[rhsEnd - 1]?.end ?? expressionStart) : expressionStart;
    if (expressionEnd < expressionStart) continue;
    edits.push({ start: expressionStart, end: expressionEnd, text: value });
    index = Math.max(index, rhsEnd - 1);
  }

  return edits;
}

/**
 * Rewrites each plain assignment to a listed variable.
 * `==` and `+=` stay. Strings, comments, and other names stay.
 * The first compile of the original snippet does not use this.
 */
export function applyValueReplacements(
  source: string,
  replacements: readonly ReplacementInput[],
) {
  const accepted = classifyReplacements(replacements).accepted;
  if (accepted.length === 0) return source;
  const values = new Map(
    accepted.map((row) => [row.name.toLowerCase(), row.value]),
  );

  const edits = collectEdits(source, tokenize(source), values);
  if (edits.length === 0) return source;

  edits.sort((left, right) => right.start - left.start);
  let rewritten = source;
  for (const edit of edits) {
    rewritten =
      rewritten.slice(0, edit.start) + edit.text + rewritten.slice(edit.end);
  }
  return rewritten;
}
