import { pacientes } from "../utils/simulaBanco.js";
import { validarGravidade } from "../utils/utils.js";

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
    !paciente.data_nascimento ||
    !paciente.cpf ||
    !paciente.gravidade
  ) {
    return res.status(400).json({ erro: "Dados incompletos" });
  }
  const regexData = /^\d{4}-\d{2}-\d{2}$/;
  const data_nascimento = paciente.data_nascimento;
  if (
    paciente.nome.trim() === "" ||
    regexData.test(data_nascimento) === false ||
    paciente.cpf.trim() === "" ||
    paciente.gravidade.trim() === ""
  ) {
    return res.status(400).json({ erro: "Dados inválidos" });
  }

  if (!validarGravidade(paciente.gravidade.trim().toUpperCase())) {
    return res.status(400).json({ erro: 'Gravidade Inválida.'})
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
  const id = req.params.id;
  const regexUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  if (!regexUuid.test(id)) {
    return res.status(400).json({ erro: "O ID fornecido não é válido." });
  }

  next();
}
