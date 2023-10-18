const Sequelize = require('sequelize');
require('dotenv').config({path: 'variables.env'});

module.exports = new Sequelize(process.env.NAMEDB, process.env.USERDB, process.env.PASSWORDDB, {
    host: process.env.HOSTDB,
    port: process.env.PORTDB,
    dialect: process.env.DIALECTDB,
    pool: {
        max: 5,
        min: 0,
        acquiere: 30000,
        idle: 10000
    },
    // logging: false
});