# Solución de problemas `npm ci` en Windows

Este proyecto debe instalar dependencias desde el registro público de npm.

## Error: ETIMEDOUT hacia `packages.applied-caas...openai.org`

Causa probable: el `package-lock.json` o la configuración local de npm quedó apuntando a un registro interno usado durante una preparación anterior del proyecto. Ese registro no existe desde una PC personal.

Solución aplicada en este paquete:

- Se reemplazaron URLs internas del `package-lock.json` por `https://registry.npmjs.org`.
- Se agregó `.npmrc` con `registry=https://registry.npmjs.org/`.

Para verificar en tu máquina:

```powershell
npm config get registry
Select-String -Path package-lock.json -Pattern "applied-caas|artifactory|openai.org"
```

El primer comando debe devolver:

```text
https://registry.npmjs.org/
```

El segundo comando no debe encontrar coincidencias.

## Error: EPERM al borrar `node_modules`

En Windows puede aparecer cuando OneDrive, OneNote, antivirus, VS Code, terminales abiertas o procesos de Node bloquean carpetas dentro de `node_modules`.

Recomendación:

1. Cerrar VS Code, terminales y servidores `npm run dev`.
2. Mover el proyecto fuera de carpetas sincronizadas por OneNote/OneDrive, por ejemplo:

```text
C:\dev\valorizacion-obra-web-main
```

3. Borrar instalación anterior:

```powershell
cd C:\dev\valorizacion-obra-web-main
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm config set registry https://registry.npmjs.org/
```

Si el paquete ya incluye el `package-lock.json` corregido, no borres el lockfile. Usa:

```powershell
Remove-Item -Recurse -Force node_modules
npm cache verify
npm ci
```

Si Windows no deja borrar `node_modules`, reinicia el equipo o ejecuta PowerShell como administrador y repite el borrado.

## Comandos esperados después de instalar

```powershell
npm run quality:preflight
npm run test:coverage
npm run build
```

Para SonarSource en GitHub Actions, configura el secret `SONAR_TOKEN` en GitHub y ejecuta el workflow de calidad.
