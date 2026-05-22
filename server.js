require('dotenv').config();
const express = require('express');
const sequelize = require('./src/database');
const routes = require('./src/routes');

const app = express();

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT);
  console.log(`Servidor rodando na porta ${PORT}`);
}).catch((err) => {
  console.error('Erro ao conectar ao banco de dados:', err.message);
  process.exit(1);
});
