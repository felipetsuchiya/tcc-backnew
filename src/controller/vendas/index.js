const Produtos = require("../../models/produto/index.js");
const Venda = require("../../models/vendas/index.js");

async function findAll(req, res) {
  try {
    const venda = await Venda.findAll(); //{include: [{model: Produto,through: {attributes: ['descricao']}}]}
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
    const vendas = await Venda.create(
      {
        descricao,
        notaFiscal,
        dataVenda,
        valorTotal,
      },
      {
        include: Produtos,
      }
    );

    // Verifica se há produtos associados à venda
    if (produtosIds.length > 0) {
      const produtos = await Produtos.findAll({
        where: {
          id: produtosIds,
        },
      });
      valorTotal = produtos.reduce(
        (total, produto) => total + produto.preco,
        0
      );
      // Atualiza o valorTotal da venda
      await vendas.update({
        valorTotal,
      });
      await vendas.setProdutos(produtos);
      console.log(produtos);
    }

    if (!Array.isArray(produtosIds)) {
      return res.status(400).json({ error: "produtosIds deve ser uma array" });
    }

    await vendas.addProdutos(produtosIds);
    console.log(produtosIds);

    res.status(201).json({ vendas: vendas, produtosIds: produtosIds });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    vendas.notaFiscal = notaFiscal
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
