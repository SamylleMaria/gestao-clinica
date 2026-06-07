import { incrementarId, validarGravidade } from "../utils/utils.js";
// import { pacientes } from "../utils/simulaBanco.js";
import pool from "../utils/db.js";
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

export async function listarPacientes(req, res, next) {
  try {
    const gravidade = req.query.gravidade;

    if (gravidade && !validarGravidade(gravidade)) {
      return res.status(400).json({ erro: "Gravidade Inválida" });
    } 
    if (gravidade) {
      const query = `
    SELECT id, nome, data_nascimento, cpf, gravidade FROM pacientes WHERE gravidade = $1;`;
      const resultado = await pool.query(query, [
        gravidade.trim().toUpperCase(),
      ]);

      const pacientesFiltrados = resultado.rows;
      return res.status(200).json(pacientesFiltrados);
    }
    const query = `
    SELECT id, nome, data_nascimento, cpf, gravidade FROM pacientes;`;
    const resultado = await pool.query(query);
    const pacientes = resultado.rows;

    return res.status(200).json(pacientes);
  } catch (error) {
    next(error);
  }
}

export function buscarPacientePorId(req, res) {
  const pacienteBuscado = req.pacienteBuscado;
  return res.status(200).json(pacienteBuscado);
}

export async function cadastrarPaciente(req, res, next) {
  try {
    const { nome, data_nascimento, cpf, gravidade } = req.body;
    const query = `
    INSERT INTO pacientes (nome, data_nascimento, cpf, gravidade)
    VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [
      nome.trim(),
      data_nascimento,
      cpf,
      gravidade.trim().toUpperCase(),
    ];

    const resultado = await pool.query(query, values);
    const pacienteCadastrado = resultado.rows[0];

    return res.status(201).json({
      mensagem: "Paciente criado com sucesso",
      dados: pacienteCadastrado,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res
        .status(400)
        .json({ erro: "Este CPF já está cadastrado no sistema." });
    }
    next(error);
  }
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
  const indice = pacientes.findIndex(
    (paciente) => paciente.id === pacienteBuscado.id,
  );

  pacientes.splice(indice, 1);

  return res.status(204).send();
}
