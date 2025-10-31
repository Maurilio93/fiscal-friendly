import { ReactNode } from "react";
import { Link, Outlet } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  title?: string;
  subtitle?: string;
  tabs?: ReactNode;
};

export default function UserLayout({ title = "Area Utenti", subtitle, tabs }: Props) {
  return (
    <div className="min-h-[70vh] bg-muted/30">
      {/* breadcrumb */}
      <div className="w-full border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Miniconsulenze</Link>
          <span>›</span>
          <span className="text-foreground">Area Utenti</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>

        {tabs}

        <Card className="shadow-elegant mt-6">
          <CardContent className="p-6">
            {/* qui entrano /area-utenti, /area-utenti/ordini, /area-utenti/documenti */}
            <Outlet />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}