const { conn } = require('../bd/bd');

module.exports = {
    cargarProductos: (req, res) => {
        // Renderiza el archivo EJS
        res.render('cargarProductos');
    },

    agregarProductoNuevo: async (req, res) => {
        const { sku, marca, descripcion, rubro } = req.body; // Extrae los datos del formulario
        const query = 'INSERT INTO productos (sku, marca, descripcion, rubro) VALUES (?, ?, ?, ?)';
        let connection;

        try {
            // Obtiene una conexión del pool
            connection = await conn.getConnection();
            // Usa await para ejecutar la consulta
            await connection.query(query, [sku, marca, descripcion, rubro]);
            // Redirige a la página de carga de productos después de agregar exitosamente
            res.redirect('/cargarProductos');
        } catch (err) {
            console.error('Error al agregar el producto:', err);
            return res.status(500).send('Error al agregar el producto');
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },

    getListarProductos: async (req, res) => {
        const query = 'SELECT id, sku, descripcion, marca, rubro FROM productos';
        let connection;

        try {
            // Obtiene una conexión del pool
            connection = await conn.getConnection();
            const [results] = await connection.query(query);
            res.json(results);
        } catch (error) {
            console.error('Error al listar productos:', error);
            res.status(500).send('Error al listar productos');
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },

    actualizarProducto: async (req, res) => {
        const { sku, marca, descripcion, rubro } = req.body;
        const { id } = req.params;
        const query = 'UPDATE productos SET sku = ?, marca = ?, descripcion = ?, rubro = ? WHERE id = ?';
        let connection;

        try {
            // Obtiene una conexión del pool
            connection = await conn.getConnection();
            await connection.query(query, [sku, marca, descripcion, rubro, id]);
            res.json({ success: true, message: 'Producto actualizado correctamente' });
        } catch (err) {
            console.error('Error al actualizar el producto:', err);
            res.status(500).send('Error al actualizar el producto');
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },

    eliminarProducto: async (req, res) => {
        const { sku } = req.body;
        const query = 'DELETE FROM productos WHERE sku = ?';
        let connection;

        console.log('req.body', req.body);
        try {
            // Obtiene una conexión del pool
            connection = await conn.getConnection();
            await connection.query(query, [sku]);
            res.json({ success: true, message: 'Producto eliminado correctamente' });
        } catch (err) {
            console.error('Error al eliminar el producto:', err);
            res.status(500).send('Error al eliminar el producto');
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }
};
