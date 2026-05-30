import { ArrowRight, CheckCircle2, Database, FlaskConical, Layers3 } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { projectModules } from "@/app/modules";

const statusLabel = {
  pendiente: "Pendiente",
  en_progreso: "En progreso",
  listo_para_pruebas: "Listo para pruebas",
  aprobado: "Aprobado",
};

export function DashboardPage() {
  return (
    <div className="grid gap-6">
      <section className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <Card className="overflow-hidden relative">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gold-500/20 blur-2xl" />
          <Badge>Proyecto nuevo desde cero</Badge>
          <h2 className="mt-4 max-w-3xl text-3xl font-bold leading-tight">Sistema web para informe mensual de valorización de obra pública</h2>
          <p className="mt-3 max-w-3xl text-slate-300">Base lista para React + Vite + Supabase, con 48 tablas en PostgreSQL, RLS, verificación por DNI, Edge Function y estructura por módulos con pruebas.</p>
        </Card>
        <Card className="grid gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gold-500 text-navy-950"><Database /></div>
            <div>
              <p className="text-2xl font-bold">48 tablas</p>
              <p className="text-sm text-slate-400">Modelo completo por módulos</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-gold-400"><FlaskConical /></div>
            <div>
              <p className="text-2xl font-bold">Vitest + Cypress</p>
              <p className="text-sm text-slate-400">Calidad antes de avanzar</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projectModules.map((module) => (
          <Link key={module.id} to={module.path}>
            <Card className="h-full transition hover:-translate-y-1 hover:border-gold-500/40">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-gold-400"><Layers3 size={20} /></div>
                <Badge>{statusLabel[module.status]}</Badge>
              </div>
              <h3 className="text-lg font-bold">{module.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{module.description}</p>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-gold-400">Abrir módulo <ArrowRight size={16} /></div>
            </Card>
          </Link>
        ))}
      </section>

      <Card>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-gold-400" />
          <div>
            <h3 className="font-bold">Regla de avance</h3>
            <p className="text-sm text-slate-400">Un módulo pasa al siguiente cuando aprueba pruebas unitarias, componentes, E2E, validación manual y revisión de calidad.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
