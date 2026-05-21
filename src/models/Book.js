const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Livro = sequelize.define('tbl_livros', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  valor: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  categoria: { type: DataTypes.STRING },
  data_cadastro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'tbl_livros',
  timestamps: false,
});

module.exports = Livro;
