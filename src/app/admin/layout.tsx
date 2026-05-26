import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { logoutAction } from "./actions";
import { LogOut, LayoutDashboard } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login sayfasının kendisi guard'dan muaf olmalı.
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "";
  const isLoginPage = pathname.endsWith("/admin/login");

  const authed = await isAdminAuthenticated();

  if (!authed && !isLoginPage) {
    redirect("/admin/login");
  }

  if (!authed) {
    // Login sayfası: çerçeve olmadan göster
    return <>{children}</>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-beige bg-white/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 font-serif text-xl text-gold-gradient"
          >
            <LayoutDashboard className="h-5 w-5 text-gold" />
            BiKareBırak · Yönetim
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-ink-soft transition-colors hover:bg-ivory hover:text-ink"
            >
              <LogOut className="h-4 w-4" />
              Çıkış
            </button>
          </form>
        </div>
      </header>
      <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">{children}</div>
    </div>
  );
}
