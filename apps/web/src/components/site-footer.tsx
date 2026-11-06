"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { chromeCopy } from "@/lib/locale";
import { useLocale } from "@/components/locale-provider";

/**
 * One screen of content, then the footer.
 * This scroller stays a block. A flex column lets min-h-full shrink and parks the footer mid-page.
 */
export function PageScroll({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const node = scroller?.querySelector("footer");
    if (!scroller || !(node instanceof HTMLElement)) return;

    let frame = 0;
    const apply = () => {
      const rect = node.getBoundingClientRect();
      const visible =
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
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
    scroller.addEventListener("scroll", schedule);
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      scroller.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.documentElement.style.removeProperty("--site-footer-overlap");
    };
  }, []);

  return (
    <div
      ref={scrollerRef}
      className={`min-h-0 flex-1 overflow-y-auto ${className}`.trim()}
    >
      <div className="min-h-full">{children}</div>
      <SiteFooter />
    </div>
  );
}

function SiteFooter() {
  const { locale } = useLocale();

  return (
    <footer className="site-footer-anchor relative z-30 shrink-0 border-t border-line bg-white px-6 py-4 text-center text-xs leading-relaxed text-muted">
      {chromeCopy[locale].footer}
    </footer>
  );
}
