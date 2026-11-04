import { AdminGate } from "@/components/admin-gate";
import { AdminView } from "@/components/admin-view";

export const metadata = {
  title: "Admin · ApexFun",
};

export default function AdminPage() {
  return (
    <AdminGate>
      <AdminView />
    </AdminGate>
  );
}
