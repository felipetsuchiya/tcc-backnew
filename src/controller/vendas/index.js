const Produtos = require("../../models/produto/index.js");
const Venda = require("../../models/vendas/index.js");
const { Sequelize } = require('sequelize')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');


async function findAll(req, res) {
  try {
    const venda = await Venda.findAll({
      atributes: [
        'id',
        'descricao',
        'notaFiscal',
        'dataVenda',
        [Sequelize.fn('SUM', Sequelize.literal('`Produtos.quantidadeVendida`')), 'totalQuantitySold']
      ],
      include: {
        model: Produtos,
        through: {
          attributes: ['quantidadeVendida']
        }
      },
    }); //{include: [{model: Produto,through: {attributes: ['descricao']}}]}
    res.status(200).json(venda);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

function findOne(req, res) {
  try {
    const { id } = req.query;
    const filteredVenda = Venda.filter(id);
    res.status(200).json(filteredVenda);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



async function cria(req, res) {
  try {
    var valorTotal = 0;
    const { descricao, notaFiscal, produtosIds } = req.body;
    const dataVenda = new Date();

    // Create a new sale
    const venda = await Venda.create({
      descricao,
      notaFiscal,
      dataVenda,
      valorTotal,
    });

    // Verifica se há produtos associados à venda
    if (produtosIds.length > 0) {
      // Find the products based on the provided IDs
      const produtos = await Produtos.findAll({
        where: {
          id: produtosIds.map((i) => i.id),
        },
      });

      console.log("Produtos: ", produtos);

      for (const produto of produtos) {
        const quantidadeVendida = produtosIds.find((i) => i.id === produto.id);

        console.log("quantidadeVendida:", quantidadeVendida);

        if (quantidadeVendida && quantidadeVendida.quantidade) {
          valorTotal += produto.preco * quantidadeVendida.quantidade;
          // Atualiza o valorTotal da venda
          await venda.update({
            valorTotal,
          });

          // Associate the product with the sale in the pivot table
          await venda.addProdutos(produto, {
            through: { quantidadeVendida: quantidadeVendida.quantidade },
          });
        }
      }

      console.log("Valor Total: ", valorTotal);
    }

    res.status(201).json({ venda: venda, produtosIds: produtosIds });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "Internal Server Error" });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { descricao, notaFiscal, produtosIds } = req.body;
    const vendas = await Venda.findByPk(id);
    if (!vendas) {
      return res.status(404).json({ error: "Venda nao foi encontrada" });
    }
    vendas.venda = descricao;
    vendas.notaFiscal = notaFiscal;
    vendas.produtosIds = produtosIds;
    await vendas.save();
    res.status(200).json(vendas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function apaga(req, res) {
  try {
    const { id } = req.params;
    const vendas = await Venda.findByPk(id);
    if (!vendas) {
      return res.status(404).json({ error: "Venda nao foi encontrada!" });
    }
    await vendas.destroy();
    res.status(204).json({ status: "Venda apagada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { findAll, cria, findOne, update, apaga };
