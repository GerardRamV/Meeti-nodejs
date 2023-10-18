const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const path = require('path');
const router = require('./routes');
const bodyParser = require('body-parser')
const flash = require('connect-flash');
const passport = require('./config/passport');
const session = require('express-session');

const db = require('./config/bd');
require('./models/Usuarios')
db.sync().then((result) => { 
    console.log("Conexion exitosa");
}).catch((err) => {
    console.log(err);
});

require('dotenv').config({path: 'variables.env'});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'))

app.use(express.static('public'));

app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.mensajes = req.flash();
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();
});

app.use('/', router());

app.listen(process.env.PORT, '192.168.1.101', () => {
    console.log(`El servidor esta funcionando en el puerto ${process.env.PORT}`);
});

