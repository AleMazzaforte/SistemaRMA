const { conn } = require('../bd/bd');

module.exports = {
    getAgregarTransporte: (req, res) => {
        res.render('cargarTransporte');
    },

    postAgregarTransporte: async (req, res) => {
        const sql = `INSERT INTO transportes (nombre, direccionLocal, telefono) VALUES (?, ?, ?)`;
        let connection;
        try {
            connection = await conn.getConnection(); // Obtén la conexión del pool
            await connection.query(sql, [req.body.nombre, req.body.direccionLocal, req.body.telefono]);
            res.render('cargarTransporte');
        } catch (error) {
            console.error('Error al agregar transporte:', error);
            res.status(500).send('Error al agregar transporte');
        } finally {
            if (connection) connection.release();  // Libera la conexión
        }
    },

    getListarTransportes: async (req, res) => {
        const sql = `SELECT idTransporte, nombre, direccionLocal, telefono FROM transportes`;
        let connection;
        try {
            connection = await conn.getConnection(); // Obtén la conexión del pool
            const [query] = await connection.query(sql);
            res.json(query);
        } catch (error) {
            console.error('Error al listar transportes:', error);
            res.status(500).json({ message: 'Error al listar transportes' });
        } finally {
            if (connection) connection.release();  // Libera la conexión
        }
    },

    getGestionarTransportes: (req, res) => {
        let transporte = {};
        res.render('cargarTransporte', { transporte: transporte });
    },

    postActualizarTransporte: async (req, res) => {
        const idTransporte = req.params.idTransporte;
        const { nombre, direccionLocal, telefono } = req.body;  // Captura los datos del body
        const sql = `UPDATE transportes SET nombre = ?, direccionLocal = ?, telefono = ? WHERE idTransporte = ?`;  // Consulta SQL para actualizar
        let connection;
        try {
            connection = await conn.getConnection(); // Obtén la conexión del pool
            await connection.query(sql, [nombre, direccionLocal, telefono, idTransporte]);  // Ejecuta la consulta con los datos
            res.redirect('/gestionarTransporte');  // Redirige después de la actualización
        } catch (error) {
            console.error('Error al actualizar el transporte:', error);
            res.status(500).send('Ocurrió un error al intentar actualizar el transporte');  // Muestra un mensaje de error si ocurre algún problema
        } finally {
            if (connection) connection.release();  // Libera la conexión
        }
    },

    postEliminarTransporte: async (req, res) => {
        const idTransporte = req.params.idTransporte;  // Captura el idTransporte desde los parámetros
        const sql = `DELETE FROM transportes WHERE idTransporte = ?`;  // Consulta SQL para eliminar
        let connection;
        try {
            connection = await conn.getConnection(); // Obtén la conexión del pool
            await connection.query(sql, [idTransporte]);  // Ejecuta la consulta con el id
            res.redirect('/gestionarTransporte');  // Redirige a la lista de transportes después de la eliminación
        } catch (error) {
            console.error('Error al eliminar el transporte:', error);  // Muestra el error en la consola
            res.status(500).send('Ocurrió un error al intentar eliminar el transporte');  // Envía una respuesta de error al cliente
        } finally {
            if (connection) connection.release();  // Libera la conexión
        }
    }
};
