import fs from 'fs';
import pool from '../utils/db.js';

async function inicializarBanco() {
  try {
    console.log('⏳ Lendo o arquivo schema.sql...');
    // Lê o conteúdo do arquivo de forma síncrona, convertendo para texto
    const schema = fs.readFileSync('./src/database/schema.sql', 'utf8');

    console.log('⚙️ Executando a criação das tabelas no PostgreSQL...');
    // Dispara todo o conteúdo do arquivo SQL de uma só vez para o banco
    await pool.query(schema);

    console.log('✅ Banco de dados estruturado com sucesso!');
  } catch (erro) {
    console.error('❌ Falha ao criar as tabelas:', erro);
  } finally {
    // Encerra o pool de conexões para finalizar o script e liberar o terminal
    await pool.end();
  }
}

inicializarBanco();