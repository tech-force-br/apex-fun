"use client";

import { useEffect, useLayoutEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { StudyPending } from "@/components/study-gate";
import { useMockAuth } from "@/components/mock-auth-provider";
import { sessionIsAdmin } from "@/lib/mock-auth";
import {
  restoreStudentViewAfterAdmin,
  suspendStudentViewForAdmin,
} from "@/lib/student-view";

export function AdminGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { ready, session } = useMockAuth();
  const isAdmin = sessionIsAdmin(session);

  // The builder is owner mode. The pill returns when this gate unmounts.
  useLayoutEffect(() => {
    suspendStudentViewForAdmin();
    return restoreStudentViewAfterAdmin;
  }, []);

  useEffect(() => {
    if (!ready || !session) return;
    if (!isAdmin) router.replace("/study");
  }, [ready, session, isAdmin, router]);

  if (!ready || !session || !isAdmin) return <StudyPending />;
  return children;
}
