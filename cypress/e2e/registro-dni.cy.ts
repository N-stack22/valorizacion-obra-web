describe("Registro con DNI", () => {
  it("muestra la pantalla de registro", () => {
    cy.visit("/registro");
    cy.contains("Crear usuario con verificación por DNI").should("be.visible");
    cy.contains("Verificar DNI").should("be.visible");
  });

  it("no permite verificar DNI incompleto", () => {
    cy.visit("/registro");
    cy.get('input[placeholder="Ej. 74874853"]').type("123");
    cy.contains("Verificar DNI").should("be.disabled");
  });
});
