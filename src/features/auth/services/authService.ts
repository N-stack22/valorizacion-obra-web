import { supabase } from "@/lib/supabase";

export type RegisterPayload = {
  email: string;
  password: string;
  dni: string;
  nombres: string;
  apellidos: string;
  dniCodigoVerificacion: string | null;
};

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

export async function registerResident(payload: RegisterPayload) {
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
  });

  if (error) throw new Error(error.message);
  const userId = data.user?.id;

  if (!userId) {
    throw new Error("No se pudo obtener el usuario creado. Revisa si la confirmación por correo está activa.");
  }

  const { data: role, error: roleError } = await supabase
    .from("roles")
    .select("id")
    .eq("nombre", "residente_obra")
    .single();

  if (roleError || !role) {
    throw new Error("No se encontró el rol residente_obra. Ejecuta la migración SQL primero.");
  }

  const { error: profileError } = await supabase.from("usuarios").insert({
    id: userId,
    nombres: payload.nombres,
    apellidos: payload.apellidos,
    email: payload.email,
    dni: payload.dni,
    dni_verificado: true,
    dni_verificado_at: new Date().toISOString(),
    dni_verificacion_fuente: "APISPERU",
    dni_codigo_verificacion: payload.dniCodigoVerificacion,
  });

  if (profileError) {
    throw new Error(`Usuario Auth creado, pero falló el perfil: ${profileError.message}`);
  }

  const { error: rolError } = await supabase.from("perfiles_usuario").insert({
    usuario_id: userId,
    rol_id: role.id,
    cargo: "Residente de Obra",
  });

  if (rolError) {
    throw new Error(`Perfil creado, pero falló la asignación de rol: ${rolError.message}`);
  }

  return data;
}
