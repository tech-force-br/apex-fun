"use client";

import { chromeCopy, localeOptions } from "@/lib/locale";
import { useLocale } from "@/components/locale-provider";

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  const chrome = chromeCopy[locale];

  return (
    <div
      className="inline-flex rounded-full border border-white/10 bg-space p-1"
      role="group"
      aria-label={chrome.language}
    >
      {localeOptions.map((option) => {
        const active = option.id === locale;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setLocale(option.id)}
            className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition ${
              active ? "bg-accent text-space" : "text-muted hover:text-ink"
            }`}
          >
            {option.id === "en" ? "EN" : "PT"}
          </button>
        );
      })}
    </div>
  );
}
