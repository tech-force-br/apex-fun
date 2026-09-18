"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
      <main
        className="relative flex flex-1 items-center justify-center px-6 py-12"
        aria-busy="true"
      >
        <p className="text-sm text-muted">{chromeCopy[locale].loading}</p>
      </main>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col">
      <StudyHeader />
      {children}
    </div>
  );
}
