const express = require('express');
const VendasProdutosController = require("../../controller/vendasprodutos")

const router = express.Router();

router.post('/vendasprod', async (req, res) => {
    VendasProdutosController.cria(req, res)
})

router.get('/vendasprod/:id', (req, res) => {
    VendasProdutosController.findOne(req, res)
})

router.get('/vendasprod', async (req, res) => {
    VendasProdutosController.findAll(req, res)
})

router.put('/vendasprod/:id', async (req, res) => {
    VendasProdutosController.update(req, res)
});

router.delete('/vendasprod/:id', async (req, res) => {
    VendasProdutosController.apaga(req, res)
});

module.exports = router;