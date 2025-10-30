import React, { useState } from "react";

type BillingPerson = {
  type: "person";
  fullName: string;
  cf: string;
  address: string;
  zip?: string;
  city?: string;
  province?: string;
  country?: string;
  email?: string;
  phone?: string;
};

type BillingCompany = {
  type: "company";
  companyName: string;
  vatNumber: string;
  cf?: string;
  sdi?: string;
  pec?: string;
  address: string;
  zip?: string;
  city?: string;
  province?: string;
  country?: string;
  email?: string;
  phone?: string;
};

export type BillingPayload = BillingPerson | BillingCompany;

export default function BillingModal({
  open,
  onClose,
  onSubmit,
  defaultEmail,
  defaultName,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (billing: BillingPayload) => Promise<void>;
  defaultEmail?: string;
  defaultName?: string;
}) {
  const [tab, setTab] = useState<"person" | "company">("person");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [person, setPerson] = useState<BillingPerson>({
    type: "person",
    fullName: defaultName || "",
    cf: "",
    address: "",
    country: "IT",
    email: defaultEmail || "",
  });

  const [company, setCompany] = useState<BillingCompany>({
    type: "company",
    companyName: "",
    vatNumber: "",
    address: "",
    country: "IT",
    email: defaultEmail || "",
  });

  if (!open) return null;

  const submit = async () => {
    setErr("");
    setLoading(true);
    try {
      if (tab === "person") {
        if (!person.fullName || !person.address || !person.cf) {
          setErr("Compila Nome e cognome, Indirizzo e Codice Fiscale.");
          setLoading(false);
          return;
        }
        await onSubmit(person);
      } else {
        if (!company.companyName || !company.address || !company.vatNumber) {
          setErr("Compila Ragione sociale, Indirizzo e P.IVA.");
          setLoading(false);
          return;
        }
        await onSubmit(company);
      }
    } catch (e: any) {
      setErr(e?.message || "Errore inatteso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Inserisci i tuoi dati per la fatturazione</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </div>

        <div className="mb-4 flex gap-2">
          <button
            className={`px-3 py-2 rounded-lg border ${tab === "person" ? "bg-gray-900 text-white" : ""}`}
            onClick={() => setTab("person")}
          >
            Persona fisica
          </button>
          <button
            className={`px-3 py-2 rounded-lg border ${tab === "company" ? "bg-gray-900 text-white" : ""}`}
            onClick={() => setTab("company")}
          >
            Impresa
          </button>
        </div>

        {tab === "person" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Nome e cognome *" value={person.fullName} onChange={(v) => setPerson(s => ({...s, fullName: v}))}/>
            <Input label="Codice Fiscale *" value={person.cf} onChange={(v) => setPerson(s => ({...s, cf: v.toUpperCase()}))}/>
            <Input label="Indirizzo completo *" className="md:col-span-2" value={person.address} onChange={(v)=> setPerson(s=>({...s, address: v}))}/>
            <Input label="CAP" value={person.zip} onChange={(v)=> setPerson(s=>({...s, zip: v}))}/>
            <Input label="Città" value={person.city} onChange={(v)=> setPerson(s=>({...s, city: v}))}/>
            <Input label="Provincia" value={person.province} onChange={(v)=> setPerson(s=>({...s, province: v.toUpperCase()}))}/>
            <Input label="Email" value={person.email} onChange={(v)=> setPerson(s=>({...s, email: v}))}/>
            <Input label="Paese" value={person.country} onChange={(v)=> setPerson(s=>({...s, country: v.toUpperCase()}))}/>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Ragione sociale *" value={company.companyName} onChange={(v)=> setCompany(s=> ({...s, companyName: v}))}/>
            <Input label="P. IVA *" value={company.vatNumber} onChange={(v)=> setCompany(s=> ({...s, vatNumber: v.toUpperCase()}))}/>
            <Input label="Codice Fiscale (facoltativo)" value={company.cf} onChange={(v)=> setCompany(s=> ({...s, cf: v.toUpperCase()}))}/>
            <Input label="Codice Univoco (facoltativo)" value={company.sdi} onChange={(v)=> setCompany(s=> ({...s, sdi: v.toUpperCase()}))}/>
            <Input label="PEC (facoltativa)" value={company.pec} onChange={(v)=> setCompany(s=> ({...s, pec: v}))}/>
            <Input label="Indirizzo completo *" className="md:col-span-2" value={company.address} onChange={(v)=> setCompany(s=> ({...s, address: v}))}/>
            <Input label="CAP" value={company.zip} onChange={(v)=> setCompany(s=> ({...s, zip: v}))}/>
            <Input label="Città" value={company.city} onChange={(v)=> setCompany(s=> ({...s, city: v}))}/>
            <Input label="Provincia" value={company.province} onChange={(v)=> setCompany(s=> ({...s, province: v.toUpperCase()}))}/>
            <Input label="Email fatturazione" value={company.email} onChange={(v)=> setCompany(s=> ({...s, email: v}))}/>
            <Input label="Paese" value={company.country} onChange={(v)=> setCompany(s=> ({...s, country: v.toUpperCase()}))}/>
          </div>
        )}

        {err && <p className="text-red-600 mt-3">{err}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button className="px-4 py-2 rounded-lg border" onClick={onClose}>Annulla</button>
          <button className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white" disabled={loading} onClick={submit}>
            {loading ? "Invio..." : "Procedi al pagamento"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value?: string;
  className?: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className={`flex flex-col ${className}`}>
      <span className="text-sm mb-1">{label}</span>
      <input
        className="border rounded-lg px-3 py-2"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}