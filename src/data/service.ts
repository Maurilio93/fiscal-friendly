export type Service = {
  id: string;
  title: string;
  subtitle?: string;
  bullets: string[];
  noteCta: string;
};

export const SERVICES: Service[] = [
  {
    id: "contabilita",
    title: "Contabilità",
    subtitle: "Forfettaria, semplificata e ordinaria per la tua attività",
    bullets: [
      "Regime fiscale forfettario a soli € 25 mensili inclusa consulenza e dichiarativi fiscali.",
      "Regime fiscale in contabilità semplificata:",
      "• Ditte individuali a soli € 75 mensili inclusa consulenza e dichiarativi fiscali;",
      "• Società di persone a soli € 90 mensili inclusa consulenza, tenuta scritture contabili, adempimenti societari e dichiarativi fiscali;",
      "Regime fiscale in contabilità ordinaria:",
      "• Società di persone a soli € 150 mensili inclusa consulenza, tenuta scritture contabili, adempimenti societari e dichiarativi fiscali;",
      "• Società di capitali a soli € 250 mensili inclusa consulenza, tenuta scritture contabili e libri sociali, adempimenti societari e dichiarativi fiscali;",
    ],
    noteCta: "PER ULTERIORI INFO CLICCA QUI…. (inserire nominativo, telefono, mail + spazio per la descrizione)."
  },
  {
    id: "business-plan",
    title: "Business Plan",
    subtitle: "Per valutare la fattibilità dei tuoi investimenti o richiedere un finanziamento",
    bullets: [
      "Business plan triennale per investimenti e/o finanziamenti fino a € 100.000 a soli € 250 oltre IVA;",
      "Business plan triennale per investimenti e/o finanziamenti oltre i € 100.000 inclusa relazione del commercialista a soli € 500 oltre IVA;",
      "Business plan quinquennale per investimenti e/o finanziamenti oltre i € 500.000 inclusa relazione del commercialista a soli € 800 oltre IVA;",
    ],
    noteCta: "PER ULTERIORI INFO CLICCA QUI…. (inserire nominativo, telefono, mail + spazio per la descrizione)."
  },
  {
    id: "analisi-bilanci",
    title: "Analisi di bilanci",
    subtitle: "Per determinare la solidità economico-finanziaria della tua azienda",
    bullets: [
      "Analisi di bilanci con calcolo degli indici di natura finanziaria ed economica completa di relazione del commercialista a soli € 250 oltre IVA;",
      "Analisi di bilanci con calcolo degli indici di natura finanziaria ed economica, flussi di cassa, rendiconto finanziario e calcolo del rating di affidabilità bancaria completa di relazione del commercialista a soli € 400 oltre IVA;",
    ],
    noteCta: "PER ULTERIORI INFO CLICCA QUI…. (inserire nominativo, telefono, mail + spazio per la descrizione)."
  },
  {
    id: "cessione-quote-societarie",
    title: "Cessione quote societarie",
    subtitle: "Solo per società di persone ed SRL di tutta Italia",
    bullets: [
      "Un nostro commercialista abilitato andrà a redigere l’atto di cessione delle quote ed una volta approvato e sottoscritto digitalmente dalle parti andrà registrato all’agenzia delle entrate e depositato alla competente camera di commercio.",
      "Le nostre competenze (esclusi i costi di registrazione e deposito CCIAA), rispetto il più oneroso onorario notarile, ammontano soltanto a € 300."
    ],
    noteCta: "PER ULTERIORI INFO CLICCA QUI…. (inserire nominativo, telefono, mail + spazio per la descrizione)."
  },
];

export const getServiceById = (id: string) => SERVICES.find(s => s.id === id);
