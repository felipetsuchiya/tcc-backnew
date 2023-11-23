const { response } = require("express");
const Produto = require("../../models/produto");
const VendasProduto = require("../../models/vendaProdutos");

async function findAll(req, res) {
  try {
    const url = "http://127.0.0.1:5000/previsoes";
    const data = await fetch(url).then(async (response) => {
      // Verifica se a resposta da requisição foi bem-sucedida (status 200)
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      // Parseia a resposta como JSON
      const responseData = await response.json();
      return responseData;
    });

    const objCompleto = await Promise.all(
      data.map(async (item) => {
        const produtos = await Produto.findOne({
          where: {
            id: item.id,
          },
        });

        const previsoes = item.previsoes.map((previsao) => previsao);

        return {
          produto: produtos,
          previsoes: previsoes,
        };
      })
    );

    return res.status(200).json({ objCompleto });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e.message });
  }
}

async function mostSoldProduct(req, res) {
  try {
    const vendasProd = await VendasProduto.findAll();
    const produtos = await Produto.findAll();

    // Calcular a quantidade total vendida para cada produto
    const quantidadeVendidaPorProduto = {};
    vendasProd.forEach((venda) => {
      const produtoId = venda.ProdutoId;
      quantidadeVendidaPorProduto[produtoId] = (quantidadeVendidaPorProduto[produtoId] || 0) + venda.quantidadeVendida;
    });

    // Encontrar o produto mais vendido e o menos vendido
    let produtoMaisVendidoId, quantidadeMaisVendida = 0;
    let produtoMenosVendidoId, quantidadeMenosVendida = Infinity;

    Object.keys(quantidadeVendidaPorProduto).forEach((produtoId) => {
      const quantidadeVendida = quantidadeVendidaPorProduto[produtoId];

      if (quantidadeVendida > quantidadeMaisVendida) {
        produtoMaisVendidoId = produtoId;
        quantidadeMaisVendida = quantidadeVendida;
      }

      if (quantidadeVendida < quantidadeMenosVendida) {
        produtoMenosVendidoId = produtoId;
        quantidadeMenosVendida = quantidadeVendida;
      }
    });

    // Encontrar os dados do produto mais vendido e menos vendido
    const produtoMaisVendido = produtos.find((produto) => produto.id === parseInt(produtoMaisVendidoId));
    const produtoMenosVendido = produtos.find((produto) => produto.id === parseInt(produtoMenosVendidoId));

    console.log({ produtoMaisVendido, produtoMenosVendido });
    res.status(200).json({ produtoMaisVendido, produtoMenosVendido });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


module.exports = { findAll, mostSoldProduct };
