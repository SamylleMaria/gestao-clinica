import { validarGravidade } from "../utils/utils.js";
import pool from "../utils/db.js";
import { analisarHemograma } from "../utils/laudosHelpers.js";
import { validarIdPaciente } from "../middlewares/validacoesMiddleware.js";

export async function obterEstatisticas(req, res, next) {
  try {
    const queryTotalPacientes = `
    SELECT COUNT(*) FROM pacientes;`;
    const queryTotalCriticos = `
    SELECT COUNT(*) FROM pacientes WHERE gravidade = 'ALTA';`;
    const queryFilaEspera = `
    SELECT COUNT(*) FROM pacientes WHERE status_atendimento = 'AGUARDANDO';`;

    const [resultadoTotal, resultadoCriticos, ResultadoFila] =
      await Promise.all([
        pool.query(queryTotalPacientes),
        pool.query(queryTotalCriticos),
        pool.query(queryFilaEspera),
      ]);

    const estatisticas = {
      totalPacientes: Number(resultadoTotal.rows[0].count),
      totalCriticos: Number(resultadoCriticos.rows[0].count),
      filaEspera: Number(ResultadoFila.rows[0].count),
    };

    return res.status(200).json(estatisticas);
  } catch (error) {
    next(error);
  }
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

export async function processarLaudoExame(req, res, next) {
  const client = await pool.connect();

  try {
    const id = req.params.id;
    const { tipo_exame, resultados } = req.body;

    const exameAnalisado = analisarHemograma(resultados);

    await client.query("BEGIN");

    const queryBuscarPaciente = `SELECT * FROM pacientes WHERE id = $1;`;
    const resultadoPaciente = await client.query(queryBuscarPaciente, [id]);

    if (resultadoPaciente.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ mensagem: "Paciente não encontrado" });
    }

    let pacienteDados = resultadoPaciente.rows[0];

    const queryInserirExame = `
      INSERT INTO exames (paciente_id, tipo_exame, resultados)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    
    const dadosExameJson = JSON.stringify({
      resultados_brutos: resultados,
      analise: exameAnalisado
    });

    await client.query(queryInserirExame, [id, tipo_exame, dadosExameJson]);

    if (exameAnalisado.estadoCritico === true) {
      const queryAtualizarGravidade = `
        UPDATE pacientes 
        SET gravidade = 'ALTA' 
        WHERE id = $1 
        RETURNING *;
      `;
      const resultadoUpdate = await client.query(queryAtualizarGravidade, [id]);
      pacienteDados = resultadoUpdate.rows[0]; 
    }

    await client.query("COMMIT");

    return res.status(200).json({
      mensagem: "Exame processado e anexado ao prontuário com sucesso!",
      paciente: pacienteDados,
      exame: {
        tipo_exame,
        resultados,
        analise: exameAnalisado
      }
    });

  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
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

export async function darAltaPaciente(req, res, next) {
  try {
    const id = req.params.id;
    const query = `
    DELETE FROM pacientes WHERE id = $1;`;
    const resultado = await pool.query(query, [id]);
    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensagem: "Paciente não encontrado" });
    }
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}
