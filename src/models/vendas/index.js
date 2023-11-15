const { Sequelize, DATEONLY } = require("sequelize");
const sequelize = require("../../db/connection");
const Produto = require("../produto/index");
const VendaProduto = require("../vendaProdutos/index");

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
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
});

Vendas.associate = function (models) {
  Vendas.belongsToMany(models.Produto, {
    through: "VendasProdutos",
    foreignKey: "vendaId",
  });
  Produto.belongsToMany(models.Vendas, {
    through: "VendaProdutos",
    foreingKey: "VendasId",
  });
};

module.exports = Vendas;
