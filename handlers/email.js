const nodemailer = require('nodemailer');
const emailConfig = require('../config/email');
const fs = require('fs');
const util = require('util');
const ejs = require('ejs');

let transport = nodemailer.createTransport(emailConfig);

exports.enviarEmail =  async (opciones) => {

    const archivo = __dirname + `/../views/emails/${opciones.archivo}.ejs`;
    const compilado = ejs.compile(fs.readFileSync(archivo, 'utf-8'));
    const html = compilado({url: opciones.url});
    const opcionesEmail = {
        from: 'Meeti <noreply@meeti.com>',
        to: opciones.usuario.email,
        subject: opciones.subject,
        html
    };

    const sendEmail = util.promisify(transport.sendMail, transport);

    return sendEmail.call(transport, opcionesEmail);
};
