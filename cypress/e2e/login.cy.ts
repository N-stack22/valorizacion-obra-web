describe("Login", () => {
  it("muestra la pantalla de acceso", () => {
    cy.visit("/login");
    cy.contains("Sistema de Valorización de Obra").should("be.visible");
    cy.contains("Ingresar").should("be.visible");
  });
});
