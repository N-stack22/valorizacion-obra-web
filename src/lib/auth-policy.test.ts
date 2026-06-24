import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import {
  LOGIN_ACCESS_NOTICE,
  PUBLIC_USER_REGISTRATION_ENABLED,
  canCreateProjectWithRoles,
  canManageUsersWithRoles,
} from "./auth-policy";

function readSource(relativeUrl: string) {
  return readFileSync(new URL(relativeUrl, import.meta.url), "utf8");
}

describe("auth policy - caja blanca", () => {
  it("mantiene deshabilitado el registro publico", () => {
    expect(PUBLIC_USER_REGISTRATION_ENABLED).toBe(false);
    expect(LOGIN_ACCESS_NOTICE).toMatch(/administrador/i);
  });

  it("solo admin o residente pueden crear proyectos", () => {
    expect(canCreateProjectWithRoles(["admin"])).toBe(true);
    expect(canCreateProjectWithRoles(["resident"])).toBe(true);
    expect(canCreateProjectWithRoles(["assistant"])).toBe(false);
    expect(canCreateProjectWithRoles(["supervisor"])).toBe(false);
    expect(canCreateProjectWithRoles(["legal_representative"])).toBe(false);
    expect(canCreateProjectWithRoles([])).toBe(false);
  });

  it("solo roles administrativos gestionan usuarios", () => {
    expect(canManageUsersWithRoles({ appRoles: ["admin"] })).toBe(true);
    expect(canManageUsersWithRoles({ appRoles: [], globalRoles: ["super_admin"] })).toBe(true);
    expect(canManageUsersWithRoles({ appRoles: [], globalRoles: ["admin_empresa"] })).toBe(true);
    expect(canManageUsersWithRoles({ appRoles: ["resident"], globalRoles: ["usuario_registrado"] })).toBe(false);
  });

  it("el proveedor de auth no expone signUp al cliente", () => {
    const source = readSource("./auth.tsx");
    expect(source).not.toMatch(/\bsignUp\b/);
    expect(source).not.toMatch(/auth\.signUp/);
  });

  it("el login no contiene caminos visuales de alta publica", () => {
    const source = readSource("../components/app/workspace-pages.tsx");
    expect(source).not.toMatch(/\bsignUp\b|\bsignup\b|setMode/);
    expect(source).not.toMatch(/Crear cuenta|Crear acceso inicial|Registrar primer acceso|new-password/);
  });
});
