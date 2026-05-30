import { ClipboardCheck, Database, TestTube2 } from "lucide-react";
import { projectModules } from "@/app/modules";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

type Props = {
  moduleId: string;
};

export function ModulePage({ moduleId }: Props) {
  const module = projectModules.find((item) => item.id === moduleId);

  if (!module) {
    return <Card>Módulo no encontrado.</Card>;
  }

  return (
    <div className="grid gap-6">
      <Card>
        <Badge>Módulo del MVP</Badge>
        <h2 className="mt-4 text-3xl font-bold">{module.title}</h2>
        <p className="mt-2 max-w-3xl text-slate-300">{module.description}</p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center gap-3">
            <Database className="text-gold-400" />
            <h3 className="font-bold">Tablas relacionadas</h3>
          </div>
          <ul className="grid gap-2 text-sm text-slate-300">
            {module.tables.map((table) => (
              <li key={table} className="rounded-xl bg-white/5 px-3 py-2 font-mono">{table}</li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-3">
            <TestTube2 className="text-gold-400" />
            <h3 className="font-bold">Pruebas mínimas del módulo</h3>
          </div>
          <ul className="grid gap-2 text-sm text-slate-300">
            {module.tests.map((test) => (
              <li key={test} className="flex items-start gap-2"><ClipboardCheck className="mt-0.5 shrink-0 text-gold-400" size={16} />{test}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
