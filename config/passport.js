const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuarios = require('../models/Usuarios');

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
    },
    async (email, password, next) => {
        const usuario = await Usuarios.findOne({ where: { email: email, activo: 1 } });

        if (!usuario) return next(null, false, { message: 'Ese usuario no existe o no ha confirmado su cuenta' });

        const verificarPass = usuario.validarPassword(password);

        if (!verificarPass) return next(null, false, { message: 'Password incorrecto' });

        next(null, usuario);
    }
));

passport.serializeUser((usuario, cb) => {
    return cb(null, usuario);
});

passport.deserializeUser((usuario, cb) => {
    return cb(null, usuario);
});

module.exports = passport; 
