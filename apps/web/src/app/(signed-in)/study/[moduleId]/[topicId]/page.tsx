import { StudyDrillTransition } from "@/components/study-drill-transition";
import { StudyTopicView } from "@/components/study-topic-view";

export const metadata = {
  title: "Study · ApexFun",
};

export default function StudyTopicPage() {
  return (
    <StudyDrillTransition>
      <StudyTopicView />
    </StudyDrillTransition>
  );
}
