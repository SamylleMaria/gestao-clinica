import express from 'express';
import pacientesRoutes from './routes/pacientesRoutes.js'

const app = express();
app.use(express.json());
app.use('/pacientes', pacientesRoutes);


app.get('/', (req, res) => {
  return res.json({ mensagem: 'ola, mundo'})}
)

// ----
app.listen(3030, () => {
  console.log("servidor rodando em http://localhost:3030");
});
