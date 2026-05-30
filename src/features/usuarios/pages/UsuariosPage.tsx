import { ShieldCheck, UserRoundCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function UsuariosPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-gold-500 text-navy-950"><UserRoundCheck /></div>
          <div>
            <h2 className="text-2xl font-bold">Usuarios, roles y verificación por DNI</h2>
            <p className="text-sm text-slate-400">Este módulo usa Supabase Auth, tabla usuarios, perfiles_usuario, roles, permisos y Edge Function verificar-dni.</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center gap-3">
          <ShieldCheck className="text-gold-400" />
          <h3 className="font-bold">Checklist del módulo 1</h3>
        </div>
        <ul className="grid gap-3 text-sm text-slate-300">
          <li>✓ Crear usuario en Supabase Auth.</li>
          <li>✓ Verificar DNI desde Edge Function sin exponer token.</li>
          <li>✓ Guardar nombres, apellidos, DNI y estado de verificación.</li>
          <li>✓ Asignar rol inicial residente_obra o administrar roles desde SQL.</li>
          <li>✓ Probar RLS y permisos por rol.</li>
        </ul>
      </Card>
    </div>
  );
}
