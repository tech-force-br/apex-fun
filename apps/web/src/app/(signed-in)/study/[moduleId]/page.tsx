import { StudyDrillTransition } from "@/components/study-drill-transition";
import { StudyModuleView } from "@/components/study-module-view";

export const metadata = {
  title: "Study · ApexFun",
};

export default function StudyModulePage() {
  return (
    <StudyDrillTransition>
      <StudyModuleView />
    </StudyDrillTransition>
  );
}
