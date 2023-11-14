const express = require('express');
const sequelize = require('./db/connection');
const routesProdutos = require('./routes/produtos/routes.js')
const routesVendas = require('./routes/vendas/routes.js')
const cors = require('cors')

const app = express();
app.use(cors())

const PORT = 3001;

app.use(express.json());
app.use(routesProdutos);
app.use(routesVendas);

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT} 🚀`)
    })
})