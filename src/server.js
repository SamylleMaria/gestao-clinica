import express from "express";
import { pacientes } from "./utils/simulaBanco.js";
import { incrementarId, validarDados } from "./utils/validacoes.js";

const app = express();
app.use(express.json());

app.get("/pacientes", (req, res) => {
  const gravidadeBuscada = req.query.gravidade;

  if (gravidadeBuscada) {
    const pacientesFiltrados = pacientes.filter((p) => p.gravidade === gravidadeBuscada.trim().toUpperCase());
    return res.status(200).json(pacientesFiltrados);
  }

  return res.status(200).json(pacientes);
});

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

app.listen(3030, () => {
  console.log("servidor rodando em http://localhost:3030");
});
