"use client";

import { SegmentedControl } from "@/components/segmented-control";
import { useLocale } from "@/components/locale-provider";
import { chromeCopy } from "@/lib/locale";

export function StudentViewToggle({
  studentView,
  onChange,
}: {
  studentView: boolean;
  onChange: (studentView: boolean) => void;
}) {
  const { locale } = useLocale();
  const chrome = chromeCopy[locale];

  return (
    <SegmentedControl
      variant="pill"
      aria-label={chrome.studentView}
      value={studentView ? "student" : "owner"}
      onChange={(next) => onChange(next === "student")}
      options={[
        { value: "owner", label: chrome.admin },
        { value: "student", label: chrome.studyMap },
      ]}
    />
  );
}
