// src/pages/AreaUtenti/components/UserLayout.tsx
import { NavLink } from "react-router-dom";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Mini-nav utente */}
      <div className="mb-6 flex items-center gap-4 text-sm">
        <NavLink
          to="/area-utenti"
          end
          className={({ isActive }) =>
            isActive ? "font-semibold" : "text-muted-foreground hover:text-foreground"
          }
        >
          Panoramica
        </NavLink>
        <span className="text-muted-foreground">•</span>
        <NavLink
          to="/area-utenti/ordini"
          className={({ isActive }) =>
            isActive ? "font-semibold" : "text-muted-foreground hover:text-foreground"
          }
        >
          Ordini
        </NavLink>
        <span className="text-muted-foreground">•</span>
        <NavLink
          to="/area-utenti/documenti"
          className={({ isActive }) =>
            isActive ? "font-semibold" : "text-muted-foreground hover:text-foreground"
          }
        >
          Documenti
        </NavLink>
      </div>

      {children}
    </div>
  );
}