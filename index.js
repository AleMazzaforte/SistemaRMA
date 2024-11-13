const express = require('express');
const path = require('path');
const rutas = require('./rutas/rutas.js');
const session = require('express-session');
require('dotenv').config();
const cors = require('cors');




const port = process.env.PORT ;

const app = express();

// Configuración de express-session
app.use(session({
    secret: process.env.SECRET_KEY,  
    resave: false,  // No vuelve a guardar la sesión si no se modifica
    saveUninitialized: false,  // No guarda sesiones no inicializadas
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }  // Si estás en producción, cambia a `true` solo si usas HTTPS
}));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.static(path.join(__dirname, 'public')));

// Middleware para procesar formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// Usar las rutas importadas
app.use('/', rutas);



app.listen(port, '0.0.0.0', (req, res) => {
    console.log(`Servidor corriendo en puerto:  ${port}`);
})

 