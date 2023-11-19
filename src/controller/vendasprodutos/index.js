const { response } = require("express");
const Produto = require("../../models/produto");

async function findAll(req, res) {
  try {
    const url = "http://127.0.0.1:5000/previsoes";

    let objPrevisoes = await fetch(url)
      .then((response) => {
        // Verifica se a resposta da requisição foi bem-sucedida (status 200)
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }
        // Parseia a resposta como JSON
        return response.json();
      })
      .then(async (data) => {
        // Manipula os dados recebidos
        const response = [];

        for (const idProduto in data) {
          const produtos = await Produto.findOne({
            where: {
              id: idProduto,
            },
          });

          const previsoes = data[idProduto].map((previsao) => previsao);

          const produtoPrevisoes = {
            produto: produtos,
            previsoes: previsoes,
          };

          response.push(produtoPrevisoes);
        }

        return response;
      });

    console.log(objPrevisoes);

    return res.status(200).json({ objPrevisoes });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

module.exports = { findAll };
