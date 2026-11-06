"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { StudyHeader } from "@/components/study-header";
import { useLocale } from "@/components/locale-provider";
import { useMockAuth } from "@/components/mock-auth-provider";
import { chromeCopy } from "@/lib/locale";

export default function SignedInLayout({ children }: LayoutProps<"/">) {
  const router = useRouter();
  const { locale } = useLocale();
  const { ready, session } = useMockAuth();

  useEffect(() => {
    if (ready && !session) router.replace("/");
  }, [ready, session, router]);

  if (!ready || !session) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto">
        <main
          className="relative flex min-h-full items-center justify-center px-6 py-12"
          aria-busy="true"
        >
          <p className="text-sm text-muted">{chromeCopy[locale].loading}</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <StudyHeader />
      <div className="relative min-h-0 flex-1 overflow-y-auto">
        <div className="min-h-full">{children}</div>
        <SiteFooter />
      </div>
    </div>
  );
}
