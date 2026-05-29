import express from "express";
import { pacientes } from "./utils/simulaBanco.js";
import { validarDados } from "./utils/validacoes.js";

const app = express();
app.use(express.json());

app.get("/pacientes", (req, res) => {
  return res.status(200).json(pacientes);
});

app.post("/pacientes", (req, res) => {
  const paciente = req.body;
  if (!validarDados(paciente)) {
    return res.status(400).json({ erro: "Dados invávlidos" });
  }

  const pacienteCadastrado = {
    id: pacientes.length + 1,
    nome: paciente.nome.trim(),
    idade: paciente.idade,
    sintomas: paciente.sintomas,
    gravidade: paciente.gravidade.trim().toUpperCase()
  };
  pacientes.push(pacienteCadastrado);
  console.log(pacientes)
  return res
    .status(201)
    .json({ mensagem: "Paciente criado com sucesso", dados: pacienteCadastrado });
});

app.listen(3030, () => {
  "servidor rodando em http://localhost:3030";
});
