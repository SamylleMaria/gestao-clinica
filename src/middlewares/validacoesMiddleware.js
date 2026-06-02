import { pacientes } from "../utils/simulaBanco.js";

export function validarDadosExame(req, res, next) {
  const dados = req.body;
  if (
    !dados ||
    dados.hemoglobina === undefined ||
    dados.leucocitos === undefined
  ) {
    return res.status(400).json({ erro: "Dados insuficientes para análise" });
  }
  next();
}

export function validarDadosPaciente(req, res, next) {
  const paciente = req.body;
  if (
    !paciente.nome ||
    !paciente.idade ||
    !paciente.sintomas ||
    !paciente.gravidade
  ) {
    return res.status(400).json({ erro: "Dados incompletos" });
  }
  if (
    paciente.nome.trim() === "" ||
    typeof paciente.idade !== "number" ||
    paciente.sintomas.trim() === "" ||
    paciente.gravidade.trim() === ""
  ) {
    return res.status(400).json({ erro: "Dados inválidos" });
  }

  const opcoesValidas = ["BAIXA", "MEDIA", "ALTA"];
  if (!opcoesValidas.includes(paciente.gravidade.trim().toUpperCase())) {
    return res.status(400).json({ erro: "Dados inválidos" });
  }
  next();
}

export function validarStatus(req, res, next) {
  const status = req.body;
  const dadosValidos = ["EM_ATENDIMENTO", "FINALIZADO", "AGUARDANDO"];
  if (
    !status.statusAtendimento ||
    status.statusAtendimento.trim() === "" ||
    !dadosValidos.includes(status.statusAtendimento.trim().toUpperCase())
  )
    return res.status(400).json({ erro: "Status inválido" });

  next();
}

export function validarIdPaciente(req, res, next) {
  const id = Number(req.params.id);
  const paciente = pacientes.find((p) => p.id === id);

  if (!paciente) {
    return res.status(404).json({ erro: "Paciente não encontrado" });
  }
  req.pacienteBuscado = paciente;

  next();
}
