import { test, expect } from "@playwright/test";

test.describe("Smoke: rutas públicas", () => {
  test("la landing carga y muestra contenido", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/.+/);
    // El root layout debe renderizar algún contenido visible.
    const body = page.locator("body");
    await expect(body).not.toBeEmpty();
  });

  test("ruta de auth es accesible", async ({ page }) => {
    const response = await page.goto("/auth");
    expect(response?.status()).toBeLessThan(500);
    await expect(page.locator("body")).toBeVisible();
  });

  test("rutas protegidas redirigen sin sesión", async ({ page }) => {
    await page.goto("/app/dashboard");

    await expect(page.locator("body")).not.toContainText("Valorizado aprobado");

    // AuthGuard redirige a /login cuando termina de verificar la sesión,
    // o muestra loading mientras bloquea el acceso sin sesión.
    await expect(async () => {
      const url = page.url();
      const body = await page.locator("body").innerText();
      const redirected = /\/auth|\/login|\/$/.test(url);
      const blocked = /Cargando acceso al sistema|Ingresar al sistema/.test(body);
      expect(redirected || blocked).toBe(true);
    }).toPass({ timeout: 15_000 });
  });
});
