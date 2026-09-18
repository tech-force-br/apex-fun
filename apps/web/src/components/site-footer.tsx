"use client";

import { chromeCopy } from "@/lib/locale";
import { useLocale } from "@/components/locale-provider";

export function SiteFooter() {
  const { locale } = useLocale();

  return (
    <footer className="relative z-10 px-6 py-8 text-center text-xs leading-relaxed text-muted">
      {chromeCopy[locale].footer}
    </footer>
  );
}
