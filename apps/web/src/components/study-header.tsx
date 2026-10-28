"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import { LanguageToggle } from "@/components/language-toggle";
import { useLocale } from "@/components/locale-provider";
import { useMockAuth } from "@/components/mock-auth-provider";
import { chromeCopy } from "@/lib/locale";
import { studyChromeWidth } from "@/lib/study-route";

export function StudyHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useLocale();
  const { session, signOut } = useMockAuth();
  const chrome = chromeCopy[locale];
  const admin = pathname.startsWith("/admin");
  const wide = studyChromeWidth(pathname) === "wide";
  const headerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const node = headerRef.current;
    if (!node) {
      document.documentElement.style.removeProperty("--study-header-height");
      return;
    }
    const apply = () => {
      document.documentElement.style.setProperty(
        "--study-header-height",
        `${node.offsetHeight}px`,
      );
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(node);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--study-header-height");
    };
  }, [session]);

  if (!session) return null;

  function onSignOut() {
    signOut();
    router.replace("/");
  }

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-20 border-b border-line bg-white/90 backdrop-blur-md"
    >
      <div
        className={`mx-auto flex w-full flex-wrap items-center justify-between gap-3 px-6 py-4 ${
          wide ? "max-w-6xl" : "max-w-3xl"
        }`}
      >
        <Link
          href="/study"
          className="cursor-pointer text-xl font-bold tracking-tight text-accent-deep"
        >
          {chrome.wordmark}
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <LanguageToggle />
          <Link
            href={admin ? "/study" : "/admin"}
            className="cursor-pointer text-sm font-bold text-accent-deep hover:text-accent"
          >
            {admin ? chrome.studyMap : chrome.admin}
          </Link>
          <p className="text-sm text-muted">{session.email}</p>
          <button
            type="button"
            onClick={onSignOut}
            className="cursor-pointer rounded-md border border-line bg-white px-3 py-1.5 text-sm font-bold text-ink hover:bg-space"
          >
            {chrome.signOut}
          </button>
        </div>
      </div>
    </header>
  );
}
