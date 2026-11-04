"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { StudyPending } from "@/components/study-gate";
import { useMockAuth } from "@/components/mock-auth-provider";
import { sessionIsAdmin } from "@/lib/mock-auth";
import { useStudentView } from "@/lib/student-view";

export function AdminGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { ready, session } = useMockAuth();
  const { studentView } = useStudentView();
  const allowed = ready && sessionIsAdmin(session) && !studentView;

  useEffect(() => {
    if (!ready || !session) return;
    if (!sessionIsAdmin(session) || studentView) router.replace("/study");
  }, [ready, session, studentView, router]);

  if (!allowed) return <StudyPending />;
  return children;
}
