import { StudyCardView } from "@/components/study-card-view";
import { StudyDrillTransition } from "@/components/study-drill-transition";

export const metadata = {
  title: "Study · ApexFun",
};

export default function StudyCardPage() {
  return (
    <StudyDrillTransition>
      <StudyCardView />
    </StudyDrillTransition>
  );
}
