const Produtos = require("../../models/produto/index.js");

async function findAll(req, res) {
  try {
    const produtos = await Produtos.findAll(); 
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

function findOne(req, res) {
  try {
    const { name } = req.query;
    const filteredProducts = Produtos.filter((produto) => {
      produto.name.toLowerCase().includes(name.toLowerCase());
    });
    res.status(200).json(filteredProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function cria(req, res) {
  try {
    const { nome, marca, tipoDeProduto, tamanho, sabor, preco, quantidade } = req.body;

    const produto = await Produtos.create({
      nome,
      tipoDeProduto,
      sabor,
      preco,
      marca,
      tamanho,
      quantidade
    });
    res.status(201).json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { nome, marca, descricao, tamanho, sabor, quantidade } = req.body;
    const produto = await Produtos.findByPk(id);
    if (!produto) {
      return res.status(404).json({ error: "Produto nao foi encontrado" });
    }
    produto.nome = nome;
    produto.marca = marca;
    produto.descricao = descricao;
    produto.tamanho = tamanho;
    produto.sabor = sabor;
    produto.quantidade = quantidade
    await produto.save();
    res.status(200).json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function apaga(req, res) {
  try {
    const { id } = req.params;
    const produto = await Produtos.findByPk(id);
    if (!produto) {
      return res.status(404).json({ error: "Produto nao foi encontrado!" });
    }
    await produto.destroy();
    res.status(204).json({ status: "Produto apagado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { findAll, cria, findOne, update, apaga };
