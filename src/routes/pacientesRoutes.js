import express from "express";
import { pacientes } from "../utils/simulaBanco.js";
import {
  buscarId,
  incrementarId,
  validarDados,
  validarStatus,
} from "../utils/utils.js";
import { analisarHemograma } from "../utils/laudosHelpers.js";

const router = express.Router();

router.post("/", (req, res) => {
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
});

router.post("/:id/exames", (req, res) => {
  const id = Number(req.params.id);
  const dados = req.body;
  const pacienteBuscado = buscarId(id);

  if (!pacienteBuscado) {
    return res.status(404).json({ erro: "Paciente não encontrado" });
  }

  const exame = analisarHemograma(dados);
  if(exame.estadoCritico === true) {
    pacienteBuscado.gravidade = 'ALTA'
  }

  pacienteBuscado.exame = exame;

  return res
    .status(200)
    .json({
      mensagem: "Exame processado e anexado ao prontuário com sucesso!",
      dados: pacienteBuscado,
    });
});

router.get("/", (req, res) => {
  const gravidadeBuscada = req.query.gravidade;

  if (gravidadeBuscada) {
    const pacientesFiltrados = pacientes.filter(
      (p) => p.gravidade === gravidadeBuscada.trim().toUpperCase(),
    );
    return res.status(200).json(pacientesFiltrados);
  }

  return res.status(200).json(pacientes);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  const pacienteBuscado = buscarId(id);

  if (!pacienteBuscado) {
    return res.status(404).json({ erro: "Paciente não encontrado" });
  }

  return res.status(200).json(pacienteBuscado);
});

router.put("/:id", (req, res) => {
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
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const paciente = buscarId(id);

  if (!paciente) {
    return res.status(404).json({ erro: "Paciente não encontrado" });
  }

  const indice = pacientes.findIndex((paciente) => paciente.id === id);

  pacientes.splice(indice, 1);

  return res.status(204).send();
});

export default router;
