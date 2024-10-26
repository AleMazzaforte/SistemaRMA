const fs = require('fs');
const path = require('path');
const db = require('../db'); // Asegúrate de importar la conexión a la base de datos

// Función para cargar productos desde el JSON
const cargarProductos = async (req, res) => {
    try {
        // Leer el archivo JSON
        const filePath = path.join(__dirname, '../public/skuListado.js');

        // Usar fs.promises para leer el archivo de manera asíncrona
        const data = await fs.promises.readFile(filePath, 'utf8');
        const productos = JSON.parse(data);

        // Preparar la consulta SQL para insertar productos
        const sql = 'INSERT INTO productosGeneral (sku, marca, descripcion) VALUES ?';
        const valores = productos.map(producto => [producto.sku, producto.marca, producto.descripcion]);

        // Ejecutar la consulta
        const [results] = await db.conn.query(sql, [valores]);

        res.send(`Se han insertado ${results.affectedRows} productos.`);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        res.status(500).send('Error al cargar productos en la base de datos.');
    }
};

module.exports = { cargarProductos };
