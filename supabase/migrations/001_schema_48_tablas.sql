-- ============================================================
-- MIGRACIÓN 001: ESQUEMA COMPLETO 48 TABLAS
-- Sistema web con enfoque BPM e IA para informe mensual de valorización de obra
-- Backend: Supabase PostgreSQL
-- Nota: firmas_digitales_registro representa firma electrónica interna del MVP.
-- ============================================================

create extension if not exists pgcrypto;

-- ----------------------------
-- Enums
-- ----------------------------
do $$ begin
  if not exists (select 1 from pg_type where typname = 'estado_registro') then
    create type public.estado_registro as enum ('activo', 'inactivo');
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'rol_sistema') then
    create type public.rol_sistema as enum ('administrador', 'residente_obra', 'supervisor_inspector', 'entidad_publica', 'representante_legal');
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'estado_periodo') then
    create type public.estado_periodo as enum ('abierto', 'en_revision', 'observado', 'aprobado', 'cerrado');
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'estado_valorizacion') then
    create type public.estado_valorizacion as enum ('borrador', 'enviada', 'observada', 'aprobada_supervisor', 'aprobada_gerencial', 'exportada');
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'tipo_contrato') then
    create type public.tipo_contrato as enum ('precios_unitarios', 'suma_alzada');
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'tipo_observacion') then
    create type public.tipo_observacion as enum ('observacion', 'recorte', 'aprobacion');
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'tipo_documento_exportado') then
    create type public.tipo_documento_exportado as enum ('pdf', 'word', 'excel');
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- MÓDULO 1: Usuarios, Roles y Permisos
-- ============================================================
create table if not exists public.empresas_clientes (
  id uuid primary key default gen_random_uuid(),
  razon_social text not null,
  ruc varchar(11),
  direccion text,
  representante_legal text,
  correo_contacto text,
  telefono text,
  estado public.estado_registro not null default 'activo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint empresas_clientes_ruc_unique unique (ruc),
  constraint empresas_clientes_ruc_len check (ruc is null or char_length(ruc) = 11)
);

