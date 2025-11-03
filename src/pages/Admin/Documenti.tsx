import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Doc = {
  id: string;
  user_id: string;
  label: string;
  file_url: string;
  mime_type?: string;
  size_bytes?: number;
  uploaded_at?: string;
  reviewed?: 0 | 1;
  note?: string | null;
  order_id?: string | null;
};

type User = {
  id: string;
  name: string | null;
  email: string;
};

export default function AdminDocumenti() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Recupera tutti gli utenti e tutti i documenti
    Promise.all([
      fetch("/api/admin/users?limit=1000", { credentials: "include" }).then(r => r.json()),
    ]).then(async ([usersRes]) => {
      const users = usersRes.users || [];
      const usersMap: Record<string, User> = {};
      users.forEach((u: User) => { usersMap[u.id] = u; });
      setUsersMap(usersMap);

      // Per ogni utente, recupera i documenti (promise in parallelo)
      const allDocs = await Promise.all(users.map((u: User) =>
        fetch(`/api/admin/users/${u.id}/documents`, { credentials: "include" })
          .then(r => r.json())
          .then(j => Array.isArray(j.documents) ? j.documents.map((d: any) => ({ ...d, user_id: u.id })) : [])
      ));
      setDocs(allDocs.flat());
      setLoading(false);
    });
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Documenti utenti</h1>
        <Card>
          <CardHeader>
            <CardTitle>Lista documenti caricati dagli utenti</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Caricamento…</div>
            ) : docs.length === 0 ? (
              <div>Nessun documento caricato.</div>
            ) : (
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="py-2 pr-2">Utente</th>
                      <th className="py-2 pr-2">Email</th>
                      <th className="py-2 pr-2">Etichetta</th>
                      <th className="py-2 pr-2">Data</th>
                      <th className="py-2">File</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map((d) => (
                      <tr key={d.id}>
                        <td className="py-2 pr-2">{usersMap[d.user_id]?.name ?? "—"}</td>
                        <td className="py-2 pr-2">{usersMap[d.user_id]?.email ?? "—"}</td>
                        <td className="py-2 pr-2">{d.label}</td>
                        <td className="py-2 pr-2">{d.uploaded_at?.slice(0,16).replace("T"," ") ?? ""}</td>
                        <td className="py-2">
                          <a href={d.file_url} target="_blank" rel="noreferrer" className="underline text-blue-700">Scarica</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}