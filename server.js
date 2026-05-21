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
}).catch(() => {
  process.exit(1);
});
