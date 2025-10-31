// src/pages/Admin/Log.tsx
import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

// Tipo “elastico” per tollerare sia lo schema nuovo (items) che quello vecchio (logs)
type Row = {
  id?: number | string;
  ts?: string | null;
  level?: "info" | "warn" | "error" | string;
  event?: string | null;
  message?: string | null;
  line?: string | null;
};

// Piccolo helper che chiama l’endpoint nativo senza dipendere da lib/api
async function fetchLogs(page: number, level: string) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (level) params.set("level", level);
  const res = await fetch(`/api/admin/logs?${params.toString()}`, { credentials: "include" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<{ items?: Row[]; logs?: Row[]; total?: number }>;
}

export default function AdminLogPage() {
  const [level, setLevel] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const r = await fetchLogs(page, level);
        const list = Array.isArray(r.items) ? r.items : Array.isArray(r.logs) ? r.logs : [];
        if (!alive) return;

        // normalizza: crea id progressivo se mancante, mappa campi line->message
        const normalized: Row[] = list.map((it, idx) => ({
          id: it.id ?? idx + 1 + (page - 1) * list.length,
          ts: it.ts ?? null,
          level: (it.level as any) ?? "info",
          event: it.event ?? null,
          message: it.message ?? it.line ?? "",
          line: undefined,
        }));

        setRows(normalized);
        setTotal(Number(r.total ?? normalized.length));
      } catch {
        if (!alive) return;
        setRows([]);
        setTotal(0);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [page, level]);

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Log di sistema</CardTitle>

            <div className="flex items-center gap-2">
              <Select value={level} onValueChange={(v) => { setPage(1); setLevel(v); }}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Tutti i livelli" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tutti</SelectItem>
                  <SelectItem value="info">info</SelectItem>
                  <SelectItem value="warn">warn</SelectItem>
                  <SelectItem value="error">error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="py-2 pr-4">#</th>
                    <th className="py-2 pr-4">Timestamp</th>
                    <th className="py-2 pr-4">Livello</th>
                    <th className="py-2 pr-4">Evento</th>
                    <th className="py-2">Messaggio</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={String(r.id)} className="border-t">
                      <td className="py-2 pr-4">{r.id}</td>
                      <td className="py-2 pr-4">{r.ts ?? "—"}</td>
                      <td className="py-2 pr-4">
                        <span
                          className={
                            "inline-flex rounded-md px-2 py-0.5 text-xs font-medium " +
                            (r.level === "error"
                              ? "bg-red-100 text-red-700"
                              : r.level === "warn"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-700")
                          }
                        >
                          {r.level}
                        </span>
                      </td>
                      <td className="py-2 pr-4">{r.event ?? "—"}</td>
                      <td className="py-2">{r.message && String(r.message).trim() ? r.message : "—"}</td>
                    </tr>
                  ))}
                  {!loading && rows.length === 0 && (
                    <tr>
                      <td className="py-6 text-center text-muted-foreground" colSpan={5}>
                        Nessun elemento
                      </td>
                    </tr>
                  )}
                  {loading && (
                    <tr>
                      <td className="py-6 text-center text-muted-foreground" colSpan={5}>
                        Caricamento…
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* paginazione semplice */}
            <div className="mt-4 flex items-center justify-between text-sm">
              <div>Totale: {total}</div>
              <div className="flex gap-2">
                <button
                  className="rounded-md border px-3 py-1 disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || loading}
                >
                  ← Prec
                </button>
                <span>Pag. {page}</span>
                <button
                  className="rounded-md border px-3 py-1 disabled:opacity-50"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={rows.length === 0 || loading}
                >
                  Succ →
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}