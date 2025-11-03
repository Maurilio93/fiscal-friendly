import { useEffect, useState } from "react";
import { adminListUsers, AdminUser } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Doc = {
  id: string;
  label: string;
  file_url: string;
};

export default function AdminUtenti() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [documentsByUser, setDocumentsByUser] = useState<Record<string, Doc[]>>({});
  const [loadingDocs, setLoadingDocs] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await adminListUsers(page, q);
      setRows(r.users);
      setTotal(r.total);

      // Carica documenti per ogni utente
      setLoadingDocs(true);
      const docEntries = await Promise.all(
        r.users.map(async (u: AdminUser) => {
          const docsRes = await fetch(`/api/admin/users/${u.id}/documents`, { credentials: "include" });
          const docsData = await docsRes.json();
          return [u.id, docsData.documents ?? []] as [string, Doc[]];
        })
      );
      setDocumentsByUser(Object.fromEntries(docEntries));
      setLoadingDocs(false);
    })();
  }, [q, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card>
        <CardHeader><CardTitle>Utenti</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Cerca per nome/email…" value={q} onChange={e => {setPage(1); setQ(e.target.value);}} />
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left border-b">
                <tr>
                  <th className="py-2 pr-2">Email</th>
                  <th className="py-2 pr-2">Nome</th>
                  <th className="py-2">Documenti</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(u => (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="py-2 pr-2">{u.email}</td>
                    <td className="py-2 pr-2">{u.name ?? "—"}</td>
                    <td className="py-2">
                      {loadingDocs
                        ? "Caricamento…"
                        : (documentsByUser[u.id]?.length
                          ? documentsByUser[u.id].map((doc, i, arr) =>
                              <span key={doc.id}>
                                <a
                                  href={doc.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline text-blue-700"
                                >
                                  {doc.label || "file"}
                                </a>
                                {i < arr.length - 1 ? ", " : ""}
                              </span>
                            )
                          : "—"
                        )
                      }
                    </td>
                  </tr>
                ))}
                {!rows.length && (
                  <tr><td colSpan={3} className="py-6 text-center text-muted-foreground">Nessun risultato</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Totale: {total}</span>
            <div className="space-x-2">
              <button className="px-3 py-1 rounded border" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Prev</button>
              <button className="px-3 py-1 rounded border" onClick={()=>setPage(p=>p+1)}>Next</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}