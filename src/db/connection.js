const Sequelize = require('sequelize');

const sequelize = new Sequelize('yohodb','root','yoho1234', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;