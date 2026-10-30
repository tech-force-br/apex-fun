import { StudyDrillTransition } from "@/components/study-drill-transition";
import { StudyView } from "@/components/study-view";

export const metadata = {
  title: "Study · ApexFun",
};

export default function StudyPage() {
  return (
    <StudyDrillTransition>
      <StudyView />
    </StudyDrillTransition>
  );
}
