require('dotenv').config();
const express = require('express');
const sequelize = require('./src/database');
const routes = require('./src/routes');
const Livro = require('./src/models/Book');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sistema de Cadastro de Livros</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; background: #1a1a2e; color: #eee; display: flex; flex-direction: column; align-items: center; padding: 40px 20px; min-height: 100vh; }
    h1 { color: #e94560; margin-bottom: 8px; font-size: 2rem; }
    p { color: #aaa; margin-bottom: 30px; }
    .card { background: #16213e; border-radius: 10px; padding: 24px; width: 100%; max-width: 600px; margin-bottom: 16px; }
    .card h2 { color: #0f3460; background: #e94560; display: inline-block; padding: 4px 12px; border-radius: 4px; margin-bottom: 12px; font-size: 0.9rem; }
    code { background: #0f3460; padding: 6px 12px; border-radius: 4px; display: block; margin: 4px 0; font-size: 0.95rem; color: #4ecca3; }
    .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; margin-right: 6px; }
    .get { background: #2d6a4f; color: #95d5b2; }
    .post { background: #6a4c2d; color: #f4a261; }
    .put { background: #2d476a; color: #90e0ef; }
    .del { background: #6a2d2d; color: #f08080; }
    .row { display: flex; align-items: center; margin: 6px 0; gap: 8px; }
  </style>
</head>
<body>
  <h1>📚 Sistema de Cadastro de Livros</h1>
  <p>API REST rodando com Node.js + MySQL no Azure Container Instances</p>
  <div class="card">
    <h2>ENDPOINTS</h2>
    <div class="row"><span class="badge get">GET</span><code>/api/books</code></div>
    <div class="row"><span class="badge get">GET</span><code>/api/books/:id</code></div>
    <div class="row"><span class="badge post">POST</span><code>/api/books</code></div>
    <div class="row"><span class="badge put">PUT</span><code>/api/books/:id</code></div>
    <div class="row"><span class="badge del">DELETE</span><code>/api/books/:id</code></div>
  </div>
  <div class="card">
    <h2>INFRAESTRUTURA</h2>
    <div class="row">🐳 Docker + Docker Compose</div>
    <div class="row">☁️ Azure Container Registry (ACR)</div>
    <div class="row">🚀 Azure Container Instances (ACI)</div>
  </div>
</body>
</html>`);
});

app.use('/api', routes);

const PORT = process.env.PORT || 3000;

const MAX_RETRIES = 10;
const RETRY_DELAY = 5000;

async function startServer(retries) {
  try {
    await sequelize.sync();

    const count = await Livro.count();
    if (count === 0) {
      await Livro.bulkCreate([
        { nome: 'Clean Code', valor: 89.90, categoria: 'Tecnologia' },
        { nome: 'O Programador Pragmático', valor: 79.90, categoria: 'Tecnologia' },
        { nome: 'Domain-Driven Design', valor: 99.90, categoria: 'Arquitetura' },
        { nome: 'DevOps Handbook', valor: 94.90, categoria: 'DevOps' },
        { nome: 'Docker Deep Dive', valor: 69.90, categoria: 'DevOps' },
      ]);
      console.log('Banco populado com livros iniciais.');
    }

    app.listen(PORT);
    console.log(`Servidor rodando na porta ${PORT}`);
  } catch (err) {
    if (retries > 0) {
      console.log(`Aguardando banco de dados... tentativas restantes: ${retries}. Erro: ${err.message}`);
      setTimeout(() => startServer(retries - 1), RETRY_DELAY);
    } else {
      console.error('Erro ao conectar ao banco de dados:', err.message);
      process.exit(1);
    }
  }
}

startServer(MAX_RETRIES);
