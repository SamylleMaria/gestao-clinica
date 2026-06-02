import {
    buscarId,
    incrementarId,
    validarDados,
    validarStatus,
} from "../utils/utils.js";
import { pacientes } from "../utils/simulaBanco.js";
import { analisarHemograma } from "../utils/laudosHelpers.js";



export function obterEstatisticas(req, res) {
  const totalCriticos = pacientes.filter((p) => p.gravidade === "ALTA");
  const filaEspera = pacientes.filter(
    (p) => p.statusAtendimento === "AGUARDANDO",
  );

  return res.status(200).json({
    totalPacientes: pacientes.length,
    totalCriticos: totalCriticos.length,
    filaEspera: filaEspera.length,
  });
}

export function listarPacientes(req, res) {
  const gravidadeBuscada = req.query.gravidade;

  if (gravidadeBuscada) {
    const pacientesFiltrados = pacientes.filter(
      (p) => p.gravidade === gravidadeBuscada.trim().toUpperCase(),
    );
    return res.status(200).json(pacientesFiltrados);
  }

  return res.status(200).json(pacientes);
}

export function buscarPacientePorId(req, res) {
  const id = Number(req.params.id);
  const pacienteBuscado = buscarId(id);
  if (!pacienteBuscado) {
    return res.status(404).json({ erro: "Paciente não encontrado" });
  }

  return res.status(200).json(pacienteBuscado);
}

export function cadastrarPaciente(req, res) {
  const paciente = req.body;
  if (!validarDados(paciente)) {
    return res.status(400).json({ erro: "Dados invávlidos" });
  }

  const pacienteCadastrado = {
    id: incrementarId(pacientes) + 1,
    nome: paciente.nome.trim(),
    idade: paciente.idade,
    sintomas: paciente.sintomas,
    gravidade: paciente.gravidade.trim().toUpperCase(),
  };
  pacientes.push(pacienteCadastrado);
  return res.status(201).json({
    mensagem: "Paciente criado com sucesso",
    dados: pacienteCadastrado,
  });
}

export function processarLaudoExame(req, res) {
  const id = Number(req.params.id);
  const dados = req.body;
  if (
    !dados||
    dados.hemoglobina === undefined ||
    dados.leucocitos === undefined
  ) {
    return res.status(400).json({ erro: "Dados insuficientes para análise"});
  }

  const pacienteBuscado = buscarId(id);
  if (!pacienteBuscado) {
    return res.status(404).json({ erro: "Paciente não encontrado" });
  }

  const exame = analisarHemograma(dados);

  if (exame.estadoCritico === true) {
    pacienteBuscado.gravidade = "ALTA";
  }

  pacienteBuscado.exame = exame;

  return res.status(200).json({
    mensagem: "Exame processado e anexado ao prontuário com sucesso!",
    dados: pacienteBuscado,
  });
}

export function atualizarStatus(req, res) {
  const id = Number(req.params.id);
  const status = req.body;
  const pacienteBuscado = buscarId(id);

  if (!pacienteBuscado) {
    return res.status(404).json({ erro: "Paciente não encontrado" });
  }

  if (!validarStatus(status)) {
    return res.status(400).json({ erro: "Status Inválido" });
  }

  pacienteBuscado.statusAtendimento = status.statusAtendimento
    .trim()
    .toUpperCase();
  return res
    .status(200)
    .json({ mensagem: "Paciente modificado", dados: pacienteBuscado });
}

export function darAltaPaciente(req, res) {
  const id = Number(req.params.id);
  const paciente = buscarId(id);

  if (!paciente) {
    return res.status(404).json({ erro: "Paciente não encontrado" });
  }

  const indice = pacientes.findIndex((paciente) => paciente.id === id);

  pacientes.splice(indice, 1);

  return res.status(204).send();
}
