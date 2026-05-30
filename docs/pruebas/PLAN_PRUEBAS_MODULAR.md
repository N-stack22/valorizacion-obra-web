# Plan de pruebas modular

## Criterio de avance

Un módulo se considera terminado cuando cumple:

- Pruebas unitarias aprobadas.
- Pruebas de componentes aprobadas.
- Pruebas E2E aprobadas.
- Validación manual con capturas.
- Sin defectos críticos abiertos.
- Build correcto.

## Módulo 1: Usuarios y DNI

### Unitarias
- Validar DNI con 8 dígitos.
- Rechazar DNI con letras.
- Rechazar DNI incompleto.
- Validar contraseña mínima.

### Componentes
- Render de login.
- Render de registro.
- Botón Verificar DNI bloqueado si el DNI es inválido.
- Autocompletado de nombres y apellidos.

### E2E
- Abrir login.
- Abrir registro.
- Intentar verificar DNI incompleto.
- Registrar usuario con DNI válido en ambiente controlado.

## Módulo 2: Línea base

- Crear proyecto.
- Crear contrato.
- Registrar partidas.
- Validar suma de partidas.

## Módulo 3: Metrados

- Calcular L×A×H×N.
- Validar saldo contractual.
- Adjuntar evidencia.

## Módulo 4: Valorización y fiscalización

- Enviar valorización.
- Observar partida.
- Corregir metrado.
- Aprobar periodo.

## Módulo 5: Reajustes

- Registrar fórmula polinómica.
- Calcular factor K.
- Calcular reajuste mensual.

## Módulo 6: Expediente IA

- Generar texto con datos aprobados.
- Editar texto.
- Exportar documento.

## Módulo 7: Liquidación y auditoría

- Consolidar saldos.
- Firmar internamente.
- Consultar logs.
