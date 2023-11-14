const { Sequelize, DATEONLY } = require("sequelize");
const sequelize = require("../../db/connection");
// const Produto = require("../produto");

const Vendas = sequelize.define("Vendas", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  descricao: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  notaFiscal: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  valorTotal: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },

  dataVenda: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

// Vendas.HasMany(Produto, {
//   through: "ProdutoVenda",
// });

module.exports = Vendas;
