import type { RichBlock, RichInline, RichMark } from "@/lib/rich-text";
import { richBlocks } from "@/lib/rich-text";

export function RichTextView({
  value,
  headingFirst = false,
}: {
  value: string;
  headingFirst?: boolean;
}) {
  const blocks = richBlocks(value);
  const headingIndex = headingFirst
    ? blocks.findIndex((block) => block.kind === "p" && hasWords(block.inlines))
    : -1;

  return (
    <>
      {blocks.map((block, index) =>
        block.kind === "list" ? (
          <ListView key={index} block={block} />
        ) : (
          <ParagraphView
            key={index}
            inlines={block.inlines}
            heading={index === headingIndex}
          />
        ),
      )}
    </>
  );
}

function ParagraphView({
  inlines,
  heading,
}: {
  inlines: RichInline[];
  heading: boolean;
}) {
  const parts = splitAtImages(inlines);
  let headingLeft = heading;

  return parts.map((part, index) => {
    if (part.kind === "image") return <LessonImage key={index} src={part.src} />;
    const asHeading = headingLeft && hasWords(part.inlines);
    if (asHeading) headingLeft = false;
    const Tag = asHeading ? "h1" : "p";
    return (
      <Tag
        key={index}
        className={
          asHeading
            ? "mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl"
            : "mt-4 text-base leading-7 text-ink"
        }
      >
        <Inlines inlines={part.inlines} />
      </Tag>
    );
  });
}

function ListView({
  block,
}: {
  block: Extract<RichBlock, { kind: "list" }>;
}) {
  return (
    <ul className="mt-4 list-disc space-y-1 pl-5 text-base leading-7 text-ink">
      {block.items.map((item, index) => (
        <li key={index}>
          <Inlines inlines={item} />
        </li>
      ))}
    </ul>
  );
}

function Inlines({ inlines }: { inlines: RichInline[] }) {
  return inlines.map((inline, index) => {
    if (inline.kind === "break") return <br key={index} />;
    if (inline.kind === "image") return <LessonImage key={index} src={inline.src} />;
    return (
      <span key={index} className={markClass(inline.mark)}>
        {inline.text}
      </span>
    );
  });
}

function LessonImage({ src }: { src: string }) {
  return (
    // Owner images are data URLs or arbitrary links, so they skip the optimizer.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      draggable={false}
      className="mt-4 max-w-full rounded-lg border border-line"
    />
  );
}

function splitAtImages(inlines: RichInline[]) {
  const parts: Array<
    { kind: "text"; inlines: RichInline[] } | { kind: "image"; src: string }
  > = [];
  let buffer: RichInline[] = [];
  for (const inline of inlines) {
    if (inline.kind === "image") {
      if (buffer.length > 0) parts.push({ kind: "text", inlines: buffer });
      buffer = [];
      parts.push({ kind: "image", src: inline.src });
      continue;
    }
    buffer.push(inline);
  }
  if (buffer.length > 0) parts.push({ kind: "text", inlines: buffer });
  return parts;
}

function hasWords(inlines: RichInline[]) {
  return inlines.some(
    (inline) => inline.kind === "text" && inline.text.trim().length > 0,
  );
}

function markClass(mark: RichMark) {
  const names = [
    mark.bold ? "font-bold" : "",
    mark.italic ? "italic" : "",
    mark.underline ? "underline" : "",
  ].filter(Boolean);
  return names.length > 0 ? names.join(" ") : undefined;
}
