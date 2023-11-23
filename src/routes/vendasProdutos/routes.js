const express = require('express');
const VendasProdutosController = require("../../controller/vendasprodutos")

const router = express.Router();

router.get('/vendasprod', async (req, res) => {
    VendasProdutosController.findAll(req, res)
})

router.get('/produtomaisoumenos', async (req, res) => {
    VendasProdutosController.mostSoldProduct(req, res)
})

module.exports = router;