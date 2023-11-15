const VendaProduto = require("../../models/vendaProdutos/index");

async function findAll(req, res) {
  try {
    const venda = await VendaProduto.findAll(); //{include: [{model: Produto,through: {attributes: ['descricao']}}]}
    res.status(200).json(venda);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function cria(prods_id, vend_id) {
  try {
    const list = [];
    prods_id.forEach(i => {
      list.add(i)
    });
    const vendasProd = await VendaProduto.create({
      ProdutoId: prod_id,
      VendasId: vend_id,
    });
    print(vendasProd);
  } catch (error) {
    console.log({ error: error.message });
  }
}


module.exports = { findAll, cria};
