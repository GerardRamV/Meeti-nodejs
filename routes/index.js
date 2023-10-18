const express = require('express');
const { home } = require('../controllers/homeController');
const { formCrearCuenta, crearNuevaCuenta, formIniciarSesion, confirmarCuenta } = require('../controllers/usuariosController');
const { autenticarUsuario } = require('../controllers/authController');
const router = express.Router();

module.exports = function () {
    router.get('/', home);

    router.get('/crear-cuenta', formCrearCuenta);
    router.post('/crear-cuenta', crearNuevaCuenta);

    router.get('/confirmar-cuenta/:correo', confirmarCuenta);

    router.get('/iniciar-sesion', formIniciarSesion);
    router.post('/iniciar-sesion', autenticarUsuario);

    router.get('/administracion', (req, res) => res.send('Aqui va la administracion'));

    return router;
}