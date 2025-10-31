import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";

type Doc = {
  id: string;
  label: string;
  file_url: string;
  mime_type?: string;
  size_bytes?: number;
  uploaded_at?: string;
  reviewed?: 0 | 1;
  note?: string | null;
};

export default function AreaUtentiDocumenti() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // form
  const [label, setLabel] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/me/documents", { credentials: "include" });
      const j = await r.json();
      setDocs(Array.isArray(j.documents) ? j.documents : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);

    if (!file) {
      setErr("Seleziona un file.");
      return;
    }
    if (!label.trim()) {
      setErr("Inserisci un'etichetta.");
      return;
    }

    const fd = new FormData();
    fd.append("label", label.trim());
    if (orderCode.trim()) fd.append("orderCode", orderCode.trim());
    fd.append("file", file);

    setSending(true);
    try {
      const res = await fetch("/api/me/documents", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const j = await res.json();
      if (!res.ok || j?.error) {
        setErr(j?.error || "Upload non riuscito");
      } else {
        setOk("Documento caricato correttamente.");
        setLabel("");
        setOrderCode("");
        setFile(null);
        await load();
      }
    } catch {
      setErr("Errore di rete.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Lista */}
      <div className="lg:col-span-3">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>I tuoi documenti</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-sm text-muted-foreground">Caricamento…</div>
            ) : docs.length === 0 ? (
              <div className="text-sm text-muted-foreground">Nessun documento caricato.</div>
            ) : (
              <ul className="space-y-3">
                {docs.map((d) => (
                  <li key={d.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-muted p-2">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{d.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {d.uploaded_at?.slice(0,16).replace("T"," ") ?? ""} · {d.mime_type ?? ""} · {(d.size_bytes ?? 0) > 0 ? `${Math.round((d.size_bytes as number)/1024)} KB` : ""}
                          {d.reviewed ? " · Verificato" : ""}
                        </div>
                      </div>
                    </div>
                    <a
                      href={d.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm underline hover:opacity-80"
                    >
                      Apri
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upload */}
      <div className="lg:col-span-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Carica documento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="label">Etichetta</Label>
                <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Es. Documento identità" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Ordine (opzionale)</Label>
                <Input id="order" value={orderCode} onChange={(e) => setOrderCode(e.target.value)} placeholder="OrderCode se vuoi collegarlo" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">File (PDF / Immagini)</Label>
                <Input
                  id="file"
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </div>

              {err && <div className="text-sm text-red-600">{err}</div>}
              {ok && <div className="text-sm text-green-600">{ok}</div>}

              <Button type="submit" disabled={sending} className="bg-gradient-hero hover:opacity-90">
                {sending ? "Caricamento..." : "Carica"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}