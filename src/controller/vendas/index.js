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
    const { descricao, notaFiscal, valorTotal } = req.body;
    const dataVenda = new Date();
    const vendas = await Venda.create({
      descricao,
      notaFiscal,
      valorTotal,
      dataVenda,
    });
    res.status(201).json(vendas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { venda, produto_id } = req.body;
    const vendas = await Venda.findByPk(id);
    if (!vendas) {
      return res.status(404).json({ error: "Venda nao foi encontrada" });
    }
    vendas.venda = nome;
    vendas.produto_id = marca;
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
