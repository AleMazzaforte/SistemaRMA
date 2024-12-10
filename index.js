require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const rutas = require('./rutas/rutas.js');
const { conn } = require('./bd/bd.js')

const cors = require('cors');
const port = process.env.PORT;
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.static(path.join(__dirname, 'public')));

// Middleware para procesar formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: "sistema-rma.vercel.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(cookieParser());
// Usar las rutas importadas
app.use('/', rutas);



app.listen(port, (req, res) => {
    console.log(`Servidor corriendo en puerto:  ${port}`);
})

 