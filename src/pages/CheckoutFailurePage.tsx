import { useEffect } from "react";
import { useCart } from "@/cart/CartContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle, ShoppingCart, Home } from "lucide-react";

export default function CheckoutFailurePage() {
  const { restoreFromSnapshot } = useCart();

  // Se avevi salvato uno snapshot prima del redirect, qui lo ripristini
  useEffect(() => { restoreFromSnapshot(); }, [restoreFromSnapshot]);

  const p = new URLSearchParams(window.location.search);
  const reason = p.get("reason") ?? "Pagamento annullato o non riuscito";

  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <div className="rounded-2xl border bg-card shadow-elegant p-8 text-center space-y-6">
        <div className="flex justify-center">
          <XCircle className="h-14 w-14 text-red-600" />
        </div>

        <h1 className="text-3xl font-bold">Pagamento non riuscito</h1>
        <p className="text-muted-foreground">{reason}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/cart">
            <Button className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Torna al carrello
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          Se pensi di aver pagato correttamente, controlla tra poco la tua <Link to="/area-utenti" className="underline">Area Utenti</Link>.
        </p>
      </div>
    </div>
  );
}
