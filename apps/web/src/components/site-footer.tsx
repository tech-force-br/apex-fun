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

    let frame = 0;
    const apply = () => {
      const rect = node.getBoundingClientRect();
      const visible =
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      document.documentElement.style.setProperty(
        "--site-footer-height",
        `${node.offsetHeight}px`,
      );
      document.documentElement.style.setProperty(
        "--site-footer-overlap",
        `${Math.max(0, visible)}px`,
      );
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(apply);
    };
    apply();
    const observer = new ResizeObserver(schedule);
    observer.observe(node);
    window.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      document.documentElement.style.removeProperty("--site-footer-height");
      document.documentElement.style.removeProperty("--site-footer-overlap");
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="site-footer-anchor relative z-30 shrink-0 border-t border-line bg-white px-6 py-4 text-center text-xs leading-relaxed text-muted"
    >
      {chromeCopy[locale].footer}
    </footer>
  );
}
