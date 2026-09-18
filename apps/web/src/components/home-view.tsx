"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth-card";
import { useMockAuth } from "@/components/mock-auth-provider";
import { studyCopy } from "@/lib/study-copy";
import { useLocale } from "@/components/locale-provider";

export function HomeView() {
  const router = useRouter();
  const { locale } = useLocale();
  const { ready, session } = useMockAuth();

  useEffect(() => {
    if (ready && session) router.replace("/study");
  }, [ready, session, router]);

  if (!ready || session) {
    return (
      <main
        className="relative flex flex-1 items-center justify-center px-6 py-12"
        aria-busy="true"
      >
        {session ? (
          <p className="text-sm text-muted">{studyCopy[locale].loading}</p>
        ) : null}
      </main>
    );
  }

  return (
    <main className="relative flex flex-1 items-center justify-center px-6 py-12">
      <AuthCard />
    </main>
  );
}
