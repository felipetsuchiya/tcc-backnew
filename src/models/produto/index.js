const { Sequelize, Model } = require("sequelize");
const sequelize = require("../../db/connection");

const Produto = sequelize.define("Produto", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  tipoDeProduto: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  sabor: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  preco: {
    type: Sequelize.DOUBLE,
    allowNull: true,
  },
  marca: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  tamanho: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

// Produto.belongsTo(Vendas, {
//   constraint: true,
//   foreingKey: "produtos",
// });

// Produto.belongsToMany(Vendas, {
//   through: "ProdutoVenda",
// });

module.exports = Produto;
