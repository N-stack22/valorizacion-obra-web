# Plan de pruebas

Documento operativo de pruebas del repositorio. El plan completo y su version PDF viven en:

- `docs/plan-de-pruebas/PLAN-DE-PRUEBAS-VALORIZACION-OBRA-K6-SONARQUBE.md`
- `docs/plan-de-pruebas/Plan_de_Pruebas_Valorizacion_Obra_k6_SonarQube.pdf`

## Alcance

El plan cubre autenticacion, roles, proyectos, presupuestos, metrados, memorias valorizadas, valorizaciones, reajustes, generacion documental, firma interna, storage, auditoria, rendimiento con k6 y calidad con SonarQube.

## Reglas base

- Usar datos de prueba o ambiente QA; no ejecutar cargas destructivas en produccion.
- Mantener RLS activo y validar permisos por rol antes de aprobar cambios.
- Ejecutar pruebas automatizadas antes de desplegar.
- Revisar manualmente viewports criticos de 390px y 1920px.
- Verificar mensajes de error visibles, claros y accionables.

## Matriz de pruebas

| Categoria | Objetivo | Comando |
| --- | --- | --- |
| Seguridad | Validar politicas de acceso y rutas protegidas. | `npm run test:security` |
| Roles | Validar permisos por rol global y por proyecto. | `npm run test:roles` |
| Caja blanca | Validar funciones puras, calculos y reglas internas. | `npm run test:whitebox` |
| Caja negra | Validar flujos de usuario E2E. | `npm run test:blackbox` |
| Volumen | Validar comportamiento con volumen de datos. | `npm run test:volume` |
| Estres | Validar degradacion bajo carga exigente. | `npm run test:stress` |
| Performance | Validar tiempos y umbrales de rendimiento. | `npm run test:performance` |
| Usabilidad | Validar experiencia, responsive y mensajes. | `npm run test:usability` |
| Instalacion | Validar instalacion y build reproducible. | `npm run test:installation` |
| Documentacion | Validar que el plan y scripts sigan declarados. | `npm run test:docs` |

## Cobertura por tecnica solicitada

- Caja blanca: reglas de dominio, workflow, calculos y politicas.
- Caja negra: flujos Playwright de login, seguridad, mobile y rutas principales.
- Seguridad: RLS, autenticacion, no registro publico y control de permisos.
- Roles: super admin, admin empresa, residente, supervisor, entidad y representante.
- Volumen: fixtures de gran tamano y stress de reglas internas.
- Estres: escenarios k6 de carga, pico y resistencia.
- Performance: p95/p99, errores y tiempos de respuesta.
- Usabilidad: viewport mobile de 390px, desktop de 1920px y mensajes de error.
- Instalacion: `npm ci` y build productivo.
- Documentacion: plan, matriz, scripts y criterios de salida.

## Casos criticos

- Login no ofrece registro publico.
- Login mobile no genera overflow horizontal.
- Usuario sin rol no puede crear proyectos.
- Global admin puede gestionar proyectos.
- Miembros solo ven datos de proyectos autorizados.
- Storage `expedientes` respeta el `projectId` del path.
- PDF de memoria requiere memoria del periodo.

## Pruebas manuales recomendadas

- Revisar `/login` en 390px y 1920px.
- Verificar mensajes de error en credenciales invalidas, falta de rol y falta de memoria del periodo.
- Crear memoria, enviarla a revision y aprobarla con roles distintos.
- Generar PDF y confirmar que se guarda en `expedientes/{projectId}/{periodId}/`.
- Probar tema claro/oscuro y navegacion por sidebar.

## Criterios de salida

- `npm run typecheck` sin errores.
- `npm run test:security` aprobado.
- `npm run test:roles` aprobado.
- `npm run test:whitebox` aprobado.
- `npm run test:techniques` aprobado.
- `npm run test:blackbox` aprobado en ambiente con Playwright instalado.
- `npm run test:volume` aprobado.
- `npm run test:stress` aprobado.
- `npm run test:performance` aprobado.
- `npm run test:usability` aprobado.
- `npm run test:installation` aprobado en entorno limpio.
- `npm run test:docs` aprobado.
- `npm run build` aprobado antes de publicar.
