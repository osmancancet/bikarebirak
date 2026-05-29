import { getAllCouples } from "@/lib/queries";
import { CreateCoupleForm } from "./CreateCoupleForm";
import { CouplesSearch } from "./CouplesSearch";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const couples = await getAllCouples();

  return (
    <div className="space-y-10">
      <CreateCoupleForm />

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-medium">
          <Users className="h-5 w-5 text-gold" />
          Çiftler ({couples.length})
        </h2>
        <CouplesSearch couples={couples} />
      </section>
    </div>
  );
}
