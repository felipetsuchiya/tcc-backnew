const express = require('express');
const Vendas = require('../../models/vendas');
const VendasController = require("../../controller/vendas")

const router = express.Router();

router.post('/vendas', async (req, res) => {
    VendasController.cria(req, res)
})

router.post('/vendas/filtro', async (req, res) => {
    VendasController.findWithFilter(req, res)
})

router.get('/vendas/:id', (req, res) => {
    VendasController.findOne(req, res)
})

router.get('/vendas', async (req, res) => {
    VendasController.findAll(req, res)
})

router.put('/vendas/:id', async (req, res) => {
    VendasController.update(req, res)
});

router.delete('/vendas/:id', async (req, res) => {
    VendasController.apaga(req, res)
});

module.exports = router;