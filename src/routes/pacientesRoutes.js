import express from "express";
import {
  atualizarStatus,
  buscarPacientePorId,
  cadastrarPaciente,
  darAltaPaciente,
  listarPacientes,
  obterEstatisticas,
  processarLaudoExame,
} from "../controllers/pacientesController.js";
import { validarDadosExame, validarDadosPaciente, validarIdPaciente, validarStatus } from "../middlewares/validacoesMiddleware.js";

const router = express.Router();

router.post("/", validarDadosPaciente, cadastrarPaciente);

router.post("/:id/exames", validarIdPaciente, processarLaudoExame);

router.get("/", listarPacientes);

router.get("/estatisticas", obterEstatisticas);

router.get("/:id", validarIdPaciente, buscarPacientePorId);

router.put("/:id", validarIdPaciente, validarStatus, atualizarStatus);

router.delete("/:id", validarIdPaciente, darAltaPaciente);

export default router;
