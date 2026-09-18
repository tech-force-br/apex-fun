"use client";

import { chromeCopy, localeOptions } from "@/lib/locale";
import { SegmentedControl } from "@/components/segmented-control";
import { useLocale } from "@/components/locale-provider";

export function LanguageToggle({ disabled }: { disabled?: boolean }) {
  const { locale, setLocale } = useLocale();
  const chrome = chromeCopy[locale];

  return (
    <SegmentedControl
      variant="pill"
      aria-label={chrome.language}
      disabled={disabled}
      value={locale}
      onChange={setLocale}
      options={localeOptions.map((option) => ({
        value: option.id,
        label: option.id === "en" ? "EN" : "PT",
      }))}
    />
  );
}
