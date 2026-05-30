import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { AppLayout } from "@/shared/layouts/AppLayout";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { UsuariosPage } from "@/features/usuarios/pages/UsuariosPage";
import { ModulePage } from "@/features/modules/pages/ModulePage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="proyectos" element={<ModulePage moduleId="linea-base" />} />
        <Route path="metrados" element={<ModulePage moduleId="metrados" />} />
        <Route path="valorizaciones" element={<ModulePage moduleId="fiscalizacion" />} />
        <Route path="reajustes" element={<ModulePage moduleId="reajustes" />} />
        <Route path="expediente" element={<ModulePage moduleId="expediente-ia" />} />
        <Route path="liquidacion" element={<ModulePage moduleId="liquidacion" />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
