export type RolSistema =
  | "administrador"
  | "residente_obra"
  | "supervisor_inspector"
  | "entidad_publica"
  | "representante_legal";

export type UsuarioPerfil = {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  dni: string | null;
  rol: RolSistema | null;
};
