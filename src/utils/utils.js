import { pacientes } from "./simulaBanco.js";

export function incrementarId(lista) {
  if (lista.length === 0) return 0;

  return Math.max(...lista.map((item) => item.id));
}
