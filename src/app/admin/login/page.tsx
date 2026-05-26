"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, Label } from "@/components/ui/card";
import { Lock } from "lucide-react";

const initial: ActionState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initial);

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-20">
      <Card className="w-full max-w-sm p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-ivory text-gold">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-medium">Yönetici Girişi</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Bu alana yalnızca sistem yöneticisi erişebilir.
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
            />
          </div>

          {state.error && (
            <p className="text-sm text-rose-gold">{state.error}</p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? "Kontrol ediliyor…" : "Giriş Yap"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
