import express from "express";
import { pacientes } from "./utils/simulaBanco.js";
import {
  buscarId,
  incrementarId,
  validarDados,
  validarStatus,
} from "./utils/validacoes.js";

const app = express();
app.use(express.json());

app.post("/pacientes", (req, res) => {
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
  console.log(pacientes);
  return res.status(201).json({
    mensagem: "Paciente criado com sucesso",
    dados: pacienteCadastrado,
  });
});

app.get("/pacientes", (req, res) => {
  const gravidadeBuscada = req.query.gravidade;

  if (gravidadeBuscada) {
    const pacientesFiltrados = pacientes.filter(
      (p) => p.gravidade === gravidadeBuscada.trim().toUpperCase(),
    );
    return res.status(200).json(pacientesFiltrados);
  }

  return res.status(200).json(pacientes);
});

app.get("/pacientes/:id", (req, res) => {
  const id = Number(req.params.id);

  const pacienteBuscado = buscarId(id);

  if (!pacienteBuscado) {
    return res.status(404).json({ erro: "Paciente não encontrado" });
  }

  return res.status(200).json(pacienteBuscado);
});

app.put("/pacientes/:id", (req, res) => {
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

// ----
app.listen(3030, () => {
  console.log("servidor rodando em http://localhost:3030");
});
