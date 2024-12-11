require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.error('Error conectándose a la base de datos:', err);
        return;
    }
    console.log('Conexión a la base de datos exitosa');
    connection.end();
});

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Prueba de conexión a la base de datos');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto: ${port}`);
});
