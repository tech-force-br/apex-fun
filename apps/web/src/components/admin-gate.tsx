"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { StudyPending } from "@/components/study-gate";
import { useMockAuth } from "@/components/mock-auth-provider";
import { sessionIsAdmin } from "@/lib/mock-auth";

export function AdminGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { ready, session } = useMockAuth();
  const isAdmin = sessionIsAdmin(session);

  useEffect(() => {
    if (!ready || !session) return;
    if (!isAdmin) router.replace("/study");
  }, [ready, session, isAdmin, router]);

  if (!ready || !session || !isAdmin) return <StudyPending />;
  return children;
}
