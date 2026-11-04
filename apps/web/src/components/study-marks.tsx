import type { ReactNode } from "react";
import { isVariablesTopicId, type VariablesTopicId } from "@/lib/curriculum";

function Frame({
  children,
  strokeWidth = 1.7,
}: {
  children: ReactNode;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

function Literal({
  text,
  size,
  family,
}: {
  text: string;
  size: number;
  family: "sans" | "mono";
}) {
  const fontFamily =
    family === "mono"
      ? "var(--font-geist-mono), ui-monospace, monospace"
      : "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif";

  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <text
        x="12"
        y="12.5"
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        fontSize={size}
        fontWeight="700"
        fontFamily={fontFamily}
      >
        {text}
      </text>
    </svg>
  );
}

type LiteralPicture = {
  kind: "literal";
  text: string;
  size: number;
  family: "sans" | "mono";
};

type DrawPicture = {
  kind: "draw";
  Draw: () => ReactNode;
};

type Picture = LiteralPicture | DrawPicture;

function PictureView({ picture }: { picture: Picture }) {
  if (picture.kind === "literal") {
    return <Literal text={picture.text} size={picture.size} family={picture.family} />;
  }
  const { Draw } = picture;
  return <Draw />;
}

/** Braces keep {x} from reading as a close mark. Shared by the module and its first topic. */
const variableBox: LiteralPicture = {
  kind: "literal",
  text: "{x}",
  size: 12,
  family: "mono",
};

function AssigningGlyph() {
  return (
    <Frame strokeWidth={2.4}>
      <path d="M4.5 8.75h15" />
      <path d="M4.5 15.25h15" />
    </Frame>
  );
}

function DebugGlyph() {
  return (
    <Frame>
      <rect x="3" y="3.15" width="18" height="17.7" rx="2" />
      <path d="M3 8.15h18" />
      <path d="M6.7 12.35 9.45 14.7 6.7 17.05" />
      <path d="M11.3 16.85h5.3" />
    </Frame>
  );
}

function BooleanGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <rect x="1.7" y="6.5" width="20.6" height="11" rx="5.5" fill="currentColor" />
      <circle cx="16.45" cy="12" r="3.25" fill="white" />
    </svg>
  );
}

function DateGlyph() {
  return (
    <Frame>
      <rect x="3.1" y="4.7" width="17.8" height="15.9" rx="2" />
      <path d="M3.1 9.25h17.8" />
      <path d="M8 3.05v3.35" />
      <path d="M16 3.05v3.35" />
      <rect x="7.05" y="12.15" width="3.15" height="3.15" rx="0.45" fill="currentColor" stroke="none" />
    </Frame>
  );
}

function ConcatenationGlyph() {
  return (
    <Frame>
      <rect x="1.7" y="8" width="7.3" height="8" rx="1.6" />
      <rect x="15" y="8" width="7.3" height="8" rx="1.6" />
      <path d="M10.45 12h3.1" />
      <path d="M12 10.45v3.1" />
    </Frame>
  );
}

function FolderGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
      <path d="M3.75 6.5A1.75 1.75 0 0 1 5.5 4.75h3.1c.3 0 .58.14.76.38l.9 1.12h8.24A1.75 1.75 0 0 1 20.25 8v9.5A1.75 1.75 0 0 1 18.5 19.25h-13A1.75 1.75 0 0 1 3.75 17.5z" />
    </svg>
  );
}

const topicPictures: Record<VariablesTopicId, Picture> = {
  "what-a-variable-is": variableBox,
  "naming-rules": { kind: "literal", text: "Aa", size: 15, family: "sans" },
  declaring: { kind: "literal", text: "x;", size: 12, family: "mono" },
  assigning: { kind: "draw", Draw: AssigningGlyph },
  "system-debug": { kind: "draw", Draw: DebugGlyph },
  integer: { kind: "literal", text: "123", size: 11, family: "mono" },
  string: { kind: "literal", text: "'a'", size: 12, family: "mono" },
  boolean: { kind: "draw", Draw: BooleanGlyph },
  decimal: { kind: "literal", text: "1.5", size: 12, family: "mono" },
  date: { kind: "draw", Draw: DateGlyph },
  concatenation: { kind: "draw", Draw: ConcatenationGlyph },
  "mixed-review": { kind: "literal", text: "1+a", size: 10, family: "mono" },
};

const folderPicture: DrawPicture = { kind: "draw", Draw: FolderGlyph };

/** Topic row mark. Unknown topics, including ones created in admin, use a folder. */
export function StudyGlyph({ mark }: { mark: string }) {
  const picture = isVariablesTopicId(mark) ? topicPictures[mark] : folderPicture;
  return <PictureView picture={picture} />;
}

function OperatorsIcon() {
  return (
    <Frame>
      <path d="M6.9 8.5v7M3.4 12h7" />
      <path d="M13.6 8.5 20.6 15.5M20.6 8.5 13.6 15.5" />
    </Frame>
  );
}

