// const { Sequelize, Model, DataTypes } = require("sequelize");
// const sequelize = require("../../db/connection");
// const Vendas = require("../vendas/index.js");
// const Produto = require("../produto/index.js");

// const ProdutoVenda = sequelize.define("ProdutoVenda", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   produtoId: {
//     type: DataTypes.INTEGER,
//     refereces: {
//       model: Produto,
//       key: id,
//     },
//   },
//   vendaId: {
//     type: DataTypes.INTEGER,
//     refereces: {
//       model: Vendas,
//       key: id,
//     },
//   },
// });

// module.exports = ProdutoVenda;
