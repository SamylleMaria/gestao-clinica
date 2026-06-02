import { incrementarId } from "../utils/utils.js";
import { pacientes } from "../utils/simulaBanco.js";
import { analisarHemograma } from "../utils/laudosHelpers.js";
import { validarIdPaciente } from "../middlewares/validacoesMiddleware.js";

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
  const pacienteBuscado = req.pacienteBuscado;
  return res.status(200).json(pacienteBuscado);
}

export function cadastrarPaciente(req, res) {
  const paciente = req.body;
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
  const pacienteBuscado = req.pacienteBuscado;
  const exame = analisarHemograma(req.body);

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
  const status = req.body;
  const pacienteBuscado = req.pacienteBuscado;

  pacienteBuscado.statusAtendimento = status.statusAtendimento
    .trim()
    .toUpperCase();
  return res
    .status(200)
    .json({ mensagem: "Paciente modificado", dados: pacienteBuscado });
}

export function darAltaPaciente(req, res) {
  const pacienteBuscado = req.pacienteBuscado;
  const indice = pacientes.findIndex((paciente) => paciente.id === pacienteBuscado.id);

  pacientes.splice(indice, 1);

  return res.status(204).send();
}