function IfAndElseIcon() {
  return (
    <Frame>
      <path d="M12 3.2v5" />
      <path d="M12 8.2 6.2 13.6" />
      <path d="M12 8.2 17.8 13.6" />
      <path d="M6.2 13.6v6.4" />
      <path d="M17.8 13.6v6.4" />
    </Frame>
  );
}

function ListsIcon() {
  return (
    <Frame>
      <circle cx="5" cy="7" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="5" cy="12" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="5" cy="17" r="1.15" fill="currentColor" stroke="none" />
      <path d="M9 7h10.5M9 12h10.5M9 17h7" />
    </Frame>
  );
}

function SetsIcon() {
  return (
    <Frame>
      <circle cx="9.2" cy="12" r="5.2" />
      <circle cx="14.8" cy="12" r="5.2" />
    </Frame>
  );
}

function LoopsIcon() {
  return (
    <Frame>
      <path d="M18.6 12a6.6 6.6 0 1 1-2.1-4.9" />
      <path d="M16.2 4.2 16.5 8.2 20.2 7" />
    </Frame>
  );
}

function SObjectsIcon() {
  return (
    <Frame>
      <rect x="4" y="3.5" width="16" height="17" rx="2" />
      <path d="M4 8.6h16" />
      <circle cx="7.4" cy="6.05" r="1.05" fill="currentColor" stroke="none" />
      <path d="M10 6.05h6.2M7.4 12.2h9M7.4 15.6h6" />
    </Frame>
  );
}

function MapsIcon() {
  return (
    <Frame>
      <rect x="3.2" y="7.5" width="6" height="9" rx="1.6" />
      <circle cx="6.2" cy="12" r="1.05" fill="currentColor" stroke="none" />
      <path d="M10.5 12h2.2" />
      <path d="M11.5 10.4 14.2 12 11.5 13.6" />
      <rect x="15" y="7.5" width="6" height="9" rx="1.6" />
      <path d="M16.6 10.6h2.6M16.6 13.4h2.6" />
    </Frame>
  );
}

function SoqlIcon() {
  return (
    <Frame>
      <circle cx="10.5" cy="10.5" r="5.4" />
      <path d="M14.5 14.5 19.6 19.6" />
    </Frame>
  );
}

function DmlIcon() {
  return (
    <Frame>
      <ellipse cx="12" cy="7" rx="6.5" ry="2.4" />
      <path d="M5.5 7v8.6c0 1.35 2.9 2.4 6.5 2.4s6.5-1.05 6.5-2.4V7" />
      <path d="M5.5 11.6c0 1.35 2.9 2.4 6.5 2.4s6.5-1.05 6.5-2.4" />
    </Frame>
  );
}

function MethodsIcon() {
  return (
    <Frame>
      <path d="M8.4 4.4C5.2 7.6 5.2 16.4 8.4 19.6" />
      <path d="M15.6 4.4C18.8 7.6 18.8 16.4 15.6 19.6" />
    </Frame>
  );
}

function ClassesIcon() {
  return (
    <Frame>
      <rect x="4.5" y="3.5" width="15" height="17" rx="1.6" />
      <path d="M4.5 9h15M4.5 14.5h15" />
    </Frame>
  );
}

function BookIcon() {
  return (
    <Frame>
      <path d="M12 6.4c-1.3-1.3-3.3-2-5.6-2H4.2V16.2h2.2c2 0 3.8.6 5.6 1.9 1.8-1.3 3.6-1.9 5.6-1.9h2.2V4.4H17.6c-2.3 0-4.3.7-5.6 2Z" />
      <path d="M12 6.4v11.7" />
    </Frame>
  );
}

const modulePictures: Record<string, Picture> = {
  variables: variableBox,
  operators: { kind: "draw", Draw: OperatorsIcon },
  "if-and-else": { kind: "draw", Draw: IfAndElseIcon },
  lists: { kind: "draw", Draw: ListsIcon },
  sets: { kind: "draw", Draw: SetsIcon },
  loops: { kind: "draw", Draw: LoopsIcon },
  sobjects: { kind: "draw", Draw: SObjectsIcon },
  maps: { kind: "draw", Draw: MapsIcon },
  soql: { kind: "draw", Draw: SoqlIcon },
  dml: { kind: "draw", Draw: DmlIcon },
  methods: { kind: "draw", Draw: MethodsIcon },
  classes: { kind: "draw", Draw: ClassesIcon },
};

const bookPicture: DrawPicture = { kind: "draw", Draw: BookIcon };

/** Subject mark for a module stop. Unknown modules use a book. */
export function ModuleIcon({ moduleId }: { moduleId: string }) {
  return <PictureView picture={modulePictures[moduleId] ?? bookPicture} />;
}
