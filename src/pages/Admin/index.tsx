import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { adminListOrders, adminListUsers, AdminOrder, AdminUser } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminHome() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [o, u] = await Promise.all([adminListOrders(1, ""), adminListUsers(1, "")]);
        setOrders(o.orders.slice(0, 5));
        setUsers(u.users.slice(0, 5));
      } catch {/* no-op */}
    })();
  }, []);

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Ultimi ordini</CardTitle></CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              {orders.map(o => (
                <li key={o.orderCode} className="flex justify-between">
                  <span>#{o.orderCode}</span>
                  <span className="text-muted-foreground">{o.status}</span>
                </li>
              ))}
              {!orders.length && <li className="text-muted-foreground">Nessun ordine</li>}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Ultimi utenti</CardTitle></CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              {users.map(u => (
                <li key={u.id} className="flex justify-between">
                  <span>{u.email}</span>
                  <span className="text-muted-foreground">{u.role}</span>
                </li>
              ))}
              {!users.length && <li className="text-muted-foreground">Nessun utente</li>}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}