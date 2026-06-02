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

const router = express.Router();

router.post("/", cadastrarPaciente);

router.post("/:id/exames", processarLaudoExame);

router.get("/", listarPacientes);

router.get("/estatisticas", obterEstatisticas);

router.get("/:id", buscarPacientePorId);

router.put("/:id", atualizarStatus);

router.delete("/:id", darAltaPaciente);

export default router;
