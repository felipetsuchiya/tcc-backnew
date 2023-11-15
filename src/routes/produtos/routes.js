const express = require('express');
const ProdutoController = require("../../controller/produto")

const router = express.Router();

router.post('/produtos', async (req, res) => {
    ProdutoController.cria(req, res)
})

router.get('/produto/:name', (req, res) => {
    ProdutoController.findOne(req, res)
})

router.get('/produtos', async (req, res) => {
    ProdutoController.findAll(req, res)
})

router.put('/produtos/:id', async (req, res) => {
    ProdutoController.update(req, res)
});

router.delete('/produtos/:id', async (req, res) => {
    ProdutoController.apaga(req, res)
});

module.exports = router;