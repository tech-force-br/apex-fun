"use client";

import { useParams } from "next/navigation";
import { StudyPending, useStudyGate } from "@/components/study-gate";

/** A topic address has no page of its own. The gate opens its doing card. */
export function StudyTopicView() {
  const params = useParams<{ moduleId: string; topicId: string }>();
  useStudyGate({
    moduleId: params.moduleId,
    topicId: params.topicId,
  });

  return <StudyPending />;
}
