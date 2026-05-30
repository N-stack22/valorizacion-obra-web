import { supabase } from "@/lib/supabase";
import { isValidDni } from "@/lib/validators";

export type DniResponse = {
  dni: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  apellidos: string;
  codVerifica: string | null;
  fuente: "APISPERU";
};

export async function verificarDni(dni: string): Promise<DniResponse> {
  if (!isValidDni(dni)) {
    throw new Error("El DNI debe tener exactamente 8 dígitos numéricos.");
  }

  const { data, error } = await supabase.functions.invoke<DniResponse>("verificar-dni", {
    body: { dni },
  });

  if (error) {
    throw new Error(error.message || "No se pudo verificar el DNI.");
  }

  if (!data) {
    throw new Error("No se recibió respuesta de la verificación de DNI.");
  }

  return data;
}
