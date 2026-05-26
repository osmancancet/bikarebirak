import Link from "next/link";
import { getAllCouples } from "@/lib/queries";
import { CreateCoupleForm } from "./CreateCoupleForm";
import { Card } from "@/components/ui/card";
import { formatWeddingDate } from "@/lib/utils";
import { Calendar, ChevronRight, Users } from "lucide-react";

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

        {couples.length === 0 ? (
          <Card className="p-8 text-center text-ink-soft">
            Henüz çift eklenmedi. Yukarıdaki formdan ilk çifti oluşturun.
          </Card>
        ) : (
          <div className="space-y-3">
            {couples.map((c) => (
              <Link key={c.id} href={`/admin/${c.id}`}>
                <Card className="flex items-center justify-between p-5 transition-colors hover:bg-ivory">
                  <div>
                    <p className="text-xl font-medium">
                      {c.groom_name} & {c.bride_name}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatWeddingDate(c.wedding_date)}
                    </p>
                    <p className="mt-0.5 text-sm text-gold">/{c.slug}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-ink-soft" />
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
