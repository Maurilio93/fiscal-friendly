// src/pages/Admin/components/AdminLayout.tsx
import { NavLink } from "react-router-dom";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Mini-nav admin */}
      <div className="mb-6 flex items-center gap-4 text-sm">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            isActive ? "font-semibold" : "text-muted-foreground hover:text-foreground"
          }
        >
          Dashboard
        </NavLink>
        <span className="text-muted-foreground">•</span>
        <NavLink
          to="/admin/ordini"
          className={({ isActive }) =>
            isActive ? "font-semibold" : "text-muted-foreground hover:text-foreground"
          }
        >
          Ordini
        </NavLink>
        <span className="text-muted-foreground">•</span>
        <NavLink
          to="/admin/utenti"
          className={({ isActive }) =>
            isActive ? "font-semibold" : "text-muted-foreground hover:text-foreground"
          }
        >
          Utenti
        </NavLink>
        <span className="text-muted-foreground">•</span>
        <NavLink
          to="/admin/log"
          className={({ isActive }) =>
            isActive ? "font-semibold" : "text-muted-foreground hover:text-foreground"
          }
        >
          Log
        </NavLink>
      </div>

      {children}
    </div>
  );
}