"use client";

type SegmentedControlOption<T extends string> = {
  value: T;
  label: string;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
  disabled = false,
  variant = "fill",
  className,
}: {
  options: readonly SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  "aria-label": string;
  disabled?: boolean;
  variant?: "pill" | "fill";
  className?: string;
}) {
  const pill = variant === "pill";

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={[
        pill
          ? "inline-flex rounded-full border border-white/10 bg-space p-1"
          : "grid grid-cols-2 rounded-lg border border-white/10 bg-space p-1",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={`cursor-pointer font-medium transition disabled:opacity-60 ${
              pill
                ? `rounded-full px-3 py-1 text-xs ${
                    active ? "bg-accent text-space" : "text-muted hover:text-ink"
                  }`
                : `rounded-md px-3 py-2 text-sm ${
                    active
                      ? "bg-space-card text-ink shadow-sm"
                      : "text-muted hover:text-ink"
                  }`
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
