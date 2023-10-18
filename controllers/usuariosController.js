const {check, validationResult, body} = require('express-validator');
const Usuarios = require("../models/Usuarios");
const { enviarEmail } = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta'
    });
};

exports.crearNuevaCuenta = async (req, res) => {
    const usuario = req.body;

    await body('confirmar')
        .notEmpty().withMessage('La confirmacion del password no puede ir vacia')
        .equals(req.body.password).withMessage('El password no coincide')
        .run(req);
    let resultadoValidacion = validationResult(req);
    if (!resultadoValidacion.isEmpty()) {
        const errorExp = resultadoValidacion.array().map(res => res.msg);
        req.flash('error', errorExp);
        return res.redirect('/crear-cuenta');
    }

    try {
        const nuevoUsuario = await Usuarios.create(usuario);

        const url = `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`;

        await enviarEmail({
            usuario,
            url,
            subject: 'Confirma tu cuenta de Meeti',
            archivo: 'confirmar-cuenta'
        });

        req.flash('exito', "Hemos enviado correo para confirmar tu cuenta");
        res.redirect('/iniciar-sesion');
    } catch (error) {
        const erroresSequelize = error.errors.map((err) => err.message);

        req.flash('error', erroresSequelize);
        res.redirect('/crear-cuenta');
    }

};

exports.confirmarCuenta = async (req, res, next) => {
    // console.log(req.query);  // querystring 
    // console.log(req.body);  // formularios
    // console.log(req.params);  // atributos en la url 
    const usuario =  await Usuarios.findOne({where: { email: req.params.correo}});

    if (!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/crear-cuenta');
        return next();
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('exito', 'La cuenta se ha confirmado, ya puedes iniciar sesion');
    res.redirect('/iniciar-sesion');
    
};

exports.formIniciarSesion = (req, res) => {
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar Sesion'
    });
};

