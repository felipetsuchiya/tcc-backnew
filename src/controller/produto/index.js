const sequelize = require("../../db/connection.js");
const Produtos = require("../../models/produto/index.js");

async function findAll(req, res) {
  try {
    const produtos = await Produtos.findAll(); 
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function findWithFilter(req, res) {
  try {
    //produtos = await Produtos.findAll(); 
    var sql = "SELECT * FROM produtos";
    var whereSql = "";
    let filter = req.body
    
    if(filter.produto != undefined && filter.produto != null && filter.produto != ""){
      whereSql += " and nome LIKE :produto"
    }
    if(filter.tamanho != undefined && filter.tamanho != null){
      whereSql += " and tamanho = :tamanho"
    }
    if(filter.tipo != undefined && filter.tipo != null && filter.tipo != ""){
      whereSql += " and tipoDeProduto LIKE :tipoDeProduto"
    }
    if(filter.sabor != undefined && filter.sabor != null && filter.sabor != ""){
      whereSql += " and sabor LIKE :sabor"
    }
    if(filter.marca != undefined && filter.marca != null && filter.marca != ""){
      whereSql += " and marca LIKE :marca"
    }
    
    whereSql = whereSql.indexOf(' and ') == 0 ? whereSql.substring(5).trim() : whereSql.trim();
    if(whereSql != "")sql = sql + " WHERE " +whereSql;

    let resSQL = await sequelize.query(sql, {
      raw: true,
      replacements: {
        produto: "%"+filter.produto+"%",
        tamanho: filter.tamanho,
        tipoDeProduto: "%"+filter.tipo+"%",
        sabor: "%"+filter.sabor+"%",
        marca: "%"+filter.marca+"%",
      },
    });
    res.status(200).json(resSQL[0]);
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
    const { nome, marca, descricao, tamanho, sabor, quantidade, tipoDeProduto, preco } = req.body;
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
    produto.tipoDeProduto = tipoDeProduto;
    produto.preco = preco
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

module.exports = { findAll, cria, findOne, findWithFilter, update, apaga };
