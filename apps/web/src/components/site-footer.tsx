"use client";

import { useLayoutEffect, useRef } from "react";
import { chromeCopy } from "@/lib/locale";
import { useLocale } from "@/components/locale-provider";

export function SiteFooter() {
  const { locale } = useLocale();
  const footerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const node = footerRef.current;
    if (!node) return;

    const apply = () => {
      document.documentElement.style.setProperty(
        "--site-footer-height",
        `${node.offsetHeight}px`,
      );
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(node);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--site-footer-height");
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative z-30 shrink-0 border-t border-white/10 px-6 py-4 text-center text-xs leading-relaxed text-muted"
    >
      {chromeCopy[locale].footer}
    </footer>
  );
}
