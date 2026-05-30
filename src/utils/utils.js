import { pacientes } from "./simulaBanco.js";

export function validarDados(corpo) {
  if (!corpo.nome || !corpo.idade || !corpo.sintomas || !corpo.gravidade) {
    return false;
  }
  if (
    corpo.nome.trim() === "" ||
    typeof corpo.idade !== "number" ||
    corpo.sintomas.trim() === "" ||
    corpo.gravidade.trim() === ""
  ) {
    return false;
  }

  const opcoesValidas = ["BAIXA", "MEDIA", "ALTA"];
  if (!opcoesValidas.includes(corpo.gravidade.trim().toUpperCase())) {
    return false;
  }
  return true;
}

export function validarStatus(status) {
  if (!status.statusAtendimento) return false;
  if (status.statusAtendimento.trim() === "") return false;
  const dadosValidos = ["EM_ATENDIMENTO", "FINALIZADO"];

  if (!dadosValidos.includes(status.statusAtendimento.trim().toUpperCase()))
    return false;
  return true;
}

export function incrementarId(lista) {
  if (lista.length === 0) return 0;

  return Math.max(...lista.map((item) => item.id));
}

export function buscarId(id) {
  const paciente = pacientes.find((p) => p.id === id);
  return paciente;
}
