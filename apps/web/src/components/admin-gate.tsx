"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { StudyPending } from "@/components/study-gate";
import { useMockAuth } from "@/components/mock-auth-provider";
import { useUnlockAll } from "@/lib/student-view";

export function AdminGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { ready, session } = useMockAuth();
  const unlockAll = useUnlockAll();
  const allowed = ready && unlockAll;

  useEffect(() => {
    if (!ready || !session) return;
    if (!unlockAll) router.replace("/study");
  }, [ready, session, unlockAll, router]);

  if (!allowed) return <StudyPending />;
  return children;
}
