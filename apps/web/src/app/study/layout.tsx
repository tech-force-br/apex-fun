"use client";

import type { ReactNode } from "react";
import { SignedInFrame } from "@/components/signed-in-frame";

export default function StudyLayout({ children }: { children: ReactNode }) {
  return <SignedInFrame>{children}</SignedInFrame>;
}
