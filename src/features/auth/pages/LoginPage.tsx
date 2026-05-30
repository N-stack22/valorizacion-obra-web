import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { login } from "@/features/auth/services/authService";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate("/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10 text-white">
      <Card className="w-full max-w-md">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gold-500 text-navy-950">
            <Building2 />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-400">JJ&PP Ingenieros</p>
          <h1 className="mt-2 text-2xl font-bold">Sistema de Valorización de Obra</h1>
          <p className="mt-2 text-sm text-slate-400">Accede al control mensual de metrados, valorizaciones e informes.</p>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <Input label="Correo" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="usuario@empresa.com" required />
          <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" required />
          {error ? <p className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}
          <Button disabled={loading}>{loading ? "Ingresando..." : "Ingresar"}</Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-400">
          ¿Nuevo usuario? <Link className="font-semibold text-gold-400 hover:underline" to="/registro">Registrarse con DNI</Link>
        </p>
      </Card>
    </main>
  );
}
