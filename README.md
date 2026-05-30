# Sistema Web de Valorización Mensual de Obra

Proyecto base desde cero para el MVP académico del sistema web con enfoque BPM e IA para informe mensual de valorización de obra pública.

Incluye:

- React + Vite + TypeScript.
- Tailwind CSS.
- Supabase Auth + PostgreSQL + RLS + Storage.
- Edge Function `verificar-dni`.
- Migración SQL con las 48 tablas del modelo.
- Pruebas con Vitest, React Testing Library, Cypress y k6.
- Configuración base para Cloudflare Pages y SonarCloud/SonarQube.

## 1. Instalar dependencias

```bash
npm install
```

Si Cypress falla al instalar por problemas de descarga o conexión, instala las dependencias así y deja Cypress para configurarlo luego:

```bash
$env:CYPRESS_INSTALL_BINARY=0
npm install
```

En PowerShell, esa variable solo aplica a la terminal actual.

## 2. Variables del frontend

Copia `.env.example` como `.env.local`.

En Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Completa `.env.local` con los datos de tu proyecto Supabase:

```env
VITE_SUPABASE_URL=https://TU_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=TU_SUPABASE_PUBLISHABLE_O_ANON_KEY
VITE_APP_ENV=development
```

No coloques el token de APISPERU en `.env.local`, porque ese token no debe quedar en el navegador.

## 3. Crear la base de datos en Supabase

Opción rápida desde el panel:

1. Entra a Supabase.
2. Abre `SQL Editor`.
3. Crea una consulta nueva.
4. Copia el contenido de `supabase/migrations/001_schema_48_tablas.sql`.
5. Ejecuta el script.
6. Verifica en `Table Editor` que aparezcan las 48 tablas.

## 4. Configurar Supabase CLI

```bash
npx supabase login
npx supabase link --project-ref TU_PROJECT_REF
```

## 5. Guardar el token de APISPERU como secreto

El token debe estar limpio, sin `%27` al final.

Formato recomendado:

```bash
npx supabase secrets set --project-ref TU_PROJECT_REF APISPERU_TOKEN="TU_TOKEN_LIMPIO"
```

Si en Windows te sale `Access token not provided`, usa una de estas opciones:

### Opción A: desde Supabase Dashboard

Entra a tu proyecto y busca:

```txt
Edge Functions → Secrets → Add secret
```

Agrega:

```txt
Name: APISPERU_TOKEN
Value: TU_TOKEN_LIMPIO
```

### Opción B: con access token personal

1. Entra a `Supabase Dashboard → Account → Access Tokens`.
2. Crea un token personal.
3. En PowerShell ejecuta:

```powershell
$env:SUPABASE_ACCESS_TOKEN="TU_ACCESS_TOKEN_DE_SUPABASE"
npx supabase secrets set --project-ref TU_PROJECT_REF APISPERU_TOKEN="TU_TOKEN_LIMPIO"
```

## 6. Desplegar Edge Function de DNI

```bash
npx supabase functions deploy verificar-dni --project-ref TU_PROJECT_REF
```

El archivo `supabase/functions/verificar-dni/index.ts` puede mostrar advertencias de Deno en VS Code si no tienes instalada la extensión de Deno. No afecta al build de React.

## 7. Ejecutar el proyecto

```bash
npm run dev
```

Abre:

```txt
http://localhost:5173
```

## 8. Ejecutar pruebas y build

```bash
npm run test
npm run build
```

Para Cypress, primero levanta el proyecto:

```bash
npm run dev
```

Y en otra terminal ejecuta:

```bash
npm run test:e2e
```

## 9. Despliegue en Cloudflare Pages

Configuración recomendada:

```txt
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Root directory: /
```

Variables en Cloudflare Pages:

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_APP_ENV=production
```

Nunca subir a Cloudflare Pages:

```txt
APISPERU_TOKEN
OPENAI_API_KEY
SUPABASE_SERVICE_ROLE_KEY
```

Esos secretos van en Supabase Edge Functions.
