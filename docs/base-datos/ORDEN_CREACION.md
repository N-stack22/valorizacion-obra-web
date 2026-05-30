# Orden recomendado para crear la base de datos

Aunque el script incluido crea las 48 tablas juntas, el desarrollo se trabaja por módulos:

1. Usuarios, roles y permisos.
2. Obra, contrato y presupuesto base.
3. Periodos, metrados, evidencias y valorizaciones.
4. Reajustes y fórmula polinómica.
5. Modificaciones contractuales.
6. Liquidación y cierre.
7. Auditoría, firmas internas y documentos exportados.

La regla del proyecto es: un módulo no avanza hasta que sus pruebas estén aprobadas.
