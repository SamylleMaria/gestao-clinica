import pool from "./utils/db.js";
import express from "express";
import pacientesRoutes from "./routes/pacientesRoutes.js";
import { mostrarErro } from "./middlewares/erroGlobal.js";

const app = express();
app.use(express.json());
app.use("/pacientes", pacientesRoutes);

app.get("/", (req, res) => {
  return res.json({ mensagem: "ola, mundo" });
});

app.use(mostrarErro);

// ----
app.listen(3030, () => {
  console.log("servidor rodando em http://localhost:3030");
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error(
      "Falha crítica: Não foi possivel conectar ao banco de dados.",
      err.stack,
    );
  } else {
    console.log("Handshake com PostgreSQL estabelecido!");
    console.log("Hora no servidor do banco:", res.rows[0].now);
  }
});
