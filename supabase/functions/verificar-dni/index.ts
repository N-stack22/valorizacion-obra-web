// @ts-nocheck
// Supabase Edge Function: usa Deno en producción. Esta línea evita errores falsos de TypeScript en VS Code si no tienes la extensión de Deno activa.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({
          error: "Método no permitido",
        }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const body = await req.json();
    const dni = String(body.dni ?? "").trim();

    if (!/^[0-9]{8}$/.test(dni)) {
      return new Response(
        JSON.stringify({
          error: "El DNI debe tener exactamente 8 dígitos numéricos.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const token = Deno.env.get("APISPERU_TOKEN");

    if (!token) {
      return new Response(
        JSON.stringify({
          error: "No se configuró el token de APISPERU.",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const response = await fetch(
      `https://dniruc.apisperu.com/api/v1/dni/${dni}?token=${token}`,
    );

    const data = await response.json();

    if (!response.ok || data.error || !data.dni) {
      return new Response(
        JSON.stringify({
          error: "No se pudo verificar el DNI ingresado.",
        }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    return new Response(
      JSON.stringify({
        dni: data.dni,
        nombres: data.nombres,
        apellidoPaterno: data.apellidoPaterno,
        apellidoMaterno: data.apellidoMaterno,
        apellidos: `${data.apellidoPaterno ?? ""} ${data.apellidoMaterno ?? ""}`.trim(),
        codVerifica: data.codVerifica ?? null,
        fuente: "APISPERU",
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Error interno al verificar el DNI.",
        detail: String(error),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});