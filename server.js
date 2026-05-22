require('dotenv').config();
const express = require('express');
const sequelize = require('./src/database');
const routes = require('./src/routes');

const app = express();

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;

const MAX_RETRIES = 10;
const RETRY_DELAY = 5000;

async function startServer(retries) {
  try {
    await sequelize.sync();
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
