import { useEffect, useState } from "react";
import UserLayout from "../components/UserLayout";

type Doc = { id: string; label: string; url: string; created_at?: string };

export default function AreaUtentiDocumenti() {
  const [docs, setDocs] = useState<Doc[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/me/documents", { credentials: "include" });
        if (r.ok) {
          const j = await r.json();
          setDocs(Array.isArray(j.documents) ? j.documents : []);
        }
      } catch {/* noop */}
    })();
  }, []);

  return (
    <UserLayout>
      <div className="rounded-xl border p-5">
        <h2 className="text-lg font-semibold mb-4">I tuoi documenti</h2>
        <ul className="space-y-3">
          {docs.map(d => (
            <li key={d.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <div className="font-medium">{d.label}</div>
                <div className="text-xs text-muted-foreground">{d.created_at?.replace("T"," ").slice(0,16) ?? "—"}</div>
              </div>
              <a href={d.url} target="_blank" rel="noreferrer" className="underline">Apri</a>
            </li>
          ))}
          {!docs.length && <li className="text-muted-foreground">Nessun documento caricato</li>}
        </ul>
      </div>
    </UserLayout>
  );
}