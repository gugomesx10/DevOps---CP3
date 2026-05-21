require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./src/routes');

const app = express();

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/devops_cp3';

mongoose.connect(MONGO_URI).then(() => {
  app.listen(PORT);
}).catch(() => {
  process.exit(1);
});
