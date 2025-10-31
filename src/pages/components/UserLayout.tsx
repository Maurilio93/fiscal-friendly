import { Link, NavLink, Outlet } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

export default function UserLayout() {
  return (
    <div className="min-h-[70vh] bg-muted/30">
      {/* breadcrumb / topbar */}
      <div className="w-full border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Miniconsulenze</Link>
          <span>›</span>
          <span className="text-foreground">Area Utenti</span>
        </div>
      </div>

      {/* tabs locali */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <nav className="flex gap-4">
          <NavLink
            end
            to="."
            className={({ isActive }) =>
              `pb-3 -mb-px border-b-2 ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`
            }
          >
            Panoramica
          </NavLink>

          <NavLink
            to="ordini"
            className={({ isActive }) =>
              `pb-3 -mb-px border-b-2 ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`
            }
          >
            Ordini
          </NavLink>

          <NavLink
            to="documenti"
            className={({ isActive }) =>
              `pb-3 -mb-px border-b-2 ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`
            }
          >
            Documenti
          </NavLink>
        </nav>
      </div>

      {/* contenuto delle sottopagine */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <Outlet />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}