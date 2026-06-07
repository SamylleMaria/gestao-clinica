import { incrementarId, validarGravidade } from "../utils/utils.js";
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

export async function buscarPacientePorId(req, res, next) {
  try {
    const id = req.params.id;
    const query = `
    SELECT * FROM pacientes WHERE id = $1;`;
    const resultado = await pool.query(query, [id]);
    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensagem: "Paciente não encontrado" });
    }
    const pacienteBuscado = resultado.rows[0];

    return res.status(200).json(pacienteBuscado);
  } catch (error) {
    next(error);
  }
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

export async function atualizarStatus(req, res, next) {
  try {
    const statusBuscado = req.body;
    const statusSanitizado = statusBuscado.status_atendimento
      .trim()
      .toUpperCase();
    const id = req.params.id;

    const query = `
    UPDATE pacientes SET status_atendimento = $1 WHERE id = $2 RETURNING *`;

    const resultado = await pool.query(query, [statusSanitizado, id]);
    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensagem: "Paciente não encontrado" });
    }
    const pacienteAtualizado = resultado.rows[0];

    return res.status(200).json(pacienteAtualizado);
  } catch (error) {
    next(error);
  }
}

export function darAltaPaciente(req, res) {
  const pacienteBuscado = req.pacienteBuscado;
  const indice = pacientes.findIndex(
    (paciente) => paciente.id === pacienteBuscado.id,
  );

  pacientes.splice(indice, 1);

  return res.status(204).send();
}
