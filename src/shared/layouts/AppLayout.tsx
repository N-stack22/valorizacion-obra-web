import { BarChart3, ClipboardCheck, FileText, Gauge, Landmark, LogOut, Menu, Ruler, ShieldCheck, Users } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const links = [
  { to: "/app", label: "Dashboard", icon: Gauge },
  { to: "/app/usuarios", label: "Usuarios y roles", icon: Users },
  { to: "/app/proyectos", label: "Línea base", icon: Landmark },
  { to: "/app/metrados", label: "Metrados", icon: Ruler },
  { to: "/app/valorizaciones", label: "Valorizaciones", icon: ClipboardCheck },
  { to: "/app/reajustes", label: "Reajustes", icon: BarChart3 },
  { to: "/app/expediente", label: "Expediente IA", icon: FileText },
  { to: "/app/liquidacion", label: "Liquidación", icon: ShieldCheck },
];

export function AppLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  async function logout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-72 border-r border-white/10 bg-navy-900/95 p-4 backdrop-blur transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-7 rounded-2xl border border-gold-500/20 bg-gold-500/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-400">JJ&PP Ingenieros</p>
          <h1 className="mt-2 text-lg font-bold leading-tight">Valorización mensual de obra</h1>
          <p className="mt-1 text-xs text-slate-400">MVP con BPM, IA y trazabilidad</p>
        </div>

        <nav className="grid gap-1">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/app"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white",
                  isActive && "bg-gold-500 text-navy-950 hover:bg-gold-400 hover:text-navy-950",
                )
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Button variant="secondary" className="absolute bottom-4 left-4 right-4" onClick={logout}>
          <LogOut size={16} /> Cerrar sesión
        </Button>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-navy-950/85 px-4 backdrop-blur lg:px-8">
          <button className="rounded-xl p-2 hover:bg-white/10 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Abrir menú">
            <Menu />
          </button>
          <div>
            <p className="text-sm text-slate-400">Sistema web con enfoque BPM</p>
            <p className="font-semibold">Informe mensual de valorización de obra</p>
          </div>
          <div className="hidden rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 sm:block">Cloudflare Pages + Supabase</div>
        </header>

        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
