const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/connection");
const Produto = require("../produto");
const Vendas = require("../vendas");

const VendasProduto = sequelize.define("VendaProduto", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  ProdutoId: {
    type: Sequelize.INTEGER,
    references: {
      model: Produto,
      key: "id", // Corrected from "Id"
    },
  },
  VendasId: {
    type: Sequelize.INTEGER,
    references: {
      model: Vendas,
      key: "id", // Corrected from "Id"
    },
  },
});

VendasProduto.associate = (models) => {
  Vendas.belongsToMany(models.Produto, {
    as: "produtos",
    through: VendaProdutos,
    foreignKey: "vendaId",
  });
  Produto.belongsToMany(models.Vendas, {
    as: "vendas",
    through: VendaProdutos,
    foreignKey: "produtoId",
  });
};

module.exports = VendasProduto;
