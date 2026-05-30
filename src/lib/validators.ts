export function isValidDni(dni: string) {
  return /^[0-9]{8}$/.test(dni.trim());
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function isStrongEnoughPassword(password: string) {
  return password.length >= 8;
}

export function buildFullName(nombres: string, apellidos: string) {
  return `${nombres.trim()} ${apellidos.trim()}`.replace(/\s+/g, " ").trim();
}
