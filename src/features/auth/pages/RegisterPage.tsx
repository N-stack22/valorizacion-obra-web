import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { registerResident } from "@/features/auth/services/authService";
import { verificarDni } from "@/features/usuarios/services/dniService";
import { isStrongEnoughPassword, isValidDni, onlyDigits } from "@/lib/validators";

export function RegisterPage() {
  const navigate = useNavigate();
  const [dni, setDni] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dniCodigoVerificacion, setDniCodigoVerificacion] = useState<string | null>(null);
  const [dniVerificado, setDniVerificado] = useState(false);
  const [loadingDni, setLoadingDni] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleVerificarDni() {
    setError("");
    setMessage("");
    setDniVerificado(false);

    if (!isValidDni(dni)) {
      setError("El DNI debe tener 8 dígitos.");
      return;
    }

    setLoadingDni(true);
    try {
      const persona = await verificarDni(dni);
      setNombres(persona.nombres);
      setApellidos(persona.apellidos);
      setDniCodigoVerificacion(persona.codVerifica);
      setDniVerificado(true);
      setMessage("DNI verificado. Los nombres y apellidos fueron completados automáticamente.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo verificar el DNI.");
    } finally {
      setLoadingDni(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!dniVerificado) {
      setError("Primero debes verificar el DNI.");
      return;
    }

    setLoadingRegister(true);
    try {
      await registerResident({
        dni,
        nombres,
        apellidos,
        email: email.trim(),
        password,
        dniCodigoVerificacion,
      });
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el usuario.");
    } finally {
      setLoadingRegister(false);
    }
  }

  const canRegister = dniVerificado && nombres && apellidos && email && isStrongEnoughPassword(password);

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10 text-white">
      <Card className="w-full max-w-2xl">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-400">Registro seguro</p>
          <h1 className="mt-2 text-2xl font-bold">Crear usuario con verificación por DNI</h1>
          <p className="mt-2 text-sm text-slate-400">El token de APISPERU se consulta desde una Edge Function, no desde el navegador.</p>
        </div>

        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
            <Input
              label="DNI"
              value={dni}
              maxLength={8}
              onChange={(event) => {
                setDni(onlyDigits(event.target.value).slice(0, 8));
                setDniVerificado(false);
                setNombres("");
                setApellidos("");
              }}
              placeholder="Ej. 74874853"
              error={dni && !isValidDni(dni) ? "Debe tener 8 dígitos" : undefined}
            />
            <Button type="button" variant="secondary" onClick={handleVerificarDni} disabled={loadingDni || !isValidDni(dni)}>
              {loadingDni ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
              Verificar DNI
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Nombres" value={nombres} readOnly placeholder="Se autocompleta" />
            <Input label="Apellidos" value={apellidos} readOnly placeholder="Se autocompleta" />
            <Input label="Correo" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} hint="Mínimo 8 caracteres" required />
          </div>

          {message ? <p className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-200"><CheckCircle2 size={16} />{message}</p> : null}
          {error ? <p className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}

          <Button disabled={!canRegister || loadingRegister}>{loadingRegister ? "Registrando..." : "Registrar usuario"}</Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-400">
          ¿Ya tienes cuenta? <Link className="font-semibold text-gold-400 hover:underline" to="/login">Inicia sesión</Link>
        </p>
      </Card>
    </main>
  );
}
