import { expect, test } from "@playwright/test";

test.describe("Caja negra: autenticacion publica", () => {
  test("login no ofrece registro publico", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByText("Ingresar al sistema").first()).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: /^Ingresar$/i })).toBeVisible();

    await expect(page.getByRole("button", { name: /crear cuenta|registrar|crear acceso/i })).toHaveCount(0);
    await expect(page.locator('input[autocomplete="new-password"]')).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText("El primer usuario registrado");
  });

  test("rutas protegidas no muestran contenido de app sin sesion", async ({ page }) => {
    await page.goto("/app/dashboard");

    await expect(page.locator("body")).not.toContainText("Valorizado aprobado");

    await expect(async () => {
      const url = page.url();
      const body = await page.locator("body").innerText();
      const redirected = /\/auth|\/login|\/$/.test(url);
      const blocked = /Cargando acceso al sistema|Ingresar al sistema|Acceso restringido/.test(body);
      expect(redirected || blocked).toBe(true);
    }).toPass({ timeout: 15_000 });
  });

  test("login mobile no genera overflow horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/login");

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("login carga dentro de un umbral operativo", async ({ page }) => {
    const startedAt = Date.now();
    await page.goto("/login");
    await expect(page.getByText("Ingresar al sistema").first()).toBeVisible();
    expect(Date.now() - startedAt).toBeLessThan(8_000);
  });
});
