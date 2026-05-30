import { describe, expect, it } from "vitest";
import { buildFullName, isStrongEnoughPassword, isValidDni, onlyDigits } from "@/lib/validators";

describe("validadores base", () => {
  it("acepta DNI con 8 dígitos", () => {
    expect(isValidDni("74874853")).toBe(true);
  });

  it("rechaza DNI con letras o longitud incorrecta", () => {
    expect(isValidDni("ABC74853")).toBe(false);
    expect(isValidDni("1234567")).toBe(false);
    expect(isValidDni("123456789")).toBe(false);
  });

  it("limpia caracteres no numéricos", () => {
    expect(onlyDigits("74A-874 853")).toBe("74874853");
  });

  it("valida contraseña mínima", () => {
    expect(isStrongEnoughPassword("1234567")).toBe(false);
    expect(isStrongEnoughPassword("12345678")).toBe(true);
  });

  it("construye nombre completo", () => {
    expect(buildFullName("  Ana  María ", " Pérez   Rojas ")).toBe("Ana María Pérez Rojas");
  });
});
