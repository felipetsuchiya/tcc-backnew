const Produtos = require("../../models/produto/index.js");
const Venda = require("../../models/vendas/index.js");
const { Sequelize } = require('sequelize')
const fs = require('fs');
const Op = Sequelize.Op;

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

async function findWithFilter(req, res) {
  try {
    let filter = req. body
    var filterSaleProduct = {};
    var filterProduct = {};
    
    if(isValid(filter.produto)){
      filterSaleProduct.nome = {
        [Op.like]: "%"+filter.produto+"%"
      };
    }
    if(isValid(filter.id)){
      filterProduct.id = filter.id;
    }
    if(isValid(filter.dataInicio) && isValid(filter.dataFim)){
      filterProduct.dataVenda = {
        [Op.between]: [filter.dataInicio, filter.dataFim]
      };
    } else if(isValid(filter.dataFim)) {
      filterProduct.dataVenda = {
        [Op.lt]: filter.dataFim,
      };
    } else if(isValid(filter.dataInicio)) {
      filterProduct.dataVenda = {
        [Op.gt]: filter.dataInicio,
      };
    }
    
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
        },
        where: filterSaleProduct
      },
      where: filterProduct
    }); //{include: [{model: Produto,through: {attributes: ['descricao']}}]}
    res.status(200).json(venda);
    //res.status(200).json(resSQL[0]);
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
    const { descricao, notaFiscal, produtosIds, dataVenda } = req.body;
    // const dataVenda = new Date();

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

function isValid(param) {
  if(param != undefined && param != null && param != ""){
    return true;
  }
  return false;
}

module.exports = { findWithFilter, findAll, cria, findOne, update, apaga };
