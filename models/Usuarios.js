const Sequelize = require('sequelize');
const db = require('../config/bd');
const bcrypt = require('bcrypt');

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.STRING(60),
    image: Sequelize.STRING(60),
    email: {
        type: Sequelize.STRING(30),
        allowNull: false,
        validate: {
            isEmail: {msg: 'Agrega un correo valido'}
        },
        unique: {
            args: true,
            msg: 'Correo registrado'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El password no pede ir vacio'
            }
        }
    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    tokenPassword: Sequelize.STRING,
    expiraToken: Sequelize.DATE
},
{
    hooks:{
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, 10);
        },
    }
});

Usuarios.prototype.validarPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = Usuarios;