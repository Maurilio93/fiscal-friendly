import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMyOrders, type UserOrder } from "@/lib/api";
import { toast } from "sonner";
import { Package, Calendar, Euro } from "lucide-react";

export default function AreaUtentiOrdini() {
  const [rows, setRows] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      setRows(data.orders || []);
    } catch (error) {
      console.error("Errore caricamento ordini:", error);
      toast.error("Errore nel caricamento degli ordini");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatAmount = (cents: number) => {
    return (cents / 100).toLocaleString("it-IT", {
      style: "currency",
      currency: "EUR"
    });
  };

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Caricamento ordini...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (rows.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            I tuoi Ordini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nessun ordine</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Non hai ancora effettuato nessun acquisto. I tuoi ordini completati appariranno qui.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          I tuoi Ordini ({rows.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop: Tabella */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-sm text-muted-foreground">
                <th className="text-left py-3 px-4 font-medium">Codice Ordine</th>
                <th className="text-left py-3 px-4 font-medium">Data Pagamento</th>
                <th className="text-left py-3 px-4 font-medium">Importo</th>
                <th className="text-left py-3 px-4 font-medium">Stato</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((order) => (
                <tr key={order.orderCode} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-4 px-4">
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {order.orderCode}
                    </code>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    {formatDate(order.paidAt || order.created_at)}
                  </td>
                  <td className="py-4 px-4 font-semibold text-sm">
                    {formatAmount(order.amountCents)}
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="default" className="bg-green-600">
                      ✓ Pagato
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: Card */}
        <div className="md:hidden space-y-4">
          {rows.map((order) => (
            <div key={order.orderCode} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Codice Ordine</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {order.orderCode}
                  </code>
                </div>
                <Badge variant="default" className="bg-green-600">
                  ✓ Pagato
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Data
                  </p>
                  <p className="text-sm font-medium">
                    {formatDate(order.paidAt || order.created_at)}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Euro className="h-3 w-3" />
                    Importo
                  </p>
                  <p className="text-sm font-semibold">
                    {formatAmount(order.amountCents)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}