const { Sequelize } = require("sequelize");
const sequelize = require("../../db/connection");
const Produto = require("../produto");
const Vendas = require("../vendas");

const VendasProduto = sequelize.define(
  "VendasProduto",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    quantidadeVendida: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: false }
);

VendasProduto.associate = (models) => {
  Vendas.belongsToMany(models.Produto, {
    as: "produtos",
    through: VendasProduto,
    foreignKey: "vendaId",
  });
  Produto.belongsToMany(models.Vendas, {
    as: "vendas",
    through: VendasProduto,
    foreignKey: "produtoId",
  });
};

module.exports = VendasProduto;
