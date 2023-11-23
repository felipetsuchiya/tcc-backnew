const { response } = require("express");
const Produto = require("../../models/produto");

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

module.exports = { findAll };
