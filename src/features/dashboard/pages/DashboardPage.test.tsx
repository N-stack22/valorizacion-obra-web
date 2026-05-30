import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";

describe("DashboardPage", () => {
  it("muestra el resumen del sistema y módulos", () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    expect(screen.getAllByText(/48 tablas/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Parametrización contractual/i)).toBeInTheDocument();
    expect(screen.getByText(/Gestión de metrados/i)).toBeInTheDocument();
  });
});
