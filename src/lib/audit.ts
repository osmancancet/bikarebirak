import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";

export type AuditAction =
  | "couple.created"
  | "couple.updated"
  | "couple.deleted"
  | "photo.deleted"
  | "cover.uploaded"
  | "vendor.created"
  | "vendor.updated"
  | "vendor.deleted";

export interface AuditDetails {
  couple_id?: string;
  couple_label?: string;
  slug?: string;
  note?: string;
}

/**
 * Admin eylemini audit_log koleksiyonuna yazar.
 * Hata fırlatmaz — audit bir yan etki, asıl eylemi engellemez.
 */
export async function logAdminAction(
  action: AuditAction,
  details: AuditDetails = {}
): Promise<void> {
  try {
    await getAdminDb()
      .collection("audit_log")
      .add({
        action,
        ...details,
        performed_at: FieldValue.serverTimestamp(),
      });
  } catch (error) {
    console.error("logAdminAction error:", error);
  }
}

export interface AuditEntry {
  id: string;
  action: AuditAction;
  couple_id: string | null;
  couple_label: string | null;
  slug: string | null;
  note: string | null;
  performed_at: string;
}

/** Son N audit kaydını getirir. */
export async function getAuditEntries(limit = 100): Promise<AuditEntry[]> {
  try {
    const snap = await getAdminDb().collection("audit_log").get();
    const items = snap.docs.map((doc) => {
      const d = doc.data();
      const ts = d.performed_at as { toDate?: () => Date } | null;
      return {
        id: doc.id,
        action: d.action as AuditAction,
        couple_id: d.couple_id ?? null,
        couple_label: d.couple_label ?? null,
        slug: d.slug ?? null,
        note: d.note ?? null,
        performed_at: ts?.toDate
          ? ts.toDate().toISOString()
          : new Date().toISOString(),
      };
    });
    items.sort((a, b) => b.performed_at.localeCompare(a.performed_at));
    return items.slice(0, limit);
  } catch (error) {
    console.error("getAuditEntries error:", error);
    return [];
  }
}
