import React from "react";

export default function BillingDetailsModal({
  open, onClose, billing
}: {
  open: boolean;
  onClose: () => void;
  billing: any;
}) {
  if (!open || !billing) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 min-w-[320px] relative shadow-lg">
        <button
          onClick={onClose}
          aria-label="Chiudi modale"
          className="absolute right-3 top-3 text-lg font-bold"
        >×</button>
        <div className="mb-4 text-lg font-semibold">Dati Fatturazione</div>
        <div className="space-y-1 text-sm">
          <div><strong>Tipo:</strong> {billing.type === "company" ? "Impresa" : "Persona fisica"}</div>
          {billing.fullName && <div><strong>Nome:</strong> {billing.fullName}</div>}
          {billing.companyName && <div><strong>Ragione Sociale:</strong> {billing.companyName}</div>}
          {billing.cf && <div><strong>Cod. Fiscale:</strong> {billing.cf}</div>}
          {billing.vatNumber && <div><strong>P.IVA:</strong> {billing.vatNumber}</div>}
          {billing.address && <div><strong>Indirizzo:</strong> {billing.address}</div>}
          {billing.zip && <div><strong>CAP:</strong> {billing.zip}</div>}
          {billing.city && <div><strong>Città:</strong> {billing.city}</div>}
          {billing.province && <div><strong>Provincia:</strong> {billing.province}</div>}
          {billing.email && <div><strong>Email:</strong> {billing.email}</div>}
          {billing.country && <div><strong>Paese:</strong> {billing.country}</div>}
        </div>
      </div>
    </div>
  );
}