create table if not exists public.usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  empresa_cliente_id uuid references public.empresas_clientes(id) on delete set null,
  nombres text not null,
  apellidos text not null,
  email text not null unique,
  telefono text,
  dni varchar(8),
  dni_verificado boolean not null default false,
  dni_verificado_at timestamptz,
  dni_verificacion_fuente text,
  dni_codigo_verificacion text,
  estado public.estado_registro not null default 'activo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint usuarios_dni_unique unique (dni),
  constraint usuarios_dni_formato_check check (dni is null or dni ~ '^[0-9]{8}$')
);

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  nombre public.rol_sistema not null unique,
  descripcion text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.permisos (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  descripcion text not null,
  modulo text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.roles_permisos (
  id uuid primary key default gen_random_uuid(),
  rol_id uuid not null references public.roles(id) on delete cascade,
  permiso_id uuid not null references public.permisos(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint roles_permisos_unique unique (rol_id, permiso_id)
);

create table if not exists public.perfiles_usuario (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  rol_id uuid not null references public.roles(id),
  cargo text,
  firma_url text,
  pin_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint perfiles_usuario_unique unique (usuario_id, rol_id)
);

-- ============================================================
-- MÓDULO 2: Estructura de Obra y Presupuesto Base
-- ============================================================
create table if not exists public.proyectos_obra (
  id uuid primary key default gen_random_uuid(),
  empresa_cliente_id uuid references public.empresas_clientes(id) on delete set null,
  codigo text not null unique,
  nombre text not null,
  entidad_contratante text,
  ubicacion text,
  departamento text,
  provincia text,
  distrito text,
  fecha_inicio date,
  fecha_fin_programada date,
  estado public.estado_registro not null default 'activo',
  created_by uuid references public.usuarios(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contratos_obra (
  id uuid primary key default gen_random_uuid(),
  proyecto_id uuid not null references public.proyectos_obra(id) on delete cascade,
  numero_contrato text not null,
  tipo_contrato public.tipo_contrato not null,
  monto_contractual numeric(14,2) not null default 0,
  moneda varchar(3) not null default 'PEN',
  plazo_dias integer not null default 0,
  fecha_suscripcion date,
  fecha_entrega_terreno date,
  adelanto_directo numeric(14,2) not null default 0,
  adelanto_materiales numeric(14,2) not null default 0,
  uit numeric(12,2),
  formula_polinomica_aplica boolean not null default false,
  estado public.estado_registro not null default 'activo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contratos_obra_unique unique (proyecto_id, numero_contrato)
);

create table if not exists public.componentes_obra (
  id uuid primary key default gen_random_uuid(),
  proyecto_id uuid not null references public.proyectos_obra(id) on delete cascade,
  codigo text not null,
  nombre text not null,
  descripcion text,
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint componentes_obra_unique unique (proyecto_id, codigo)
);

create table if not exists public.partidas_presupuesto (
  id uuid primary key default gen_random_uuid(),
  contrato_id uuid not null references public.contratos_obra(id) on delete cascade,
  componente_id uuid references public.componentes_obra(id) on delete set null,
  parent_id uuid references public.partidas_presupuesto(id) on delete cascade,
  item text not null,
  descripcion text not null,
  unidad varchar(20),
  metrado_contractual numeric(14,4) not null default 0,
  precio_unitario numeric(14,4) not null default 0,
  monto_contractual numeric(14,2) generated always as (round((metrado_contractual * precio_unitario)::numeric, 2)) stored,
  nivel integer not null default 1,
  orden integer not null default 0,
  es_titulo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint partidas_presupuesto_unique unique (contrato_id, item)
);

create table if not exists public.precios_unitarios_partida (
  id uuid primary key default gen_random_uuid(),
  partida_id uuid not null references public.partidas_presupuesto(id) on delete cascade,
  costo_directo numeric(14,4) not null default 0,
  gastos_generales_pct numeric(8,4) not null default 0,
  utilidad_pct numeric(8,4) not null default 0,
  precio_unitario_calculado numeric(14,4) not null default 0,
  observacion text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recursos_presupuesto (
  id uuid primary key default gen_random_uuid(),
  contrato_id uuid not null references public.contratos_obra(id) on delete cascade,
  tipo_recurso text not null,
  codigo text,
  descripcion text not null,
  unidad varchar(20),
  costo_unitario numeric(14,4) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.partidas_recursos (
  id uuid primary key default gen_random_uuid(),
  partida_id uuid not null references public.partidas_presupuesto(id) on delete cascade,
  recurso_id uuid not null references public.recursos_presupuesto(id) on delete cascade,
  cuadrilla numeric(14,4) not null default 0,
  cantidad numeric(14,4) not null default 0,
  rendimiento numeric(14,4) not null default 0,
  parcial numeric(14,4) not null default 0,
  created_at timestamptz not null default now(),
  constraint partidas_recursos_unique unique (partida_id, recurso_id)
);

create table if not exists public.cronograma_valorizado_base (
  id uuid primary key default gen_random_uuid(),
  contrato_id uuid not null references public.contratos_obra(id) on delete cascade,
  partida_id uuid references public.partidas_presupuesto(id) on delete cascade,
  periodo_numero integer not null,
  fecha_inicio date,
  fecha_fin date,
  monto_programado numeric(14,2) not null default 0,
  porcentaje_programado numeric(8,4) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- MÓDULO 3: Gestión Mensual de Valorizaciones y Metrados
-- ============================================================
create table if not exists public.periodos_valorizacion (
  id uuid primary key default gen_random_uuid(),
  proyecto_id uuid not null references public.proyectos_obra(id) on delete cascade,
  contrato_id uuid not null references public.contratos_obra(id) on delete cascade,
  numero_periodo integer not null,
  fecha_inicio date not null,
  fecha_fin date not null,
  estado public.estado_periodo not null default 'abierto',
  created_by uuid references public.usuarios(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint periodos_valorizacion_unique unique (contrato_id, numero_periodo),
  constraint periodos_valorizacion_fechas_check check (fecha_fin >= fecha_inicio)
);

create table if not exists public.metrados_diarios_campo (
  id uuid primary key default gen_random_uuid(),
  periodo_id uuid not null references public.periodos_valorizacion(id) on delete cascade,
  partida_id uuid not null references public.partidas_presupuesto(id) on delete cascade,
  fecha_registro date not null default current_date,
  descripcion_trabajo text,
  largo numeric(14,4) not null default 0,
  ancho numeric(14,4) not null default 0,
  alto numeric(14,4) not null default 0,
  veces numeric(14,4) not null default 1,
  metrado_calculado numeric(14,4) generated always as (round((largo * ancho * alto * veces)::numeric, 4)) stored,
  metrado_aprobado numeric(14,4),
  observacion text,
  registrado_por uuid references public.usuarios(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.valorizaciones_mensuales (
  id uuid primary key default gen_random_uuid(),
  periodo_id uuid not null references public.periodos_valorizacion(id) on delete cascade,
  codigo text not null,
  estado public.estado_valorizacion not null default 'borrador',
  monto_directo numeric(14,2) not null default 0,
  gastos_generales numeric(14,2) not null default 0,
  utilidad numeric(14,2) not null default 0,
  igv numeric(14,2) not null default 0,
  reajuste numeric(14,2) not null default 0,
  amortizacion_adelanto numeric(14,2) not null default 0,
  deducciones numeric(14,2) not null default 0,
  total_valorizado numeric(14,2) not null default 0,
  enviada_at timestamptz,
  aprobada_at timestamptz,
  created_by uuid references public.usuarios(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valorizaciones_mensuales_unique unique (periodo_id, codigo)
);

create table if not exists public.detalles_valorizacion_partida (
  id uuid primary key default gen_random_uuid(),
  valorizacion_id uuid not null references public.valorizaciones_mensuales(id) on delete cascade,
  partida_id uuid not null references public.partidas_presupuesto(id) on delete cascade,
  metrado_anterior numeric(14,4) not null default 0,
  metrado_mes numeric(14,4) not null default 0,
  metrado_acumulado numeric(14,4) not null default 0,
  saldo_por_ejecutar numeric(14,4) not null default 0,
  precio_unitario numeric(14,4) not null default 0,
  monto_mes numeric(14,2) not null default 0,
  porcentaje_avance numeric(8,4) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint detalle_valorizacion_unique unique (valorizacion_id, partida_id)
);

create table if not exists public.sustentos_metrado (
  id uuid primary key default gen_random_uuid(),
  metrado_id uuid not null references public.metrados_diarios_campo(id) on delete cascade,
  tipo_sustento text not null,
  descripcion text,
  archivo_url text,
  created_by uuid references public.usuarios(id),
  created_at timestamptz not null default now()
);

create table if not exists public.panel_fotografico (
  id uuid primary key default gen_random_uuid(),
  periodo_id uuid not null references public.periodos_valorizacion(id) on delete cascade,
  titulo text not null,
  descripcion text,
  foto_url text not null,
  latitud numeric(10,7),
  longitud numeric(10,7),
  fecha_captura timestamptz,
  uploaded_by uuid references public.usuarios(id),
  created_at timestamptz not null default now()
);

create table if not exists public.partidas_fotos (
  id uuid primary key default gen_random_uuid(),
  partida_id uuid not null references public.partidas_presupuesto(id) on delete cascade,
  foto_id uuid not null references public.panel_fotografico(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint partidas_fotos_unique unique (partida_id, foto_id)
);

create table if not exists public.ensayos_control_calidad (
  id uuid primary key default gen_random_uuid(),
  periodo_id uuid not null references public.periodos_valorizacion(id) on delete cascade,
  partida_id uuid references public.partidas_presupuesto(id) on delete set null,
  tipo_ensayo text not null,
  laboratorio text,
  fecha_ensayo date,
  resultado text,
  cumple boolean,
  documento_url text,
  created_by uuid references public.usuarios(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.observaciones_supervisor (
  id uuid primary key default gen_random_uuid(),
  valorizacion_id uuid references public.valorizaciones_mensuales(id) on delete cascade,
  metrado_id uuid references public.metrados_diarios_campo(id) on delete cascade,
  partida_id uuid references public.partidas_presupuesto(id) on delete set null,
  tipo public.tipo_observacion not null default 'observacion',
  descripcion text not null,
  cantidad_recortada numeric(14,4) default 0,
  estado text not null default 'pendiente',
  supervisor_id uuid references public.usuarios(id),
  respondido_por uuid references public.usuarios(id),
  respuesta_residente text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.historial_estados_valorizacion (
  id uuid primary key default gen_random_uuid(),
  valorizacion_id uuid not null references public.valorizaciones_mensuales(id) on delete cascade,
  estado_anterior public.estado_valorizacion,
  estado_nuevo public.estado_valorizacion not null,
  comentario text,
  usuario_id uuid references public.usuarios(id),
  created_at timestamptz not null default now()
);

-- ============================================================
-- MÓDULO 4: Reajustes y Fórmulas Polinómicas
-- ============================================================
create table if not exists public.formulas_polinomicas (
  id uuid primary key default gen_random_uuid(),
  contrato_id uuid not null references public.contratos_obra(id) on delete cascade,
  codigo text not null,
  descripcion text,
  fecha_base date,
  estado public.estado_registro not null default 'activo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint formulas_polinomicas_unique unique (contrato_id, codigo)
);

create table if not exists public.monomios_detalle (
  id uuid primary key default gen_random_uuid(),
  formula_id uuid not null references public.formulas_polinomicas(id) on delete cascade,
  simbolo text not null,
  descripcion text,
  coeficiente numeric(10,6) not null,
  indice_base_codigo text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.indices_unificados_inei (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  descripcion text not null,
  unidad text,
  estado public.estado_registro not null default 'activo',
  created_at timestamptz not null default now()
);

create table if not exists public.valores_mensuales_inei (
  id uuid primary key default gen_random_uuid(),
  indice_id uuid not null references public.indices_unificados_inei(id) on delete cascade,
  anio integer not null,
  mes integer not null,
  valor numeric(14,6) not null,
  fuente text,
  created_at timestamptz not null default now(),
  constraint valores_mensuales_inei_unique unique (indice_id, anio, mes),
  constraint valores_mensuales_inei_mes_check check (mes between 1 and 12)
);

create table if not exists public.calculo_coeficiente_k (
  id uuid primary key default gen_random_uuid(),
  valorizacion_id uuid not null references public.valorizaciones_mensuales(id) on delete cascade,
  formula_id uuid not null references public.formulas_polinomicas(id) on delete cascade,
  k_calculado numeric(14,8) not null default 1,
  detalle_json jsonb not null default '{}'::jsonb,
  calculado_por uuid references public.usuarios(id),
  created_at timestamptz not null default now()
);

create table if not exists public.reajustes_mensuales (
  id uuid primary key default gen_random_uuid(),
  valorizacion_id uuid not null references public.valorizaciones_mensuales(id) on delete cascade,
  calculo_k_id uuid references public.calculo_coeficiente_k(id) on delete set null,
  monto_base numeric(14,2) not null default 0,
  factor_k numeric(14,8) not null default 1,
  monto_reajuste numeric(14,2) not null default 0,
  observacion text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- MÓDULO 5: Modificaciones Contractuales
-- ============================================================
create table if not exists public.adicionales_obra (
  id uuid primary key default gen_random_uuid(),
  contrato_id uuid not null references public.contratos_obra(id) on delete cascade,
  codigo text not null,
  descripcion text not null,
  monto_aprobado numeric(14,2) not null default 0,
  fecha_aprobacion date,
  documento_url text,
  estado public.estado_registro not null default 'activo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.partidas_adicionales (
  id uuid primary key default gen_random_uuid(),
  adicional_id uuid not null references public.adicionales_obra(id) on delete cascade,
  item text not null,
  descripcion text not null,
  unidad varchar(20),
  metrado numeric(14,4) not null default 0,
  precio_unitario numeric(14,4) not null default 0,
  monto numeric(14,2) generated always as (round((metrado * precio_unitario)::numeric, 2)) stored,
  created_at timestamptz not null default now()
);

create table if not exists public.deductivos_obra (
  id uuid primary key default gen_random_uuid(),
  contrato_id uuid not null references public.contratos_obra(id) on delete cascade,
  codigo text not null,
  descripcion text not null,
  monto_deductivo numeric(14,2) not null default 0,
  fecha_aprobacion date,
  documento_url text,
  estado public.estado_registro not null default 'activo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ampliaciones_plazo (
  id uuid primary key default gen_random_uuid(),
  contrato_id uuid not null references public.contratos_obra(id) on delete cascade,
  codigo text not null,
  descripcion text not null,
  dias_ampliados integer not null default 0,
  fecha_aprobacion date,
  nueva_fecha_fin date,
  documento_url text,
  estado public.estado_registro not null default 'activo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nuevo_cronograma_reprogramado (
  id uuid primary key default gen_random_uuid(),
  ampliacion_id uuid references public.ampliaciones_plazo(id) on delete cascade,
  contrato_id uuid not null references public.contratos_obra(id) on delete cascade,
  version integer not null default 1,
  partida_id uuid references public.partidas_presupuesto(id) on delete cascade,
  periodo_numero integer not null,
  monto_programado numeric(14,2) not null default 0,
  porcentaje_programado numeric(8,4) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.suspensiones_obra (
  id uuid primary key default gen_random_uuid(),
  contrato_id uuid not null references public.contratos_obra(id) on delete cascade,
  fecha_inicio date not null,
  fecha_fin date,
  motivo text not null,
  documento_url text,
  estado text not null default 'registrada',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- MÓDULO 6: Liquidación de Obra y Cierre
-- ============================================================
create table if not exists public.liquidaciones_obra (
  id uuid primary key default gen_random_uuid(),
  contrato_id uuid not null references public.contratos_obra(id) on delete cascade,
  codigo text not null,
  fecha_corte date not null,
  monto_contrato_actualizado numeric(14,2) not null default 0,
  total_valorizado numeric(14,2) not null default 0,
  total_reajustes numeric(14,2) not null default 0,
  total_amortizaciones numeric(14,2) not null default 0,
  saldo_final_preliminar numeric(14,2) not null default 0,
  estado text not null default 'preliminar',
  created_by uuid references public.usuarios(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resumen_amortizaciones (
  id uuid primary key default gen_random_uuid(),
  contrato_id uuid not null references public.contratos_obra(id) on delete cascade,
  valorizacion_id uuid references public.valorizaciones_mensuales(id) on delete set null,
  tipo_adelanto text not null,
  monto_adelanto numeric(14,2) not null default 0,
  monto_amortizado numeric(14,2) not null default 0,
  saldo_adelanto numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.intereses_legales (
  id uuid primary key default gen_random_uuid(),
  contrato_id uuid not null references public.contratos_obra(id) on delete cascade,
  concepto text not null,
  fecha_inicio date not null,
  fecha_fin date not null,
  tasa numeric(10,6) not null default 0,
  monto_base numeric(14,2) not null default 0,
  monto_interes numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.actas_recepcion (
  id uuid primary key default gen_random_uuid(),
  contrato_id uuid not null references public.contratos_obra(id) on delete cascade,
  tipo_acta text not null,
  fecha_acta date not null,
  observaciones text,
  documento_url text,
  created_by uuid references public.usuarios(id),
  created_at timestamptz not null default now()
);

create table if not exists public.documentos_finales (
  id uuid primary key default gen_random_uuid(),
  liquidacion_id uuid references public.liquidaciones_obra(id) on delete cascade,
  tipo_documento text not null,
  nombre text not null,
  archivo_url text not null,
  hash_sha256 text,
  created_by uuid references public.usuarios(id),
  created_at timestamptz not null default now()
);

create table if not exists public.historico_saldos_finales (
  id uuid primary key default gen_random_uuid(),
  liquidacion_id uuid not null references public.liquidaciones_obra(id) on delete cascade,
  concepto text not null,
  monto numeric(14,2) not null default 0,
  observacion text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- MÓDULO 7: Auditoría, Logs y Automatización
-- ============================================================
create table if not exists public.logs_sistema (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.usuarios(id) on delete set null,
  modulo text not null,
  accion text not null,
  entidad text,
  entidad_id uuid,
  detalle jsonb not null default '{}'::jsonb,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.notificaciones_alertas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.usuarios(id) on delete cascade,
  titulo text not null,
  mensaje text not null,
  tipo text not null default 'info',
  leida boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.firmas_digitales_registro (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  valorizacion_id uuid references public.valorizaciones_mensuales(id) on delete cascade,
  documento_exportado_id uuid,
  tipo_firma text not null default 'firma_electronica_interna',
  firma_url text,
  hash_sha256 text not null,
  codigo_verificacion text not null unique,
  ip text,
  user_agent text,
  firmado_at timestamptz not null default now(),
  observacion text
);

create table if not exists public.documentos_exportados (
  id uuid primary key default gen_random_uuid(),
  valorizacion_id uuid references public.valorizaciones_mensuales(id) on delete cascade,
  liquidacion_id uuid references public.liquidaciones_obra(id) on delete cascade,
  tipo public.tipo_documento_exportado not null,
  nombre_archivo text not null,
  archivo_url text not null,
  hash_sha256 text,
  version integer not null default 1,
  generado_por uuid references public.usuarios(id),
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'firmas_documento_fk') then
    alter table public.firmas_digitales_registro
      add constraint firmas_documento_fk foreign key (documento_exportado_id) references public.documentos_exportados(id) on delete set null;
  end if;
end $$;

create table if not exists public.comentarios_cuaderno_obra_sync (
  id uuid primary key default gen_random_uuid(),
  proyecto_id uuid not null references public.proyectos_obra(id) on delete cascade,
  periodo_id uuid references public.periodos_valorizacion(id) on delete set null,
  fecha_comentario date not null,
  autor text,
  comentario text not null,
  fuente text not null default 'registro_manual',
  referencia_externa text,
  created_by uuid references public.usuarios(id),
  created_at timestamptz not null default now()
);

create table if not exists public.configuracion_entidades (
  id uuid primary key default gen_random_uuid(),
  empresa_cliente_id uuid references public.empresas_clientes(id) on delete cascade,
  clave text not null,
  valor jsonb not null default '{}'::jsonb,
  descripcion text,
  updated_by uuid references public.usuarios(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint configuracion_entidades_unique unique (empresa_cliente_id, clave)
);

-- ----------------------------
-- Triggers updated_at
-- ----------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'empresas_clientes','usuarios','perfiles_usuario','proyectos_obra','contratos_obra','componentes_obra',
    'partidas_presupuesto','precios_unitarios_partida','recursos_presupuesto','cronograma_valorizado_base',
    'periodos_valorizacion','metrados_diarios_campo','valorizaciones_mensuales','detalles_valorizacion_partida',
    'ensayos_control_calidad','observaciones_supervisor','formulas_polinomicas','reajustes_mensuales',
    'adicionales_obra','deductivos_obra','ampliaciones_plazo','suspensiones_obra','liquidaciones_obra',
    'configuracion_entidades'
  ] loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', t, t);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

-- ----------------------------
-- Datos iniciales
-- ----------------------------
insert into public.roles (nombre, descripcion)
values
  ('administrador', 'Usuario responsable de la configuración técnica y funcional del sistema.'),
  ('residente_obra', 'Usuario responsable de registrar metrados, evidencias y valorizaciones preliminares.'),
  ('supervisor_inspector', 'Usuario responsable de revisar, observar, recortar, aprobar y cerrar periodos.'),
  ('entidad_publica', 'Usuario institucional con acceso de consulta al avance y expediente aprobado.'),
  ('representante_legal', 'Usuario responsable de la aprobación gerencial y presentación administrativa.')
on conflict (nombre) do nothing;

insert into public.permisos (codigo, descripcion, modulo)
values
  ('usuarios.ver', 'Ver usuarios del sistema', 'usuarios'),
  ('usuarios.crear', 'Crear usuarios del sistema', 'usuarios'),
  ('roles.asignar', 'Asignar roles a usuarios', 'usuarios'),
  ('proyectos.ver', 'Ver proyectos de obra', 'proyectos'),
  ('proyectos.crear', 'Crear proyectos de obra', 'proyectos'),
  ('presupuesto.gestionar', 'Gestionar presupuesto base', 'presupuesto'),
  ('metrados.ver', 'Ver metrados ejecutados', 'metrados'),
  ('metrados.crear', 'Registrar metrados ejecutados', 'metrados'),
  ('valorizaciones.ver', 'Ver valorizaciones mensuales', 'valorizaciones'),
  ('valorizaciones.crear', 'Crear valorizaciones mensuales', 'valorizaciones'),
  ('valorizaciones.enviar_revision', 'Enviar valorización a revisión', 'valorizaciones'),
  ('fiscalizacion.ver', 'Ver información para fiscalización', 'fiscalizacion'),
  ('fiscalizacion.observar', 'Observar metrados o partidas', 'fiscalizacion'),
  ('fiscalizacion.aprobar', 'Aprobar metrados y valorizaciones', 'fiscalizacion'),
  ('reajustes.gestionar', 'Gestionar reajustes financieros', 'reajustes'),
  ('expediente.generar', 'Generar expediente mensual', 'expediente'),
  ('expediente.exportar', 'Exportar expediente mensual', 'expediente'),
  ('liquidacion.gestionar', 'Gestionar pre-liquidación y cierre', 'liquidacion'),
  ('auditoria.ver', 'Ver registros de auditoría', 'auditoria')
on conflict (codigo) do nothing;

insert into public.roles_permisos (rol_id, permiso_id)
select r.id, p.id from public.roles r cross join public.permisos p where r.nombre = 'administrador'
on conflict (rol_id, permiso_id) do nothing;

insert into public.roles_permisos (rol_id, permiso_id)
select r.id, p.id from public.roles r join public.permisos p on p.codigo in (
  'proyectos.ver','presupuesto.gestionar','metrados.ver','metrados.crear','valorizaciones.ver','valorizaciones.crear','valorizaciones.enviar_revision','reajustes.gestionar','expediente.generar','expediente.exportar','liquidacion.gestionar'
) where r.nombre = 'residente_obra'
on conflict (rol_id, permiso_id) do nothing;

insert into public.roles_permisos (rol_id, permiso_id)
select r.id, p.id from public.roles r join public.permisos p on p.codigo in (
  'proyectos.ver','metrados.ver','valorizaciones.ver','fiscalizacion.ver','fiscalizacion.observar','fiscalizacion.aprobar','reajustes.gestionar','expediente.exportar','liquidacion.gestionar'
) where r.nombre = 'supervisor_inspector'
on conflict (rol_id, permiso_id) do nothing;

insert into public.roles_permisos (rol_id, permiso_id)
select r.id, p.id from public.roles r join public.permisos p on p.codigo in (
  'proyectos.ver','metrados.ver','valorizaciones.ver','expediente.exportar'
) where r.nombre = 'entidad_publica'
on conflict (rol_id, permiso_id) do nothing;

insert into public.roles_permisos (rol_id, permiso_id)
select r.id, p.id from public.roles r join public.permisos p on p.codigo in (
  'proyectos.ver','valorizaciones.ver','expediente.exportar','liquidacion.gestionar'
) where r.nombre = 'representante_legal'
on conflict (rol_id, permiso_id) do nothing;

insert into public.empresas_clientes (razon_social, ruc, direccion, representante_legal, correo_contacto, telefono)
values ('JJ&PP Ingenieros', '20608502786', 'Huancayo, Junín', 'John Paul Rodríguez Camarena', 'contacto@jjppingenieros.com', '999999999')
on conflict (ruc) do nothing;

-- ----------------------------
-- Funciones de seguridad
-- ----------------------------
create or replace function public.usuario_tiene_rol(rol_buscado public.rol_sistema)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.perfiles_usuario pu
    join public.roles r on r.id = pu.rol_id
    where pu.usuario_id = auth.uid()
      and r.nombre = rol_buscado
  );
$$;

create or replace function public.usuario_tiene_permiso(permiso_buscado text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.perfiles_usuario pu
    join public.roles_permisos rp on rp.rol_id = pu.rol_id
    join public.permisos p on p.id = rp.permiso_id
    where pu.usuario_id = auth.uid()
      and p.codigo = permiso_buscado
  );
$$;

-- ----------------------------
-- Activar RLS para todas las tablas públicas del sistema
-- ----------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'empresas_clientes','usuarios','roles','permisos','roles_permisos','perfiles_usuario',
    'proyectos_obra','contratos_obra','componentes_obra','partidas_presupuesto','precios_unitarios_partida','recursos_presupuesto','partidas_recursos','cronograma_valorizado_base',
    'periodos_valorizacion','metrados_diarios_campo','valorizaciones_mensuales','detalles_valorizacion_partida','sustentos_metrado','panel_fotografico','partidas_fotos','ensayos_control_calidad','observaciones_supervisor','historial_estados_valorizacion',
    'formulas_polinomicas','monomios_detalle','indices_unificados_inei','valores_mensuales_inei','calculo_coeficiente_k','reajustes_mensuales',
    'adicionales_obra','partidas_adicionales','deductivos_obra','ampliaciones_plazo','nuevo_cronograma_reprogramado','suspensiones_obra',
    'liquidaciones_obra','resumen_amortizaciones','intereses_legales','actas_recepcion','documentos_finales','historico_saldos_finales',
    'logs_sistema','notificaciones_alertas','firmas_digitales_registro','documentos_exportados','comentarios_cuaderno_obra_sync','configuracion_entidades'
  ] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- ----------------------------
-- Políticas base
-- ----------------------------
-- Lectura de roles/permisos para usuarios autenticados.
drop policy if exists roles_select_authenticated on public.roles;
create policy roles_select_authenticated on public.roles for select to authenticated using (true);

drop policy if exists permisos_select_authenticated on public.permisos;
create policy permisos_select_authenticated on public.permisos for select to authenticated using (true);

drop policy if exists roles_permisos_select_authenticated on public.roles_permisos;
create policy roles_permisos_select_authenticated on public.roles_permisos for select to authenticated using (true);

-- Usuarios: ver propio perfil o admin.
drop policy if exists usuarios_select_own_or_admin on public.usuarios;
create policy usuarios_select_own_or_admin on public.usuarios for select to authenticated
using (id = auth.uid() or public.usuario_tiene_rol('administrador'));

drop policy if exists usuarios_insert_own_or_admin on public.usuarios;
create policy usuarios_insert_own_or_admin on public.usuarios for insert to authenticated
with check (id = auth.uid() or public.usuario_tiene_rol('administrador'));

drop policy if exists usuarios_update_own_or_admin on public.usuarios;
create policy usuarios_update_own_or_admin on public.usuarios for update to authenticated
using (id = auth.uid() or public.usuario_tiene_rol('administrador'))
with check (id = auth.uid() or public.usuario_tiene_rol('administrador'));

-- Perfiles: usuario puede ver su rol; admin ve todo.
drop policy if exists perfiles_select_own_or_admin on public.perfiles_usuario;
create policy perfiles_select_own_or_admin on public.perfiles_usuario for select to authenticated
using (usuario_id = auth.uid() or public.usuario_tiene_rol('administrador'));

-- Registro público: un usuario recién creado puede asignarse solamente rol residente_obra.
drop policy if exists perfiles_insert_own_residente_or_admin on public.perfiles_usuario;
create policy perfiles_insert_own_residente_or_admin on public.perfiles_usuario for insert to authenticated
with check (
  public.usuario_tiene_rol('administrador')
  or (
    usuario_id = auth.uid()
    and exists (select 1 from public.roles r where r.id = rol_id and r.nombre = 'residente_obra')
  )
);

-- Admin gestiona roles/permisos/perfiles.
drop policy if exists roles_manage_admin on public.roles;
create policy roles_manage_admin on public.roles for all to authenticated
using (public.usuario_tiene_rol('administrador')) with check (public.usuario_tiene_rol('administrador'));

drop policy if exists permisos_manage_admin on public.permisos;
create policy permisos_manage_admin on public.permisos for all to authenticated
using (public.usuario_tiene_rol('administrador')) with check (public.usuario_tiene_rol('administrador'));

drop policy if exists roles_permisos_manage_admin on public.roles_permisos;
create policy roles_permisos_manage_admin on public.roles_permisos for all to authenticated
using (public.usuario_tiene_rol('administrador')) with check (public.usuario_tiene_rol('administrador'));

-- Política genérica de lectura para tablas operativas a usuarios autenticados.
do $$
declare t text;
begin
  foreach t in array array[
    'empresas_clientes','proyectos_obra','contratos_obra','componentes_obra','partidas_presupuesto','precios_unitarios_partida','recursos_presupuesto','partidas_recursos','cronograma_valorizado_base',
    'periodos_valorizacion','metrados_diarios_campo','valorizaciones_mensuales','detalles_valorizacion_partida','sustentos_metrado','panel_fotografico','partidas_fotos','ensayos_control_calidad','observaciones_supervisor','historial_estados_valorizacion',
    'formulas_polinomicas','monomios_detalle','indices_unificados_inei','valores_mensuales_inei','calculo_coeficiente_k','reajustes_mensuales',
    'adicionales_obra','partidas_adicionales','deductivos_obra','ampliaciones_plazo','nuevo_cronograma_reprogramado','suspensiones_obra',
    'liquidaciones_obra','resumen_amortizaciones','intereses_legales','actas_recepcion','documentos_finales','historico_saldos_finales',
    'notificaciones_alertas','firmas_digitales_registro','documentos_exportados','comentarios_cuaderno_obra_sync','configuracion_entidades'
  ] loop
    execute format('drop policy if exists %I on public.%I', t || '_select_authenticated', t);
    execute format('create policy %I on public.%I for select to authenticated using (true)', t || '_select_authenticated', t);
  end loop;
end $$;

-- Política genérica de escritura: admin o roles técnicos. Ajustar por módulo cuando se desarrollen CRUD completos.
do $$
declare t text;
begin
  foreach t in array array[
    'empresas_clientes','proyectos_obra','contratos_obra','componentes_obra','partidas_presupuesto','precios_unitarios_partida','recursos_presupuesto','partidas_recursos','cronograma_valorizado_base',
    'periodos_valorizacion','metrados_diarios_campo','valorizaciones_mensuales','detalles_valorizacion_partida','sustentos_metrado','panel_fotografico','partidas_fotos','ensayos_control_calidad','observaciones_supervisor','historial_estados_valorizacion',
    'formulas_polinomicas','monomios_detalle','indices_unificados_inei','valores_mensuales_inei','calculo_coeficiente_k','reajustes_mensuales',
    'adicionales_obra','partidas_adicionales','deductivos_obra','ampliaciones_plazo','nuevo_cronograma_reprogramado','suspensiones_obra',
    'liquidaciones_obra','resumen_amortizaciones','intereses_legales','actas_recepcion','documentos_finales','historico_saldos_finales','documentos_exportados','comentarios_cuaderno_obra_sync','configuracion_entidades'
  ] loop
    execute format('drop policy if exists %I on public.%I', t || '_write_roles', t);
    execute format('create policy %I on public.%I for all to authenticated using (public.usuario_tiene_rol(''administrador'') or public.usuario_tiene_rol(''residente_obra'') or public.usuario_tiene_rol(''supervisor_inspector'')) with check (public.usuario_tiene_rol(''administrador'') or public.usuario_tiene_rol(''residente_obra'') or public.usuario_tiene_rol(''supervisor_inspector''))', t || '_write_roles', t);
  end loop;
end $$;

-- Logs: usuarios autenticados pueden insertar; solo admin lee todo.
drop policy if exists logs_insert_authenticated on public.logs_sistema;
create policy logs_insert_authenticated on public.logs_sistema for insert to authenticated with check (true);

drop policy if exists logs_select_admin on public.logs_sistema;
create policy logs_select_admin on public.logs_sistema for select to authenticated using (public.usuario_tiene_rol('administrador'));

-- Notificaciones: cada usuario ve/modifica las suyas.
drop policy if exists notificaciones_own on public.notificaciones_alertas;
create policy notificaciones_own on public.notificaciones_alertas for all to authenticated
using (usuario_id = auth.uid() or public.usuario_tiene_rol('administrador'))
with check (usuario_id = auth.uid() or public.usuario_tiene_rol('administrador'));

-- ----------------------------
-- Storage buckets para evidencias y documentos
-- ----------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('evidencias-obra', 'evidencias-obra', false, 10485760, array['image/jpeg','image/png','image/webp','application/pdf']),
  ('documentos-exportados', 'documentos-exportados', false, 52428800, array['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']),
  ('firmas-internas', 'firmas-internas', false, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
