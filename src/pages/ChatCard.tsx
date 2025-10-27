import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatCard() {
  const apriChat = () => {
    // Sostituisci con il tuo numero (senza spazi o simboli)
    const phone = "393471234567";
    const text = encodeURIComponent("Ciao! Ho bisogno di assistenza.");
    const url = `https://wa.me/${phone}?text=${text}`;
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-2xl p-6 text-center">
      <div className="bg-[#0D3B66] w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
        <MessageCircle className="text-white w-8 h-8" />
      </div>
      <h2 className="text-xl font-semibold mb-1">Chatta in diretta</h2>
      <p className="text-gray-500 mb-2">Supporto immediato</p>
      <span className="inline-block bg-emerald-400 text-white text-sm px-3 py-1 rounded-full mb-3">
        Online
      </span>
      <p className="text-gray-600 mb-5">
        Assistenza in tempo reale<br />per abbonati premium
      </p>
      <Button
        onClick={apriChat}
        className="w-full"
        style={{ backgroundColor: "#FF6B6B", color: "white" }}
      >
        Apri Chat
      </Button>
    </div>
  );
}
