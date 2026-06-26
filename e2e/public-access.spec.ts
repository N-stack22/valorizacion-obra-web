import { expect, test } from "@playwright/test";

const protectedRoutes = ["/app/dashboard", "/app/projects", "/app/metrados", "/app/valuations"];

async function expectRouteBlockedWithoutSession(page: import("@playwright/test").Page) {
  await expect(page.locator("body")).not.toContainText("Valorizado aprobado");

  await expect(async () => {
    const url = page.url();
    const body = await page.locator("body").innerText();
    const redirected = /\/auth|\/login|\/$/.test(url);
    const blocked = /Cargando acceso al sistema|Ingresar al sistema|Acceso restringido/.test(body);
    expect(redirected || blocked).toBe(true);
  }).toPass({ timeout: 15_000 });
}

test.describe("Caja negra: acceso publico y rutas protegidas", () => {
  test("landing publica muestra marca y modulos del sistema", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText(/JJ&PP/i).first()).toBeVisible();
    await expect(page.locator("body")).toContainText(/metrados|valorizaciones/i);
    await expect(page.getByRole("link", { name: /^Ingresar$/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /ver demo técnica/i })).toBeVisible();
  });

  test("login muestra formulario y aviso de alta administrada", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByText("Ingresar al sistema").first()).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator("body")).toContainText(/administrador/i);
    await expect(page.getByRole("button", { name: /crear cuenta|registrar/i })).toHaveCount(0);
  });

  test("multiples rutas protegidas bloquean acceso sin sesion", async ({ page }) => {
    for (const route of protectedRoutes) {
      await page.goto(route);
      await expectRouteBlockedWithoutSession(page);
    }
  });

  test("login rechaza envio vacio sin exponer contenido privado", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /^Ingresar$/i }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator("body")).not.toContainText("Valorizado aprobado");
    await expect(page.locator("body")).toContainText(/Ingresar al sistema|correo|contraseña/i);
  });
});
